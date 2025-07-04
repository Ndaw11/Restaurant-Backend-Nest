import { Module } from '@nestjs/common';
import { FournisseurController } from './fournisseur.controller';
import { FournisseurService } from './fournisseur.service';

@Module({
  controllers: [FournisseurController],
  providers: [FournisseurService]
})
export class FournisseurModule {}
