import { IsBoolean, IsDateString, IsInt, IsNotEmpty,IsOptional,IsPositive,IsString,  } from "class-validator";

export class ProduitDto{

    @IsNotEmpty()
    @IsString()
    nom: string;

    @IsInt()
    @IsPositive()
    seuilMinimum: number;

    @IsNotEmpty()
    @IsDateString()
    datePeremption: string;

    @IsBoolean()
    @IsOptional()
    supprimer: boolean= false;


}