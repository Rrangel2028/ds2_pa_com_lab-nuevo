import { SetMetadata } from '@nestjs/common';
import { Role } from '../../Usuarios/schemas/usuarios.schema';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
