import { PartialType } from '@nestjs/mapped-types';
import { CreateForoDto } from './create-foro.dto';

export class UpdateForoDto extends PartialType(CreateForoDto) {}
