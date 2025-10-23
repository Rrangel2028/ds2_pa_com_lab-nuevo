import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeccionesService } from './lecciones.service';
import { CreateLeccionesDto } from './dto/create-leccione.dto';
import { UpdateLeccionesDto } from './dto/update-leccione.dto';

@Controller('lecciones')
export class LeccionesController {
  constructor(private readonly leccionesService: LeccionesService) {}

  @Post()
  create(@Body() createLeccioneDto: CreateLeccionesDto) {
    return this.leccionesService.create(createLeccioneDto);
  }

  @Get()
  findAll() {
    return this.leccionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leccionesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeccioneDto: UpdateLeccionesDto) {
    return this.leccionesService.update(id, updateLeccioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leccionesService.remove(id);
  }

  @Get(':id/Unidades')
    findLeccionesUnidades (@Param('id') id: string) {
      return this.leccionesService.findLeccionesUnidades(id);
  }

  @Get(':id/archivos')
    findLeccionesArchivo(@Param('id') id: string) {
      return this.leccionesService.findLeccionesArchivo(id);
  } 
}
