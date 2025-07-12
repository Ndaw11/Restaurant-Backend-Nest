import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProduitService } from 'src/produit/produit.service';
import { CreateFournisseurDto } from './fournisseurDto/fournisseur.dto';
import { FournisseurController } from './fournisseur.controller';
import { Fournisseur , Prisma} from 'generated/prisma';
import { UpdateFournisseurDto } from './fournisseurDto/updateFournisseur.dto';
import { ProduitFournisseurOutputDto } from './fournisseurDto/fournisseurOut.dto';

@Injectable()
export class FournisseurService {


    constructor(
        private prisma: PrismaService,
    ){}


    //Creer un fournisseur
    async create(data: CreateFournisseurDto){
        try{
            // ✅ On déstructure les données du DTO :
        // - `produits` contient les produits à lier
        // - `fournisseurData` contient nom, contact, delai_livraison
        const { produits, ...fournisseurData}= data ;

        // ✅ Étape 1 : Création du fournisseur dans la table `Fournisseur`
        const fournisseur= await this.prisma.fournisseur.create({data: {...fournisseurData}});

        // ✅ Étape 2 : Préparation des insertions dans la table de liaison `ProduitFournisseur`
        // Pour chaque produit, on prépare une requête pour insérer un lien avec le prix
        const creations = produits.map((prod)=>
            this.prisma.produitFournisseur.create({
                data: {
                    fournisseurId: fournisseur.id,
                    produitId: prod.produitId,
                    prix: prod.prix,
                }
            })
        )
        // Execute tout en un bloc si non fait rien Tout ou rien
        await this.prisma.$transaction(creations); 
        return fournisseur;
        }catch (error) {
  console.error('❌ Erreur détaillée :', error); // LOG COMPLET
  throw new InternalServerErrorException({
    message: "Erreur lors de la creation du fournisseur",
    details: error.message,
  });
}
    }


    //Lister les fournisseurs
    async findAll(): Promise<Fournisseur[]>{
        return this.prisma.fournisseur.findMany();
    }

    //Lister les fournisseurs
    async findAllActif(): Promise<Fournisseur[]>{
        return this.prisma.fournisseur.findMany(
            {where: {supprimer: false},
            orderBy: {createdAt:'desc'},
            include: {
                produit: {
                    include: {
                        produit: true
                    }
                }
            },
        });
    }

    //Lister les fournisseurs
    async findAllDeleted(): Promise<Fournisseur[]>{
        return this.prisma.fournisseur.findMany(
            {where: {supprimer: true},
            orderBy: {createdAt:'desc'},
            include: {
                produit: {
                    include: {
                        produit: true
                    }
                }
            },
        });
    }


    //Lister Produit et Fournisseur
    async findProduitFournisseur(){
        return this.prisma.fournisseur.findMany({
            include: {
              produit: {
                include: {
                  produit: true, // tu inclus le vrai produit
                },
              },
            },
          });
        }

    //Modifer un fournisseur
    async update(id: number, data: UpdateFournisseurDto){
        
        const {produits, ...fournisseurData}= data;
        const fournisseur= await this.prisma.fournisseur.findUnique({where: {id}});
        if(!fournisseur) throw new NotFoundException("Foutnisseur non existant");
        
        const updateFournisseur= await this.prisma.fournisseur.update({
            where: {id},
            data: fournisseurData
        });

        // 3. Mise à jour des produits liés (produitFournisseur)
        // if (produits && produits.length > 0)
        if(produits?.length){
            // Supprimer les anciens liens
            await this.prisma.produitFournisseur.deleteMany({
                where:{fournisseurId: id}
            })

            for (const p of produits){
            await this.prisma.produitFournisseur.create({
                data: {
                    fournisseurId: id,
                    produitId: p.produitId,
                    prix: p.prix
                    }
                });
            }
        }
    return updateFournisseur;
    }


    //Trouver un fournisseur
    async findOne(id: number): Promise<Fournisseur>{
        const fournisseur = await this.prisma.fournisseur.findUnique(
            {where: {id},
            include: {
                produit: {
                    include: {
                        produit: true
                    }
                }
            },
        });
        if(!fournisseur){
            throw new NotFoundException("Fournisseur non trouver")
        }
        return fournisseur;
    }


    //Archiver un fournisseur
    async delete(id: number): Promise<Fournisseur>{
        const fournisseur = await this.prisma.fournisseur.findUnique({where: {id}});
        if(!fournisseur){
            throw new NotFoundException(" Fournisseur non trouver");
        }
        return this.prisma.fournisseur.update({where: {id}, data: {supprimer: true}});
    }


    //Activer un fournisseur
    async activateFournisseur(id: number): Promise<Fournisseur>{
        const fournisseur = await this.prisma.fournisseur.findUnique({where: {id}});
        if(!fournisseur){
            throw new NotFoundException(" Fournisseur non trouver");
        }
        return this.prisma.fournisseur.update({where: {id}, data: {supprimer: false}});
    }

    async findProduitsByFournisseur(fournisseurId: number): Promise<ProduitFournisseurOutputDto[]> {
        try {
          const fournisseur = await this.prisma.fournisseur.findUnique({
            where: { id: fournisseurId },
          });
          if (!fournisseur) {
            throw new NotFoundException(`Fournisseur avec ID ${fournisseurId} non trouvé`);
          }
    
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
    
          if (produits.length === 0) {
            console.warn(`Aucun produit trouvé pour le fournisseur ID ${fournisseurId}`);
          }
    
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
      
}

