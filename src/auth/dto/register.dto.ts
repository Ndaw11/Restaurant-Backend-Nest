import { IsEmail, IsNotEmpty, MinLength} from "class-validator";

export class RegisterDTO {

    @IsNotEmpty({message: "Le nom est obligatoire"})
    nom: string;

    @IsEmail()
    email: string;

    @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
    @MinLength(6,{ message: 'Le mot de passe doit faire au moins 6 caractéres' })
    motDePasse: string;
}