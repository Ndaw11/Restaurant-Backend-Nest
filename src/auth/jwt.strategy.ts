import { Injectable } from "@nestjs/common";

// PassportStrategy = classe de base de NestJS pour créer une stratégie personnalisée
import { PassportStrategy } from "@nestjs/passport";

// ExtractJwt = méthode pour dire "où chercher le token JWT dans la requête"
// Strategy = la stratégie JWT de base de Passport
import { ExtractJwt,Strategy } from "passport-jwt";

import { ConfigService } from "@nestjs/config";
// Cette classe est une stratégie Passport, configurée pour JWT
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    
    constructor(private configService: ConfigService){
        // "!" pour preciser que ce existe et qu'il ne sera pas undefined
        const secretkey = configService.get<string>('JWT_SECRET')!;
         // 🔐 Configure la stratégie JWT avec deux options principales :
        super({
            // 📌 Indique où récupérer le token JWT dans la requête : 
            // dans le header Authorization: Bearer <token>
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 🔑 Clé secrète utilisée pour vérifier la signature du token 
            // (doit être la même que celle utilisée pour le signer dans auth.module.ts)
            secretOrKey: secretkey,
        })
    }
    

    // 🔍 Cette méthode est appelée automatiquement quand un token est détecté et valide
  // Le "payload" est le contenu du token (ce qu’on a mis lors du .sign dans _signToken)
     async validate(payload: any) {
    // ✅ Ce que tu retournes ici sera injecté automatiquement dans req.user dans les routes protégées
    return {
      id: payload.sub,        // sub = "subject" → c’est l’id de l’utilisateur
      email: payload.email,   // email de l’utilisateur, utile pour les logs ou vérifs
      role: payload.role      // rôle (ex: ADMIN, CLIENT...) → utile pour les permissions
    };
  }
}