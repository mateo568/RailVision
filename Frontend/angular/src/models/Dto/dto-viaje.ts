export interface DtoListaViaje {
    id: number;
    trenId: number;
    ruta: string;
    usuarioId: number;
    fechaSalida: string;
    fechaLlegada: string;
    carga: number;
    estado: string;
    fechaCreacion: string;
}

export interface DtoListaMapaViaje {
    id: number;
    ruta: string;
    fechaSalida: string;
    fechaLlegada: string;
    trenId: number;
    estado: string;
}
