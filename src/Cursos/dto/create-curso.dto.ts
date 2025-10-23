// src/Cursos/dto/create-curso.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateCursoDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  readonly nombre: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  readonly descripcion: string;

  @IsNumber({}, { message: 'El porcentaje debe ser un número' })
  @IsOptional() // Hacemos que este campo no sea obligatorio al crear
  readonly porcentaje: number;

  @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida' })
  @IsOptional()
  readonly fecha_inicio: Date;

  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida' })
  @IsOptional()
  readonly fecha_fin: Date;
}
