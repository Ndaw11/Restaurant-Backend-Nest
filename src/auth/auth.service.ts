import { Injectable , UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDTO } from './dto/register.dto';


@Injectable() // Permet à Nest d'injecter ce service dans d'autres classes automatiquement
export class AuthService {


    constructor(
        private prisma: PrismaService,  // Injection du service Prisma (base de données)
        private jwtService: JwtService, // Injection du service JWT (création de token)
    ){}


    //  ➕ Fonction d'inscription d'un nouvel utilisateur
    async register(data: RegisterDTO){

        // 1. Hasher le mot de passe (protection des données sensibles)
        const hashed = await bcrypt.hash(data.motDePasse, 10);  // 10 = niveau de complexité


        // 2. Créer l’utilisateur dans la base de données avec Prisma
        const user = await this.prisma.user.create({
            data: {
                ...data,    // Étale toutes les propriétés du DTO (nom, email, etc.)
                motDePasse: hashed,     // Remplace le mot de passe par sa version hashée
                role: 'Client',     // Définit un rôle par défaut
            },
        });


        // 3. Retourne un token JWT signé pour cet utilisateur
        return this._signToken(user.id, user.email, user.role);
    }


    // 🔐 Fonction de connexion (login)
    async login(email: string, motDePasse: string){

        // 1. Cherche l’utilisateur dans la base de données par son email
        const user = await this.prisma.user.findUnique({where : {email }});

        // 2. Si aucun utilisateur trouvé, on rejette la connexion
        if (!user) throw new UnauthorizedException('Email invalide');

        // 3. Vérifie que le mot de passe correspond avec le hash enregistré
        const match = await bcrypt.compare(motDePasse, user.motDePasse);

        // 4. Si le mot de passe ne correspond pas, on rejette
        if(!match) throw new UnauthorizedException('Mot de passe Invalide');

        // 5. Si tout est bon, on renvoie un token JWT
        return this._signToken(user.id, user.email, user.role);
    
    }

    // 🔑 Fonction privée pour créer un token JWT
    private _signToken(id: number, email: string, role: string){

        // sub = "subject" (identifiant unique du token)
        const payload = { sub: id, email, role};

        // On retourne le token signé avec les infos
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
