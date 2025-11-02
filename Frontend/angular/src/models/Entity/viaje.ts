export interface Viaje {
    id: number;
    trenId: number;
    rutaId: number;
    usuarioId: number;
    fechaSalida: string;
    fechaLlegada: string;
    carga: number;
    estado: string;
    fechaCreacion: string;
}
