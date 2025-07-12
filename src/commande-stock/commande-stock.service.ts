import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommandeStockDto } from './commandeStockDto/createCommandeStock.dto';
import { UpdateCommandeStockWithLotsDto } from './commandeStockDto/updateCommandeStock.dto';
import { Etat, TypeMouvement } from 'generated/prisma';

@Injectable()
export class CommandeStockService {

    constructor(
        private prisma: PrismaService,
    ){}


    async create(data: CreateCommandeStockDto){

        //Nom de l'attribut dans le dto create
        const {lignes, fournisseurId}= data;
        const commande = await this.prisma.commandeStock.create({
            data: {
                fournisseurId,
                //Nom de la relation dans le modele c'est pourquoi une enregistremetn automatique
                lignes: {
                     // ✅ On crée en même temps toutes les lignes de commande associée
                     // Ligne parcours lignes et retourne un tables avec une liste d'obget de element de lignes
                    create: lignes.map(ligne=>({
                        produitId: ligne.produitId,
                        quantité: ligne.quantité,
                        prixUnitaire: ligne.prixUnitaire
                    }))
                }
            },
            include:{
                //Puisqu'on autilse runrequte imbriqué ave ccreate on utilise
                // include pour récupérer aussi les lignes créées dans le retour
                // icnlude permet defaire une requete automatique join en interne 
                lignes:true // 🔁 On retourne les lignes de la commande dans la réponse finale
            }
        })

        // ✅ On retourne toute la commande créée, avec ses lignes incluses
        return commande;
      }

            /* ou ca 
        // Création d'une commande stock liée à un fournisseur (ID 1 ici en dur)
        const commande = await this.prisma.commandeStock.create({
            data: { fournisseurId: 1 }
        });

        // Création de plusieurs lignes de commande associées à cette commande
        await this.prisma.ligneCommandeStock.createMany({
            data: lignes.map(ligne => ({
            commandeId: commande.id,         // Lien avec la commande créée ci-dessus
            produitId: ligne.produitId,      // Produit concerné
            quantité: ligne.quantité,        // Quantité commandée
            prixUnitaire: ligne.prixUnitaire // Prix unitaire du produit
            }))
        });

        // Récupération de la commande avec ses lignes pour vérification ou retour au frontend
        const resultat = await this.prisma.commandeStock.findUnique({
            where: { id: commande.id },
            include: { lignes: true },
        });
        */

 async updateEtat(id: number, data: UpdateCommandeStockWithLotsDto) {
    // 🧩 1. Récupération de la commande avec ses lignes
    const commande = await this.prisma.commandeStock.findUnique({
      where: { id },
      include: {
        lignes: true,
        fournisseur: true,
      },
    });

    if (!commande) {
      throw new NotFoundException('Commande non trouvée');
    }

    // ✅ 2. Si changement vers "Terminer", créer les lots et mouvements
    if (data.etat === Etat.Terminer && commande.etat !== Etat.Terminer) {
      for (const ligne of commande.lignes) {
        // 🔍 Chercher la date de péremption associée à ce produit dans le tableau fourni
        const lotInput = data.lots.find(l => l.produitId === ligne.produitId);

        if (!lotInput) {
          throw new BadRequestException(`Date de péremption manquante pour le produit ID ${ligne.produitId}`);
        }

        // ✅ 3. Créer le lot de stock avec la date de péremption fournie
        const lot = await this.prisma.lotStock.create({
          data: {
            produitId: ligne.produitId,
            quantité: ligne.quantité,
            datePeremption: new Date(lotInput.datePeremption),
          },
        });

        // ✅ 4. Créer le mouvement de stock lié au lot
        await this.prisma.mouvementStock.create({
          data: {
            produitId: ligne.produitId,
            quantité: ligne.quantité,
            typeMouvement: TypeMouvement.Entrer,
            lotStockId: lot.id,
          },
        });
      }
    }

    // ✅ 5. Mise à jour de l’état de la commande
    return this.prisma.commandeStock.update({
      where: { id },
      data: {
        etat: data.etat,
        updatedAt: new Date(),
      },
    });
  }




        // La liste des commandes en cours
        async findAllInProgress(){
            return this.prisma.commandeStock.findMany({
                where: {etat:"En_Cours"},
                include: {
                    lignes: true,fournisseur:true
                }
            })
        }

        // La liste des commandes en cours
        async findAll(){
            return this.prisma.commandeStock.findMany({
                include: {
                    lignes: true,fournisseur:true
                }
            })
        }


        //Trouver un commande et ces Lignes
        async findOne(id: number){
            const commande = await this.prisma.commandeStock.findUnique({where: {id}});
            if(!commande) throw new NotFoundException("Commande non trouver");
            return this.prisma.commandeStock.findUnique({
                where: { id },
                include: {
                  fournisseur: true,
                  lignes: {
                    include: {
                      produit: true, // Inclut les détails du produit
                    },
                  },
                },
              });
        }
    }
