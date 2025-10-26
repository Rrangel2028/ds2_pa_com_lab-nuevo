import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ForoService } from './foro.service';
import { CreateForoDto } from './dto/create-foro.dto';
import { UpdateForoDto } from './dto/update-foro.dto';

@Controller('foro')
export class ForoController {
  constructor(private readonly foroService: ForoService) {}

  @Post()
  create(@Body() createForoDto: CreateForoDto) {
    return this.foroService.create(createForoDto);
  }

  @Get()
  findAll() {
    return this.foroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foroService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateForoDto: UpdateForoDto) {
    return this.foroService.update(id, updateForoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foroService.remove(id);
  }
}
