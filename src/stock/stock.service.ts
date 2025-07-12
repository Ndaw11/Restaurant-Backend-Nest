import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StockDto,  MouvementStockDto} from './stockDto/Stock.dto';
import { TypeMouvement } from 'generated/prisma';


@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  // Récupérer le stock actuel pour tous les produits
async findAllStock(): Promise<StockDto[]> {
  const lots = await this.prisma.lotStock.findMany({
    include: {
      produit: {
        select: {
          id: true,
          nom: true,
          seuilMinimum: true,
          fournisseurs: { select: { prix: true } },
        },
      },
    },
  });

  return lots.map(lot => {
    const coûtUnitaire = lot.produit.fournisseurs.length > 0
      ? lot.produit.fournisseurs.reduce((sum, f) => sum + f.prix, 0) / lot.produit.fournisseurs.length
      : 0;

    return {
      id: lot.id,
      produitId: lot.produitId,
      nomProduit: lot.produit.nom,
      quantité: lot.quantité,
      seuilMinimum: lot.produit.seuilMinimum,
      datePeremption: lot.datePeremption.toISOString(),
      coûtUnitaire,
      alerteNiveauBas: lot.quantité <= lot.produit.seuilMinimum,
    };
  });
}


async findStockParProduit(): Promise<StockDto[]> {
  const produits = await this.prisma.produit.findMany({
    include: {
      stock: true, // relation produit.lots
      fournisseurs: true,
    },
  });

  return produits.map((produit) => {
    const totalQuantité = produit.stock.reduce((sum, lot) => sum + lot.quantité, 0);
    const coûtUnitaire =
      produit.fournisseurs.length > 0
        ? produit.fournisseurs.reduce((sum, f) => sum + f.prix, 0) / produit.fournisseurs.length
        : 0;

    return {
      id: produit.id, // ici c'est produit.id, pas lot.id
      produitId: produit.id,
      nomProduit: produit.nom,
      quantité: totalQuantité,
      seuilMinimum: produit.seuilMinimum,
      datePeremption: produit.stock.length > 0
        ? produit.stock.reduce((earliest, lot) => 
            lot.datePeremption < earliest ? lot.datePeremption : earliest,
          produit.stock[0].datePeremption
        ).toISOString()
        : new Date().toISOString(), // fallback
      coûtUnitaire,
      alerteNiveauBas: totalQuantité <= produit.seuilMinimum,
    };
  });
}



  // Récupérer l'historique des mouvements avec filtre optionnel (Entrée, Sortie, ou tous)
async findMouvementsStock(filter?: TypeMouvement): Promise<MouvementStockDto[]> {
  const where = filter ? { typeMouvement: filter } : {};
  const mouvements = await this.prisma.mouvementStock.findMany({
    where,
    include: {
      lotStock: {
        select: {
          id: true,
          datePeremption: true,
        },
      },
      produit: {
        select: { id: true, nom: true },
      },
    },
    orderBy: { date: 'desc' },
  });

  return mouvements.map(m => ({
    id: m.id,
    lotStockId: m.lotStockId,
    produitId: m.produitId,
    nomProduit: m.produit.nom,
    quantité: m.quantité,
    typeMouvement: m.typeMouvement,
    date: m.date.toISOString(),
    createdAt: m.createdAt.toISOString(),
  }));
}

async updateStockFromCommande(commandeId: number): Promise<void> {
  const commande = await this.prisma.commandeStock.findUnique({
    where: { id: commandeId },
    include: { lignes: { include: { produit: true } } },
  });

  if (!commande) throw new NotFoundException(`Commande ${commandeId} non trouvée`);

  for (const ligne of commande.lignes) {
    // Créer un nouveau lot pour cette commande avec datePeremption (à récupérer depuis ligne ?)
    // Supposons que la date de péremption est passée dans LigneCommandeStock (à ajouter si besoin)
    // Si pas dans la ligne, il faudra la récupérer d'une autre source (commande, fournisseur, etc)

    // Ici on va supposer ligne a une propriété datePeremption (à ajouter au modèle)
    const datePeremption = (ligne as any).datePeremption || new Date(Date.now() + 30*24*3600*1000); // fallback 30 jours

    const lot = await this.prisma.lotStock.create({
      data: {
        produitId: ligne.produitId,
        quantité: ligne.quantité,
        datePeremption,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Enregistrer le mouvement d'entrée sur ce lot
    await this.prisma.mouvementStock.create({
      data: {
        produitId: ligne.produitId,
        lotStockId: lot.id,
        quantité: ligne.quantité,
        typeMouvement: TypeMouvement.Entrer,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}


  // Enregistrer une sortie manuelle (par exemple, perte ou utilisation)
async recordStockSortie(produitId: number, quantité: number): Promise<void> {
  // Récupérer les lots disponibles triés par datePeremption asc (plus ancien d'abord)
  const lots = await this.prisma.lotStock.findMany({
    where: {
      produitId,
      quantité: { gt: 0 },
    },
    orderBy: { datePeremption: 'asc' },
  });

  let qtyRestante = quantité;

  for (const lot of lots) {
    if (qtyRestante <= 0) break;

    const qtyPrise = Math.min(lot.quantité, qtyRestante);

    // Décrémenter le lot
    await this.prisma.lotStock.update({
      where: { id: lot.id },
      data: {
        quantité: { decrement: qtyPrise },
        updatedAt: new Date(),
      },
    });

    // Enregistrer le mouvement sortie sur ce lot
    await this.prisma.mouvementStock.create({
      data: {
        produitId,
        lotStockId: lot.id,
        quantité: qtyPrise,
        typeMouvement: TypeMouvement.Sortie,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    qtyRestante -= qtyPrise;
  }

  if (qtyRestante > 0) {
    throw new InternalServerErrorException('Quantité insuffisante en stock');
  }
}

}