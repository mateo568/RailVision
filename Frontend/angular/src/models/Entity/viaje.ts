import { Cargamento } from "./cargamento";

export interface Viaje {
    id: number;
    trenId: number;
    rutaId: number;
    usuarioId: number;
    fechaSalida: Date | null;
    fechaLlegada: Date | null;
    carga: number;
    estado: string;
    fechaCreacion: Date | null;
    cargamentos: Cargamento[];
}
