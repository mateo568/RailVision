import { Cargamento } from "../Entity/cargamento";
import { Tren } from "../Entity/tren";

export interface DtoListaViaje {
    id: number;
    tren: Tren | undefined;
    ruta: string;
    usuarioId: number;
    fechaSalida: string;
    fechaLlegada: string;
    carga: number;
    estado: string;
    fechaCreacion: string;
    detalleCarga: Cargamento[];
}

export interface DtoListaMapaViaje {
    id: number;
    ruta: string;
    fechaSalida: string;
    fechaLlegada: string;
    tren: string;
    estado: string;
}

export interface DtoPostViaje {
    trenId: number;
    rutaId: number;
    usuarioId: number;
    fechaSalida: string;
    fechaLlegada: string;
    carga: number;
    listaCargamento: DtoPostCargamento[];
}

export interface DtoPostCargamento{
    detalle: string;
    tipo: string;
    peso: number;
}

export interface DtoPutViaje {
    viajeId: number;
    fechaSalida: string;
    fechaLlegada: string;
    carga: number;
    listaCargamento: DtoPutCargamento[];
}

export interface DtoPutCargamento {
    id: number;
    detalle: string;
    tipo: string;
    peso: number;
    estado: string;
}
