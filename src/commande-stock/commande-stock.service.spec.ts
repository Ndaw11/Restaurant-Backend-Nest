import { Test, TestingModule } from '@nestjs/testing';
import { CommandeStockService } from './commande-stock.service';

describe('CommandeStockService', () => {
  let service: CommandeStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandeStockService],
    }).compile();

    service = module.get<CommandeStockService>(CommandeStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
