import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProduitService } from './produit.service';
import { ProduitDto } from './dto/create-produit.dto';
import { UpdateProduitDto } from './dto/update-produit.dto';

@Controller('produit')
export class ProduitController {

    constructor(
        private ProduitService : ProduitService,
    ){}


    //Methode ajouter
    @Post()
    create(@Body() dto:ProduitDto){
        return this.ProduitService.create(dto);
    }


    //Methode lister
    @Get("")
    FindAll(){
        return this.ProduitService.findAll();
    }


    //Methode Supprimer
    @Post(":id/delete")
    delete(@Param('id', ParseIntPipe) id: number){
        return this.ProduitService.delete(id);
    }

    //Methode MOdifier
    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateProduitDto
    ){
        return this.ProduitService.update(id,data)
    }
    

    //Methode Trouver un Produit
    @Get(':id')
    findOne( @Param('id', ParseIntPipe) id : number ){
        return this.ProduitService.findOne(id);
    }


    //Methode pour activer un produit
    @Post(':id/activate')
    activateProduit(@Param('id', ParseIntPipe) id : number){
        return this.ProduitService.activateProduit(id);
    }

}
