import { Test, TestingModule } from '@nestjs/testing';
import { CommandeStockController } from './commande-stock.controller';

describe('CommandeStockController', () => {
  let controller: CommandeStockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommandeStockController],
    }).compile();

    controller = module.get<CommandeStockController>(CommandeStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
