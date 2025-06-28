import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional } from "class-validator";
import { RoleUser } from "../../user/role.enum";


export class CreateUserDto{

    @IsNotEmpty({ message: "Le nom doit etre obligatoire" })
    nom: string;

    @IsEmail({},{ message: 'Email invalide' })
    email: string;

    @IsOptional() // $ optionnel car par défaut = CLIENT
    @IsEnum(RoleUser, { message: "Tu ne peut qu'etre un client" })
    role?: RoleUser;
    
    @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
    @MinLength(6,{ message: 'Le mot de passe doit faire au moins 6 caractéres' })
    motDePasse: string;
}