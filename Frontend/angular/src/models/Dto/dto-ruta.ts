export interface DtoPutRuta {
    rutaId: number;
    nombre: string;
    estado: string;
}

export interface DtoPostRuta {
    nombre: string;
    estacionOrigen: number;
    estacionDestino: number;
    distanciaKm: number;
}

export interface DtoListadoRutas {
    id: number;
    nombre: string;
    ciudadOrigen: string;
    ciudadDestino: string;
    estadoEstacionOrigen: boolean;
    estadoEstacionDestino: boolean;
    estado: string;
}