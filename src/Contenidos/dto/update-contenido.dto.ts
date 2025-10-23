import { PartialType } from '@nestjs/mapped-types';
import { CreateContenidosDto } from './create-contenido.dto';

export class UpdateContenidosDto extends PartialType(CreateContenidosDto) {}
