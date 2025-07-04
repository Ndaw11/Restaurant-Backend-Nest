import { PartialType } from "@nestjs/mapped-types";
import { CreateCommandeStockDto } from "./createCommandeStock.dto";
import { IsEnum } from "class-validator";
import { Etat } from "generated/prisma";

export class UpdateCommandeStockDto{

    @IsEnum(Etat)
    etat: Etat;
}