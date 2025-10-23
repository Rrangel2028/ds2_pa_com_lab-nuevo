import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  Req,
  HttpCode,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

import { EntregasService } from './entregas.service';
import { CreateEntregaDto } from './dto/create-entregas.dto';
import { UpdateEntregaDto } from './dto/update-entregas.dto';

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'entregas');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

@Controller('entregas')
export class EntregasController {
  private readonly logger = new Logger(EntregasController.name);

  constructor(private readonly entregasService: EntregasService) {}

  // POST: acepta multipart (field "files") y JSON; guarda archivos en disk y hace logging
  @Post()
  @HttpCode(201)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => cb(null, UPLOAD_DIR),
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB por archivo (ajusta si hace falta)
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createEntregasDto: CreateEntregaDto,
    @Req() req: any,
  ): Promise<any> {
    this.logger.debug('--- POST /entregas received ---');
    this.logger.debug(
      'Authorization header present: ' + !!req.headers.authorization,
    );
    this.logger.debug('Request URL: ' + (req.originalUrl || req.url));
    this.logger.debug(
      'body keys: ' + JSON.stringify(Object.keys(createEntregasDto || {})),
    );
    this.logger.debug(
      'body sample: ' + JSON.stringify(createEntregasDto || {}),
    );
    this.logger.debug('files count: ' + ((files && files.length) || 0));
    if (files && files.length) {
      this.logger.debug(
        'files sample: ' +
          JSON.stringify(
            (files || []).map((f) => ({
              fieldname: f.fieldname,
              originalname: f.originalname,
              filename:
                (f as any).filename || (f as any).filename || f.originalname,
              size: f.size,
              mimetype: f.mimetype,
              path:
                (f as any).path || (f as any).destination
                  ? join(
                      (f as any).destination || '',
                      (f as any).filename || f.originalname,
                    )
                  : null,
            })),
          ),
      );
    }

    try {
      // Normalizar nombres esperados del cliente
      const actividadId =
        (createEntregasDto as any).actividadId ||
        (createEntregasDto as any).activityId;
      const studentId =
        (createEntregasDto as any).studentId ||
        (createEntregasDto as any).usuarioId ||
        (createEntregasDto as any).student;

      if (!actividadId || !studentId) {
        throw new HttpException(
          {
            message: 'actividadId y studentId son requeridos',
            received: {
              body: createEntregasDto,
              filesCount: (files || []).length,
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const svcAny = this.entregasService as any;

      // Preferir método que maneja archivos si existe
      if (
        files &&
        files.length &&
        typeof svcAny.createWithFiles === 'function'
      ) {
        return await svcAny.createWithFiles(createEntregasDto, files);
      }

      // Si el servicio create acepta files como segundo parámetro, intentar
      if (files && files.length && typeof svcAny.create === 'function') {
        try {
          return await svcAny.create(createEntregasDto, files);
        } catch (err) {
          this.logger.warn(
            'entregasService.create con files falló, intentando create(dto). Error: ' +
              err?.message,
          );
        }
      }

      // Sin archivos o fallback
      return await this.entregasService.create(createEntregasDto);
    } catch (err) {
      this.logger.error('Error en POST /entregas: ' + (err?.message || err));
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        { message: err?.message || 'Error interno' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(@Query() query: any) {
    // normalizar posibles nombres de parámetro y añadir logs para diagnóstico
    const actividadId =
      query?.actividadId || query?.activityId || query?.actividad || null;
    this.logger.debug(
      `GET /entregas query=${JSON.stringify(query)} -> actividadId=${actividadId}`,
    );

    let result;
    if (actividadId) {
      result = await this.entregasService.findByActividad(actividadId);
    } else {
      result = await this.entregasService.findAll();
    }

    this.logger.debug(
      `GET /entregas -> returned ${Array.isArray(result) ? result.length : result ? 1 : 0} items`,
    );
    return result;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entregasService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => cb(null, UPLOAD_DIR),
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateEntregasDto: any,
    @Req() req: any,
  ) {
    // Si vienen archivos, delegar a updateWithFiles, si no, usar update normal
    try {
      if (files && files.length) {
        return await (this.entregasService as any).updateWithFiles(id, updateEntregasDto, files);
      }
      return await this.entregasService.update(id, updateEntregasDto);
    } catch (err) {
      this.logger.error('Error en PATCH /entregas/:id -> ' + (err?.message || err));
      throw err instanceof HttpException ? err : new HttpException({ message: err?.message || 'Error interno' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entregasService.remove(id);
  }

  @Get(':id/usuarios')
  findEntregaUsuarios(@Param('id') id: string) {
    return this.entregasService.findEntregaUsuarios(id);
  }

  @Get(':id/actividades')
  findEntregaActividad(@Param('id') id: string) {
    return this.entregasService.findEntregaActividad(id);
  }

  @Get(':id/archivos')
  findEntregaArchivo(@Param('id') id: string) {
    return this.entregasService.findEntregaArchivo(id);
  }
}
