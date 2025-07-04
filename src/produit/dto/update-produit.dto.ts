import { ProduitDto } from "./create-produit.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateProduitDto extends PartialType(ProduitDto){}