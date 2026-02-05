package com.example.viajesservice.Service;

import java.time.LocalDateTime;

public interface NotificacionService {
    void crearNotificacion(Integer viajeId, String nombreRuta, LocalDateTime inicio, LocalDateTime fin, String estado);
}
