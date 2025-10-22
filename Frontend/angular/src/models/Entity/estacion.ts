import { Ciudad } from "./ciudad";

export interface Estacion {
  id: number;
  nombre: string;
  estado: boolean;
  fechaCreacion: string; // ISO string
  ciudad: Ciudad;
}
