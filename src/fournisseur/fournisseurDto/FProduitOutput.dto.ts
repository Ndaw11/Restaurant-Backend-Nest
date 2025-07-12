import { IsInt, IsString } from 'class-validator';

  
  export class FournisseurOutputDto {
    @IsInt()
    id: number;
  
    @IsString()
    nom: string;
  }