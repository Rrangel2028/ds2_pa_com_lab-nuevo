// src/Cursos/cursos.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { InscribirUsuarioDto } from './dto/inscribir-usuario.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../Usuarios/schemas/usuarios.schema';
import { CreateUnidadesDto } from '../Unidades/dto/create-unidade.dto';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursosService.create(createCursoDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.cursosService.findAll();
  }

  @Post(':id/unidades')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createUnidad(
    @Param('id') cursoId: string,
    @Body() createUnidadeDto: CreateUnidadesDto,
  ) {
    return this.cursosService.createUnidadForCurso(cursoId, createUnidadeDto);
  }

  // **** ¡NUEVO! Endpoint para eliminar una unidad de un curso ****
  @Delete(':cursoId/unidades/:unidadId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  deleteUnidad(
    @Param('cursoId') cursoId: string,
    @Param('unidadId') unidadId: string,
  ) {
    return this.cursosService.deleteUnidadFromCurso(cursoId, unidadId);
  }

  @Post(':cursoId/inscribir')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  inscribirUsuario(
    @Param('cursoId') cursoId: string,
    @Body() inscribirUsuarioDto: InscribirUsuarioDto,
  ) {
    return this.cursosService.inscribirUsuario(
      cursoId,
      inscribirUsuarioDto.usuarioId,
    );
  }

  @Post(':cursoId/eliminar-estudiante')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  eliminarEstudiante(
    @Param('cursoId') cursoId: string,
    @Body() inscribirUsuarioDto: InscribirUsuarioDto,
  ) {
    return this.cursosService.eliminarEstudiante(
      cursoId,
      inscribirUsuarioDto.usuarioId,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.cursosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto) {
    return this.cursosService.update(id, updateCursoDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.cursosService.remove(id);
  }
}
