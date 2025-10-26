## Resumen rápido (objetivo)

Este repositorio es una API/servicio monolítico construido con NestJS + Mongoose que expone endpoints REST usados por el frontend estático en `public/`.
El propósito de este archivo es dar a agentes IA contexto práctico y ejemplos concretos para trabajar rápidamente (features, convenciones, puntos de integración).

## Arquitectura principal
- Backend: NestJS (TypeScript). Punto de entrada: `src/main.ts`, módulo raíz `src/app.module.ts`.
- Persistencia: MongoDB via Mongoose (schemas en cada submódulo, ej. `src/Archivos/schemas`, `src/Entregas/schemas`).
- Autenticación: JWT (`src/auth/*`). El secreto JWT aparece en `src/auth/auth.module.ts` (reemplazar en producción).
- Frontend: archivos estáticos servidos desde `public/` por `ServeStaticModule` y `app.useStaticAssets` (ver `src/app.module.ts` y `src/main.ts`).
- Carpeta pública de uploads: `uploads/` está expuesta en `/uploads` (ver `ServeStaticModule` y `main.ts`).

## Flujos e integración importantes (ejemplos prácticos)
- Endpoint para subir archivos a una unidad (frontend usa esto desde TinyMCE y formularios):
  POST `/archivos/unidades/:unitId` — FormData: `file`, `name`, `description`, (opcional) `createContent=false`
  Ejemplo en `public/modulo.js`: subida desde editor (images_upload_handler) y desde file_picker.
- Crear actividad (actividad/entrega):
  POST `/actividades` — JSON: { name, description, Unidades: [unitId], dueDate, allowFiles, createdBy }
  `public/modulo.js` muestra la carga desde el modal (setupActivityFormLogic -> onSubmit).
- Crear lección:
  POST `/lecciones` — JSON: { name, content, Unidades: [unitId], category }
  `public/modulo.js` usa TinyMCE y POST al endpoint `/lecciones`.
- Entregas (student submissions):
  POST `/entregas` — FormData: actividadId, studentId, comment, submitAt, files[]
  PATCH `/entregas/:id` — para editar; el frontend envía FormData y puede incluir `removeFiles` JSON.

## Convenciones del código y patrones clave
- Nombres de título/etiqueta usan la propiedad `name` (no `title`) en payloads y schemas.
- Colecciones y modelos: usan capitalización tipo `Archivo`, `Entrega`, `Curso` (ver `MongooseModule.forFeature` en cada módulo).
- Endpoints y rutas REST: plurales (`/archivos`, `/lecciones`, `/actividades`, `/entregas`, `/cursos`, `/unidades`).
- Gestión de autenticación en frontend: token JWT en `localStorage.access_token`; frontend construye `authHeaders` y `authHeadersForFiles` en `public/modulo.js`.
- Frontend patterns: el archivo `public/modulo.js` centraliza estado global `state` (curso, currentUnitId, editMode) y expone funciones globales usadas por modales (ej. `loadUnitContent`, `openSubmissionModal`). Los agentes deben revisarlo para entender UX -> API mapping.

## Scripts y flujo de desarrollo
- Instalar dependencias: `npm install`.
- Desarrollo (hot-reload): `npm run start:dev` (usa `nest start --watch`).
- Build: `npm run build` → output en `dist/`.
- Producción: `npm run start:prod` (ejecuta `node dist/main`).
- Tests: `npm run test` (jest), E2E: `npm run test:e2e`.
- Lint/format: `npm run lint`, `npm run format`.

## Variables de entorno y requisitos para arrancar
- `DATABASE_URL` es requerida y validada por Joi en `src/app.module.ts` (la app no arranca sin ella).
- Puerto por defecto: 3000 (puede sobreescribirse con `PORT`).

## Debug y puntos a revisar cuando algo falle
- Verificar `uploads/` y que `ServeStaticModule` esté exponiendo correctamente `process.cwd()` en `app.module.ts` y `main.ts`.
- Si hay problemas con subidas desde TinyMCE revisar que el frontend no fije `Content-Type` al hacer fetch con FormData (el código ya evita establecerlo explícitamente).
- Revisar `public/modulo.js` para entender validaciones/limites de subida: maxFiles, tamaño total (ej. 50MB) y checks en frontend antes de enviar.

## Archivos clave para revisar (rápido)
- `src/app.module.ts` — módulos importados, ServeStatic y ConfigModule/Joi.
- `src/main.ts` — CORS, Static assets y pipes globales.
- `public/modulo.js` — lógica UI → API (modales, TinyMCE, subida de archivos, manejo de entregas).
- `src/Archivos/*`, `src/Entregas/*`, `src/Lecciones/*`, `src/Actividades/*` — controllers, services y schemas para contratos de API.
- `package.json` — scripts útiles y dependencias.

## Pequeños ejemplos extra (copiar/pegar)
- Subida desde editor (FormData):
  formData.append('file', file, file.name);
  formData.append('name', file.name);
  fetch(`/archivos/unidades/${unitId}`, { method: 'POST', headers: { 'Authorization': token }, body: formData });

## Qué evitar / notas de seguridad
- No exponer el secreto JWT en el repositorio; está hardcodeado en `src/auth/auth.module.ts` y debe moverse a variables de entorno.
- Evitar suponer que el frontend siempre enviará JSON: muchas rutas aceptan FormData (archivos/entregas).

Si quieres, puedo ajustar la longitud/énfasis (más ejemplos de endpoints, o añadir snippets de test) — dime qué prefieres y lo itero.
