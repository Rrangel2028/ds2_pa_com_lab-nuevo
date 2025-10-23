export class CreateLeccionesDto {
  readonly name: string;
  readonly category?: string;
  readonly content?: string;     // <-- aceptar content en la creación
  readonly Unidades?: string[];  // ids de unidades
}