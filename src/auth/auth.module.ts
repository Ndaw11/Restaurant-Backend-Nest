// Importe le décorateur Module qui permet de 
// créer un module NestJS
import { Module } from '@nestjs/common';

// Importe le module JWT de NestJS (pour créer 
// et vérifier les tokens JWT)
import { JwtModule } from '@nestjs/jwt';

// Importe le module Passport pour la gestion des 
// stratégies d'authentification
import { PassportModule } from '@nestjs/passport';

// Importe le service d'authentification 
// (où la logique d’auth est écrite)
import { AuthService } from './auth.service';
// Importe le contrôleur d'authentification 
// (reçoit les requêtes HTTP comme login, register)
import { AuthController } from './auth.controller';

// Importe la stratégie JWT (qui dit à NestJS comment valider un token JWT)
import { JwtStrategy } from './jwt.strategy';

// Importe PrismaService : c’est ce qui permet d’utiliser Prisma pour parler à la base de données
import { PrismaService } from 'src/prisma/prisma.service';

// Importe UserService : permet d’accéder aux utilisateurs depuis la base de données
import { UserService } from 'src/user/user.service';

import { ConfigService ,ConfigModule} from '@nestjs/config';
@Module({
  
  // imports : ici on importe des modules externes nécessaires au fonctionnement de ce module
  imports: [
    PassportModule,JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async(configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'), 
      signOptions:{ expiresIn: configService.get<string>('JWT_EXPIRES_IN'),},
          }),
      }), 
  ],
  // providers : tous les services et classes utiles à l’intérieur du module
  providers: [AuthService, JwtStrategy, PrismaService, UserService],
  controllers: [AuthController]
})
export class AuthModule {}
