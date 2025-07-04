import { Type } from "class-transformer";
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, validate, ValidateNested } from "class-validator";



class ligneCommandeDto{

    @IsNotEmpty()
    @IsInt()
    quantité: number;

    @IsNotEmpty()
    @IsInt()
    prixUnitaire: number;

    
    @IsInt()
    produitId: number;

}

export class CreateCommandeStockDto{

    @IsInt()
    fournisseurId : number;

    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>ligneCommandeDto)
    lignes: ligneCommandeDto[];

}