import { Etat } from 'generated/prisma';
import { IsEnum, IsArray, ValidateNested, IsInt, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class LotInputDto {
  @IsInt()
  produitId: number;

  @IsDateString()
  datePeremption: string;
}

export class UpdateCommandeStockWithLotsDto {
  @IsEnum(Etat)
  etat: Etat;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LotInputDto)
  lots: LotInputDto[];
}
