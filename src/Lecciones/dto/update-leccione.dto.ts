import { PartialType } from '@nestjs/mapped-types';
import { CreateLeccionesDto } from './create-leccione.dto';

export class UpdateLeccionesDto extends PartialType(CreateLeccionesDto) {}
