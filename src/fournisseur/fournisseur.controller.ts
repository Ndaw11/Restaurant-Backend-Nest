import { Body, Controller, Post, Get, Put, Param, ParseIntPipe } from '@nestjs/common';
import { FournisseurService } from './fournisseur.service';
import { CreateFournisseurDto } from './fournisseurDto/fournisseur.dto';
import { UpdateFournisseurDto } from './fournisseurDto/updateFournisseur.dto';
import { get } from 'http';

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

    @Post(':id/delete')
    delete(
        @Param('id', ParseIntPipe) id: number,
    ){
        return this.fournisseurService.delete(id)
    }

    @Post(':id/activateFournisseur')
    activateFournisseur(
        @Param('id', ParseIntPipe) id: number,
    ){
        return this.fournisseurService.activateFournisseur(id)
    }

}
