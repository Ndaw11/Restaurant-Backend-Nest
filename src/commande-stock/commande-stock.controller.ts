import { Body, Controller, Post, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { CommandeStockService } from './commande-stock.service';
import { CreateCommandeStockDto } from './commandeStockDto/createCommandeStock.dto';
import { UpdateCommandeStockDto } from './commandeStockDto/updateCommandeStock.dto';

@Controller('commande-stock')
export class CommandeStockController {

    constructor(
        private commandeStockService: CommandeStockService
    ){}


    //Route pour creer Commande
    @Post()
    create(
        @Body() data: CreateCommandeStockDto,
    ){
        return this.commandeStockService.create(data);
    }


    //Route pour Lister Commande en cours
    @Get('en-cours')
    findAllInProgress(){
        return this.commandeStockService.findAllInProgress();
    }


    //Route pour Lister Commande
    @Get()
    findAll(){
        return this.commandeStockService.findAll();
    }


    //Route pour Trouver Commande
    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.commandeStockService.findOne(id);
    }


    //Rendre la commande terminer
    @Put(':id')
    updateEtat(
        @Param('id', ParseIntPipe) id : number,
        @Body() data: UpdateCommandeStockDto
    ){
        return this.commandeStockService.updateEtat(id,data);
    }


}
