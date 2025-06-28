import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional,  } from "class-validator";
import { RoleUser } from "generated/prisma";

export class UpdateUserDto {

    @IsOptional()
    nom?: string;

    @IsEmail({},{message: "Email invalide"})
    email?: string;

    @IsOptional()
    @IsEnum(RoleUser,{})
    role?: string;
    
    @IsOptional()
    @MinLength(6,{message: "Plus de 6 caractéres s'il vous plait"})
    motDePasse?: string;
}