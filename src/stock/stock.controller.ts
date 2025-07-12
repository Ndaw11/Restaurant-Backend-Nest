import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockDto,  MouvementStockDto} from './stockDto/Stock.dto';
import { TypeMouvement } from 'generated/prisma';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  async getAllStock(): Promise<StockDto[]> {
    return this.stockService.findAllStock();
  }

  @Get('mouvements')
  async getMouvementsStock(
    @Query('type') type?: TypeMouvement,
  ): Promise<MouvementStockDto[]> {
    return this.stockService.findMouvementsStock(type);
  }

  @Get('produits')
async getStockParProduit(): Promise<StockDto[]> {
  return this.stockService.findStockParProduit();
}


  @Post(':commandeId/update')
  async updateStockFromCommande(
    @Param('commandeId', ParseIntPipe) commandeId: number,
  ): Promise<void> {
    return this.stockService.updateStockFromCommande(commandeId);
  }

  @Post('sortie')
  async recordStockSortie(
    @Body() body: { produitId: number; quantité: number },
  ): Promise<void> {
    return this.stockService.recordStockSortie(body.produitId, body.quantité);
  }
}