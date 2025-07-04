import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProfileModule } from './profile/profile.module';
import { FournisseurModule } from './fournisseur/fournisseur.module';
import { ProduitModule } from './produit/produit.module';
import { CommandeStockModule } from './commande-stock/commande-stock.module';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [UserModule,PrismaModule, AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // 🔥 rend disponible PARTOUT
      envFilePath: '.env',
    }),
    ProfileModule,
    FournisseurModule,
    ProduitModule,
    CommandeStockModule,
    StockModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
