import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // $ Rend Prisma disponible dans tous les modules sans avoir à l'importer à chaque fois
@Module({
  providers: [PrismaService],  // $ Ajoute le PrismaService aux services du module
  exports: [PrismaService],    // $ Permet aux autres modules de l’utiliser
})
export class PrismaModule {}
