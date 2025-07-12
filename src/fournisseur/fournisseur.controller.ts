import { Body, Controller, Post, Get, Put, Param, ParseIntPipe } from '@nestjs/common';
import { FournisseurService } from './fournisseur.service';
import { CreateFournisseurDto } from './fournisseurDto/fournisseur.dto';
import { UpdateFournisseurDto } from './fournisseurDto/updateFournisseur.dto';
import { get } from 'http';
import { ProduitFournisseurOutputDto } from './fournisseurDto/fournisseurOut.dto';

@Controller('fournisseur')
export class FournisseurController {

    constructor(
        private fournisseurService: FournisseurService
    ){}


    @Post()
    create(@Body() data: CreateFournisseurDto){
        return this.fournisseurService.create(data);
    }

    @Get()
    findAll(){
        return this.fournisseurService.findAll();
    }

    @Get("actif")
    findAllActif(){
        return this.fournisseurService.findAllActif();
    }

    @Get("deleted")
    findAllDeleted(){
        return this.fournisseurService.findAllDeleted();
    }

    @Get('fournisseurproduit')
    findProduitFournisseur(){
        return this.fournisseurService.findProduitFournisseur();
    }


    @Put(':id/update')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateFournisseurDto
    ){
        return this.fournisseurService.update(id,data)
    }


    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
    ){
        return this.fournisseurService.findOne(id)
    }

    @Put(':id/desactivate')
    delete(
        @Param('id', ParseIntPipe) id: number,
    ){
        return this.fournisseurService.delete(id)
    }

    @Put(':id/reactivate')
    activateFournisseur(
        @Param('id', ParseIntPipe) id: number,
    ){
        return this.fournisseurService.activateFournisseur(id)
    }

      // Nouvelle route pour récupérer les produits d'un fournisseur
  @Get(':id/produits')
  findProduitsByFournisseur(@Param('id', ParseIntPipe) id: number): Promise<ProduitFournisseurOutputDto[]> {
    return this.fournisseurService.findProduitsByFournisseur(id);
  }

}
