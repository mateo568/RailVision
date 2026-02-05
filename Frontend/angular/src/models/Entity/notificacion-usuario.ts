import { Notificacion } from "./notificacion";

export interface NotificacionUsuario {
    id: number;
    leida: boolean;
    notificacion: Notificacion;
    usuarioId: number;
    fechaCreacion: string | null;
}
