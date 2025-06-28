// Importe les décorateurs pour gérer les requêtes HTTP et extraire le corps (body)
import { Controller, Body, Post } from '@nestjs/common';
// Importe le service Auth (celui qui fait le vrai travail : créer compte, vérifier connexion)
import { AuthService } from './auth.service';
// DTO = Data Transfer Object, ça définit la forme des données envoyées à l’API
import { RegisterDTO } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('register')
    register(@Body() dto: RegisterDTO){
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto){
        return this.authService.login(dto.email,dto.motDePasse);
    }
}
