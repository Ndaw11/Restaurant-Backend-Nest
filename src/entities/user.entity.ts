import { RoleUser } from "generated/prisma";

export interface User{
    id:number,
    name:string,
    email:string,
    role:RoleUser,
    passwords:string,
}