import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../Usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from '../Usuarios/dto/create-usuario.dto';
import { Role } from '../Usuarios/schemas/usuarios.schema'; // Importar el Enum de Roles

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUsuarioDto: CreateUsuarioDto) {
    const { username, email, password, phone } = createUsuarioDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lógica para asignar el rol basado en el email
    const role = email === 'admin@gmail.com' ? Role.ADMIN : Role.STUDENT;

    const userToCreate = {
      username,
      email,
      password: hashedPassword,
      phone,
      role, // Asignar el rol al objeto del usuario
    };

    const newUser = await this.usuariosService.create(userToCreate as CreateUsuarioDto);
    
    if (newUser && typeof newUser.toObject === 'function') {
      const { password: _, ...userWithoutPassword } = newUser.toObject();
      return userWithoutPassword;
    }
    
    return newUser;
  }

  async login(email: string, passwordLogin: string) {
    const user = await this.usuariosService.findByEmail(email);

    if (user) {
        const isPasswordMatching = await bcrypt.compare(passwordLogin, user.password);
        if (isPasswordMatching) {
            // Añadir el rol al payload del token JWT
            const payload = { email: user.email, sub: user._id, role: user.role };
            return {
                access_token: this.jwtService.sign(payload),
            };
        }
    }
    
    throw new UnauthorizedException('Credenciales incorrectas');
  }
}
