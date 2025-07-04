import { Injectable, InternalServerErrorException ,NotFoundException} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProduitDto } from './dto/create-produit.dto';
import { Prisma, Produit } from 'generated/prisma';
import { UpdateProduitDto } from './dto/update-produit.dto';

@Injectable()
export class ProduitService {

    constructor( 
        private prisma : PrismaService,
        
     ){}


     async create(data: ProduitDto){
        return this.prisma.produit.create({data});
     }


     async findAll(){
        return this.prisma.produit.findMany({ where: {supprimer: false}});
     }


     async update(id: number, data: UpdateProduitDto) :Promise<Produit>{
        try{
            const updateData: Prisma.ProduitUpdateInput = { ...data };
            return await this.prisma.produit.update({where: {id}, data : updateData });
        }catch(error){
            throw new InternalServerErrorException("Erreur lors de la mise jours du produit")
        }       
     }


     async findOne(id: number): Promise<Produit>{
        const produit = await this.prisma.produit.findUnique({where: {id}});
        if(!produit || produit.supprimer){
            throw new NotFoundException("Produit Non trouver")
        }
        return produit;
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


}
