import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { CreateActividadesDto } from './dto/create-actividad.dto';
import { UpdateActividadesDto } from './dto/update-actividad.dto';

@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  @Post()
  create(@Body() createActividadDto: CreateActividadesDto) {
    return this.actividadesService.create(createActividadDto);
  }

  @Get()
  findAll() {
    return this.actividadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actividadesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateActividadDto: UpdateActividadesDto,
  ) {
    return this.actividadesService.update(id, updateActividadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actividadesService.remove(id);
  }

  @Get(':id/entregas')
  findActividadesEntrega(@Param('id') id: string) {
    return this.actividadesService.findActividadesEntrega(id);
  }

  @Get(':id/archivos')
  findActividadesArchivo(@Param('id') id: string) {
    return this.actividadesService.findActividadesArchivo(id);
  }
}
