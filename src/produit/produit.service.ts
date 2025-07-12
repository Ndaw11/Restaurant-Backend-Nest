import { Injectable, InternalServerErrorException ,NotFoundException} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProduitDto } from './dto/create-produit.dto';
import { Prisma, Produit, Fournisseur } from 'generated/prisma';
import { UpdateProduitDto } from './dto/update-produit.dto';
import { ProduitFournisseurOutputDto } from '../fournisseur/fournisseurDto/fournisseurOut.dto';


@Injectable()
export class ProduitService {

    constructor( 
        private prisma : PrismaService,
        
     ){}


     async create(data: ProduitDto){
        return this.prisma.produit.create({
            data
        });
     }


     async findAll(){
        return this.prisma.produit.findMany();
     }
     async findAllActivate(){
        return this.prisma.produit.findMany({ where: {supprimer: false}});
     }

     async findAllDeleted(){
        return this.prisma.produit.findMany({ where: {supprimer: true}});
     }


     async update(id: number, data: UpdateProduitDto) :Promise<Produit>{
        const produit = await this.prisma.produit.findUnique({where: {id}});
        if(!produit) throw new NotFoundException("Produit non trouver")
        try{
            const updateData: Prisma.ProduitUpdateInput = { ...data };
            return await this.prisma.produit.update({where: {id}, data : updateData });
        }catch(error){
            throw new InternalServerErrorException("Erreur lors de la mise jours du produit")
        }       
     }


     async findOne(id: number): Promise<Produit | null>{
        return await this.prisma.produit.findUnique({where: {id}});
     }


     async delete(id:number):Promise<Produit> {
        try{
            const produit = await this.prisma.produit.findUnique({ where: { id } });
            if (!produit) {
                throw new NotFoundException(`Produit avec l'ID ${id} introuvable`);
                }
            return await this.prisma.produit.update({ where : {id}, data : {supprimer:true}});
        }catch(error){
            throw new InternalServerErrorException("Erreur Lors de la suppression du produit")
        }
     }


     async activateProduit(id:number):Promise<Produit>{
        try{
            const produit = await this.prisma.produit.findUnique({where : {id}});
            if(!produit){
                throw new NotFoundException("Produit non trouver");
            }
            return this.prisma.produit.update({where: {id}, data: {supprimer: false}})
        }catch(error){
            throw new InternalServerErrorException("Erreur lors de l'activation du produit");
        }
     }

 async findProduitsByFournisseur(fournisseurId: number): Promise<ProduitFournisseurOutputDto[]> {
    try {
      // Vérifier si le fournisseur existe
      const fournisseur = await this.prisma.fournisseur.findUnique({
        where: { id: fournisseurId },
      });
      if (!fournisseur) {
        throw new NotFoundException(`Fournisseur avec ID ${fournisseurId} non trouvé`);
      }

      // Récupérer les produits liés au fournisseur
      const produits = await this.prisma.produitFournisseur.findMany({
        where: {
          fournisseurId,
          produit: { supprimer: false },
        },
        select: {
          produitId: true,
          prix: true,
          produit: {
            select: { nom: true },
          },
        },
      });

      // Si aucun produit n'est trouvé, retourner un tableau vide avec un log
      if (produits.length === 0) {
        console.warn(`Aucun produit trouvé pour le fournisseur ID ${fournisseurId}`);
      }

      // Mapper les résultats en DTO
      return produits.map((pf) => ({
        produitId: pf.produitId,
        prix: pf.prix,
        nom: pf.produit.nom,
      }));
    } catch (error) {
      console.error('❌ Erreur détaillée lors de findProduitsByFournisseur:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'Erreur lors de la récupération des produits du fournisseur',
        details: error.message,
      });
    }
  }


  async findFournisseursByProduit(produitId: number): Promise<{ id: number; nom: string; prix: number }[]> {
    const produit = await this.prisma.produit.findUnique({ where: { id: produitId } });
    if (!produit) throw new NotFoundException('Produit non trouvé');
  
    const fournisseurs = await this.prisma.produitFournisseur.findMany({
      where: {
        produitId,
        fournisseur: { supprimer: false },
      },
      select: {
        prix: true,
        fournisseur: {
          select: {
            id: true,
            nom: true,
          },
        },
      },
    });
  
    return fournisseurs.map((pf) => ({
      id: pf.fournisseur.id,
      nom: pf.fournisseur.nom,
      prix: pf.prix,
    }));
  }
  
}
