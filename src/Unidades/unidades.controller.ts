import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UnidadesService } from './unidades.service';
import { CreateUnidadesDto } from './dto/create-unidade.dto';
import { UpdateUnidadesDto } from './dto/update-unidade.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../Usuarios/schemas/usuarios.schema';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('unidades')
export class UnidadesController {
  constructor(private readonly unidadesService: UnidadesService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUnidadeDto: CreateUnidadesDto) {
    return this.unidadesService.create(createUnidadeDto);
  }

  @Get()
  findAll() {
    return this.unidadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unidadesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateUnidadeDto: UpdateUnidadesDto) {
    return this.unidadesService.update(id, updateUnidadeDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.unidadesService.remove(id);
  }

  @Get(':id/Contenidos')
  findUnidadesContenido(@Param('id') id: string) {
    return this.unidadesService.findUnidadesContenido(id);
  }

  @Get(':id/Lecciones')
  findUnidadesLecciones(@Param('id') id: string) {
    return this.unidadesService.findUnidadesLecciones(id);
  }
}
