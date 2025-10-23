import { PartialType } from '@nestjs/mapped-types';
import { CreateUnidadesDto } from './create-unidade.dto';

export class UpdateUnidadesDto extends PartialType(CreateUnidadesDto) {}
