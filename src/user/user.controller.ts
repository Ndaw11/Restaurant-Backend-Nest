// $ Importation des décorateurs et outils NestJS nécessaires pour les routes
import {
  Controller,      // $ Pour définir un contrôleur HTTP
  Get,             // $ Pour gérer une requête GET (lire)
  Post,            // $ Pour gérer une requête POST (créer)
  Body,            // $ Pour lire le corps (body) de la requête
  Param,           // $ Pour lire un paramètre d'URL (ex: /users/:id)
  Put,             // $ Pour gérer une requête PUT (modifier)
  Delete,          // $ Pour gérer une requête DELETE (supprimer)
  ParseIntPipe     // $ Pour transformer automatiquement un paramètre en nombre
} from '@nestjs/common';

// $ On importe le service User pour utiliser la logique métier
import { UserService } from './user.service';
import { CreateUserDto } from 'src/DTO/user/create-user.dto';
import { UpdateUserDto } from 'src/DTO/user/update-user.dto';

// $ On déclare un contrôleur pour la ressource "users"
// $ Toutes les routes de ce contrôleur vont commencer par /users (ex: /users, /users/:id)
@Controller('user')
export class UserController {

    // $ On injecte le service utilisateur pour pouvoir 
    // utiliser ses méthodes dans les routes
    constructor(private readonly userService: UserService){}

    // -------------------
    // $ ROUTE : POST /users
    // $ Objectif : créer un utilisateur
    // $ @Body() lit le corps JSON de la requête et le transmet comme paramètre
    // $ On passe les données reçues directement à Prisma
    @Post()
    create(@Body() createUserDto: CreateUserDto){
        return this.userService.create(createUserDto);
    }


     // -------------------
  // $ ROUTE : GET /users
  // $ Objectif : retourner tous les utilisateurs
  @Get()
  findAll() {
    return this.userService.findAll();
  }


   // -------------------
  // $ ROUTE : GET /users/:id
  // $ Objectif : retourner un seul utilisateur par ID
  // $ @Param('id') lit le paramètre dans l’URL (ex: /users/1)
  // $ ParseIntPipe transforme le paramètre id (string) en number
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

   // -------------------
  // $ ROUTE : PUT /users/:id
  // $ Objectif : modifier un utilisateur existant
  // $ @Body() contient les données modifiées
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // -------------------
  // $ ROUTE : DELETE /users/:id
  // $ Objectif : supprimer un utilisateur par son ID
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
