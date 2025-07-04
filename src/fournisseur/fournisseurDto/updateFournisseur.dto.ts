import { PartialType } from "@nestjs/mapped-types";
import { CreateFournisseurDto } from "./fournisseur.dto";

export class UpdateFournisseurDto extends PartialType(CreateFournisseurDto){}