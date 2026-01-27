import { Rol } from './rol';

export interface Usuario {
    idUsuario : number;
    nombreusuario: string;
    passwordusuario?: string; // Opcional al leer (por seguridad, a veces no se devuelve)
    rol: Rol;
}

export interface UsuarioRegistroDTO {
    nombreusuario: string;
    passwordusuario: string;
    idrol: number;
}
