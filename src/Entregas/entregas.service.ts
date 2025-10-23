import { Injectable, Logger } from '@nestjs/common';
import { CreateEntregaDto } from './dto/create-entregas.dto';
import { UpdateEntregaDto } from './dto/update-entregas.dto';
import { Entrega } from './schemas/entregas.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class EntregasService {
  private readonly logger = new Logger(EntregasService.name);

  constructor(
    @InjectModel(Entrega.name) private entregaModel: Model<Entrega>,
  ) {}

  // Crear entrega y guardar metadatos de archivos (espera que multer haya escrito en disco)
  async createWithFiles(
    createEntregaDto: CreateEntregaDto,
    files: Express.Multer.File[],
  ): Promise<Entrega> {
    // asegurar directorio uploads
    const uploadDir = path.resolve(process.cwd(), 'uploads', 'entregas');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const archivos = (files || []).map((f) => {
      const filename = (f as any).filename || f.filename || f.originalname;
      // url pública para servir desde /uploads (main.ts debe servir /uploads)
      const url = `/uploads/entregas/${filename}`;
      return {
        fieldname: f.fieldname,
        originalname: f.originalname,
        filename,
        mimetype: f.mimetype,
        size: f.size,
        path:
          f.path ||
          ((f as any).destination
            ? path.join((f as any).destination, filename)
            : null),
        url,
        uploadedAt: new Date(),
      };
    });

    // normalizar ids (soporta varias claves)
    const actividadId =
      (createEntregaDto as any).actividadId ||
      (createEntregaDto as any).actividad ||
      (createEntregaDto as any).actividades?.[0] ||
      null;
    const studentId =
      (createEntregaDto as any).studentId ||
      (createEntregaDto as any).usuarioId ||
      (createEntregaDto as any).student ||
      null;

    const doc: any = {
      ...createEntregaDto,
      archivos,
      submitAt: (createEntregaDto as any).submitAt || new Date(),
    };

    if (actividadId) {
      try {
        doc.actividades = [new mongoose.Types.ObjectId(String(actividadId))];
      } catch (e) {
        doc.actividades = [String(actividadId)];
      }
    }

    if (studentId) {
      try {
        doc.usuarios = [new mongoose.Types.ObjectId(String(studentId))];
      } catch (e) {
        doc.usuarios = [String(studentId)];
      }
    }

    const created = new this.entregaModel(doc);
    return created.save();
  }

  // create acepta opcionalmente files; delega a createWithFiles si hay archivos
  async create(
    createEntregaDto: CreateEntregaDto,
    files?: Express.Multer.File[],
  ): Promise<Entrega> {
    if (files && files.length) {
      return this.createWithFiles(createEntregaDto, files);
    }
    const createdEntrega = new this.entregaModel(createEntregaDto);
    return createdEntrega.save();
  }

  async findAll(): Promise<Entrega[]> {
    return this.entregaModel
      .find()
      .populate('usuarios')
      .populate('actividades')
      .exec();
  }

  async findOne(id: string): Promise<Entrega | null> {
    return this.entregaModel
      .findById(id)
      .populate('usuarios')
      .populate('actividades')
      .exec();
  }

  async findByActividad(actividadId: string): Promise<Entrega[]> {
    this.logger.debug(`findByActividad called with actividadId=${actividadId}`);
    let qId: any = actividadId;
    try {
      qId = new mongoose.Types.ObjectId(String(actividadId));
    } catch (e) {
      qId = String(actividadId);
    }

    const docs = await this.entregaModel
      .find({ actividades: qId })
      .populate('usuarios')
      .populate('actividades')
      .exec();

    this.logger.debug(
      `findByActividad -> found ${docs.length} documentos (searchId=${qId})`,
    );
    return docs;
  }

  async findEntregaUsuarios(Id: string): Promise<Entrega | null> {
    return this.entregaModel.findById(Id).populate('usuarios').exec();
  }

  async findEntregaActividad(Id: string): Promise<Entrega | null> {
    return this.entregaModel.findById(Id).populate('actividades').exec();
  }

  async findEntregaArchivo(Id: string): Promise<Entrega | null> {
    return this.entregaModel.findById(Id).populate('archivos').exec();
  }

  async update(
    id: string,
    updateEntregaDto: UpdateEntregaDto,
  ): Promise<Entrega | null> {
    return this.entregaModel
      .findByIdAndUpdate(id, updateEntregaDto, { new: true })
      .exec();
  }

  // Actualizar entrega añadiendo archivos nuevos y permitiendo eliminar archivos previos
  async updateWithFiles(id: string, updateDto: any, files: Express.Multer.File[] = []): Promise<Entrega | null> {
    const doc = await this.entregaModel.findById(id).exec();
    if (!doc) throw new Error('Entrega no encontrada');

    // Normalizar lista de archivos a eliminar (puede venir como JSON string)
    let removeFiles: any[] = [];
    if (updateDto && updateDto.removeFiles) {
      try {
        if (typeof updateDto.removeFiles === 'string') removeFiles = JSON.parse(updateDto.removeFiles);
        else removeFiles = Array.isArray(updateDto.removeFiles) ? updateDto.removeFiles : [updateDto.removeFiles];
      } catch (e) {
        removeFiles = Array.isArray(updateDto.removeFiles) ? updateDto.removeFiles : [];
      }
    }

    // Procesar nuevos archivos y convertir a la estructura usada en el esquema
    const nuevos = (files || []).map((f: any) => {
      const filename = f.filename || f.originalname;
      const url = `/uploads/entregas/${filename}`;
      return {
        fieldname: f.fieldname,
        originalname: f.originalname,
        filename,
        mimetype: f.mimetype,
        size: f.size,
        path: f.path || (f.destination ? path.join(f.destination, filename) : null),
        url,
        uploadedAt: new Date(),
      } as any;
    });

    // Añadir nuevos archivos
    doc.archivos = doc.archivos || [];
    if (nuevos.length) doc.archivos.push(...nuevos as any);

    // Remover archivos marcados
    if (removeFiles && removeFiles.length) {
      for (const rem of removeFiles) {
        try {
          const matchIndex = doc.archivos.findIndex((a: any) => {
            if (!a) return false;
            if (rem._id && a._id && String(a._id) === String(rem._id)) return true;
            if (rem.filename && a.filename && a.filename === rem.filename) return true;
            if (rem.name && (a.originalname === rem.name || a.originalname === rem.filename)) return true;
            return false;
          });
          if (matchIndex !== -1) {
            const removed = doc.archivos.splice(matchIndex, 1)[0];
            // intentar borrar archivo del disco si hay path/filename
            try {
              const filePath = removed.path || (removed.filename ? path.join(process.cwd(), 'uploads', 'entregas', removed.filename) : null);
              if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
            } catch (e) {
              this.logger.warn('No se pudo borrar archivo físico al eliminar de entrega: ' + (e?.message || e));
            }
          }
        } catch (e) {
          this.logger.warn('Error procesando removeFiles entry: ' + (e?.message || e));
        }
      }
    }

    // Actualizar campos sencillos (comment, submitAt, etc.) sin sobrescribir archivos
    const allowed = ['comment', 'comentario', 'submitAt', 'usuarios', 'actividades'];
    for (const k of Object.keys(updateDto || {})) {
      if (k === 'removeFiles') continue;
      if (k === 'files') continue;
      if (allowed.includes(k) || !(doc as any)[k]) {
        // map comment/comentario -> comment
        if (k === 'comentario') (doc as any).comment = updateDto[k];
        else (doc as any)[k] = updateDto[k];
      }
    }

    // si no se proporcionó submitAt, mantener el existente
    if (!updateDto || !updateDto.submitAt) {
      (doc as any).submitAt = (doc as any).submitAt || new Date();
    }

    await doc.save();
    return this.entregaModel.findById(doc._id).populate('usuarios').populate('actividades').exec();
  }

  async remove(id: string): Promise<Entrega | null> {
    return this.entregaModel.findByIdAndDelete(id).exec();
  }
}
