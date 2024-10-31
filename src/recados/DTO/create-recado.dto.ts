import { IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class CreateRecadoDto {
    @IsString() //tem que ter uma string
    @IsNotEmpty() //nao pode ser vazio
    @MinLength(5)
    @MaxLength(255)
    @IsOptional()
    readonly texto: string;
  
  
    @IsPositive()
    paraId: number
  }
  