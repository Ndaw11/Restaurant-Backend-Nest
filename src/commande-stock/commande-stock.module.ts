import { Module } from '@nestjs/common';
import { CommandeStockController } from './commande-stock.controller';
import { CommandeStockService } from './commande-stock.service';

@Module({
  controllers: [CommandeStockController],
  providers: [CommandeStockService]
})
export class CommandeStockModule {}
