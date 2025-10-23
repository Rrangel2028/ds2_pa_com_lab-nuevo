// src/Cursos/dto/inscribir-usuario.dto.ts
import { IsNotEmpty, IsMongoId } from 'class-validator';

export class InscribirUsuarioDto {
    @IsNotEmpty({ message: 'El ID del usuario no puede estar vacío.' })
    @IsMongoId({ message: 'El ID del usuario debe ser un MongoID válido.' })
    usuarioId: string;
}
