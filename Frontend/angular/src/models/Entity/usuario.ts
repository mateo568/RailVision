export interface Usuario {
  usuario_id: number;
  nombre: string;
  apellido: string;
  email: string;
  password_hash: string;
  rol: string;
  estado: boolean;
}
