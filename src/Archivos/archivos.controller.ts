import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArchivosService } from './archivos.service';
import { CreateArchivoDto } from './dto/create-archivo.dto';
import { UpdateArchivoDto } from './dto/update-archivo.dto';

@Controller('archivos') // RUTA SIMPLIFICADA
export class ArchivosController {
  constructor(private readonly archivosService: ArchivosService) {}

  // La ruta de creación ahora es POST /archivos/unidades/:idUnidad
  @Post('unidades/:idUnidad') 
  @UseInterceptors(FileInterceptor('file'))
  create(@Param('idUnidad') idUnidad: string, @UploadedFile() file: Express.Multer.File, @Body() createArchivoDto: CreateArchivoDto) {
    if (!file) {
      throw new BadRequestException('No se ha incluido ningún archivo en la solicitud.');
    }
    return this.archivosService.create(idUnidad, createArchivoDto, file);
  }

  @Get()
  findAll() {
    return this.archivosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.archivosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArchivoDto: UpdateArchivoDto) {
    return this.archivosService.update(id, updateArchivoDto);
  }

  // La ruta de borrado ahora es DELETE /archivos/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.archivosService.remove(id);
  }

  @Get(':id/entregas')
  findEArchivosEntrega(@Param('id') id: string) {
    return this.archivosService.findArchivosEntrega(id);
  }

  @Get(':id/actividades')
  findArchivosActividad(@Param('id') id: string) {
    return this.archivosService.findArchivosActividad(id);
  } 

  @Get(':id/lecciones')
    findArchivosLecciones (@Param('id') id: string) {
      return this.archivosService.findArchivosLecciones(id);
  }
}
