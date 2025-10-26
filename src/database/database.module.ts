import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Curso, CursoSchema } from '../Cursos/schemas/cursos.schema';
import { Usuario, UsuarioSchema } from '../Usuarios/schemas/usuarios.schema';
import { Unidades, UnidadeSchema } from '../Unidades/schemas/unidades.schema';
import {
  Contenidos,
  ContenidoSchema,
} from '../Contenidos/schemas/contenidos.schema';
import { Archivo, ArchivoSchema } from '../Archivos/schemas/archivos.schema';

const MODELS = [
  { name: Usuario.name, schema: UsuarioSchema },
  { name: Curso.name, schema: CursoSchema },
  { name: Unidades.name, schema: UnidadeSchema },
  { name: Contenidos.name, schema: ContenidoSchema },
  { name: Archivo.name, schema: ArchivoSchema },
];

@Global()
@Module({
  imports: [
    // Ya no es necesario ConfigModule.forRoot() aquí, es global desde app.module
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Importamos ConfigModule para poder inyectar ConfigService
      useFactory: async (configService: ConfigService) => ({
        // Corregimos el nombre de la variable de entorno
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(MODELS),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
