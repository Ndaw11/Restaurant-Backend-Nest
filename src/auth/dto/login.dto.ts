import { IsEmail, IsNotEmpty, isNotEmpty } from "class-validator";

export class LoginDto{

    @IsEmail()
    email: string;

    @IsNotEmpty()
    motDePasse: string;
}
