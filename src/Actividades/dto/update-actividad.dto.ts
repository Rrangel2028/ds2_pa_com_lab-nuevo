import { PartialType } from '@nestjs/mapped-types';
import { CreateActividadesDto } from './create-actividad.dto';

export class UpdateActividadesDto extends PartialType(CreateActividadesDto) {}
