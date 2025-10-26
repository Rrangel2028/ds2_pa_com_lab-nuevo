import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsOptional() // Hacemos el campo de teléfono opcional para mayor flexibilidad
  readonly phone?: string; // El '?' indica que la propiedad es opcional
}
