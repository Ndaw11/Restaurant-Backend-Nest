import { IsInt, IsString } from 'class-validator';

export class ProduitFournisseurOutputDto {
    @IsInt()
    produitId: number;
  
    @IsInt()
    prix: number;
  
    @IsString()
    nom: string; // Nom du produit pour l'affichage
  }