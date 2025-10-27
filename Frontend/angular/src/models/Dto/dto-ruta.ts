export interface DtoPutRuta {
    rutaId: number;
    nombre: string;
    estado: string;
}

export interface DtoPostRuta {
    nombre: string;
    estacionOrigen: number;
    estacionDestino: number;
    distanciaKm: null;
}
