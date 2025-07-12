import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class ProduitDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsInt()
  @IsPositive()
  seuilMinimum: number;

  @IsBoolean()
  @IsOptional()
  supprimer: boolean = false;
}
