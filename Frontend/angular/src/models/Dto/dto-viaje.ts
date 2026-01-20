import { Cargamento } from "../Entity/cargamento";
import { Tren } from "../Entity/tren";

export interface DtoListaViaje {
    id: number;
    tren: Tren | undefined;
    ruta: string;
    usuarioId: number;
    fechaSalida: Date | null;
    fechaLlegada: Date | null;
    carga: number;
    estado: string;
    fechaCreacion: Date | null;
    detalleCarga: Cargamento[];
}

export interface DtoListaMapaViaje {
    id: number;
    ruta: string;
    fechaSalida: Date | null;
    fechaLlegada: Date | null;
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
