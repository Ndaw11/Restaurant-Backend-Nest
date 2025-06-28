import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '../../generated/prisma';
import { CreateUserDto } from 'src/DTO/user/create-user.dto';
import { UpdateUserDto } from 'src/DTO/user/update-user.dto';
import { RoleUser as PrismaRole} from '../../generated/prisma';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {} // $ Injecte PrismaService

  create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data }); // $ Crée un utilisateur avec les données reçues
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany(); // $ Retourne tous les utilisateurs
  }

  findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } }); // $ Recherche par ID
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    const updateData: Prisma.UserUpdateInput = {
        ...data, //on prend tout le reste du DTO
        // 🔁 On convertit manuellement le rôle si présent
        role: data.role? data.role as PrismaRole : undefined,
    };
    return this.prisma.user.update({ where: { id }, data : updateData}); // $ Met à jour un utilisateur
  }

  remove(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } }); // $ Supprime un utilisateur
  }
}
