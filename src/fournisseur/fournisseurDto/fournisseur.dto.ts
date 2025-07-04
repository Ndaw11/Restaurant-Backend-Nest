import { Type } from "class-transformer";
import { IsArray, isArray, IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

class ProduitFournisseurInput{
    @IsInt()
    produitId: number;

    @IsInt()
    prix: number;
}


export class CreateFournisseurDto{

    @IsNotEmpty()
    @IsString()
    nom: string;

    @IsInt()
    @IsNotEmpty()
    contact: number;

    @IsInt()
    @IsNotEmpty()
    delai_livraison: number;
    
    @IsBoolean()
    @IsOptional()
    supprimer: boolean= false;

    // ✅ Vérifie que le champ `produits` est bien un tableau (array)
    @IsArray()
    // ✅ Valide chaque élément du tableau individuellement en 
    // utilisant les règles définies dans ProduitFournisseurInput
    @ValidateNested({ each: true}) 
    // ✅ Transforme automatiquement chaque objet brut (JSON) en 
    // instance de la classe ProduitFournisseurInput
    @Type(()=> ProduitFournisseurInput)
    produits: ProduitFournisseurInput[]

}