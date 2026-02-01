package com.example.viajesservice.Service;

import com.example.viajesservice.Entity.Notificacion;
import com.example.viajesservice.Entity.NotificacionUsuario;

import java.util.List;

public interface NotificacionUsuarioService {
    List<NotificacionUsuario> consultarNotificacionesUsuario(Integer usuarioId);
    void crearNotificacionesUsuarios(Notificacion notificacion);
}
