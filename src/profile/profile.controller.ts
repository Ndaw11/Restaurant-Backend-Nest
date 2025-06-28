import { Controller, Get, UseGuards, Request} from '@nestjs/common';

// 🔐 Importation du AuthGuard JWT pour sécuriser la route
import { AuthGuard } from '@nestjs/passport';

// 🎯 Ce contrôleur gère la route /profile
@Controller('profile')
export class ProfileController {

    // 🔐 Cette route est protégée par un AuthGuard JWT
    // Elle nécessite un token valide pour être accessible
    @UseGuards(AuthGuard('jwt'))
    @Get()
    // Injecte l’objet req de la requête HTTP
    getProfile(@Request() req){
         // ✅ Retourne l’utilisateur connecté (injecté automatiquement depuis JwtStrategy → req.user)
         // Contient les infos extraites du token JWT (id, email, role...)
        return req.user;
    }

}
