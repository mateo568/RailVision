package com.example.viajesservice.Service;

import java.time.ZonedDateTime;

public interface NotificacionService {
    void crearNotificacion(Integer viajeId, String nombreRuta, ZonedDateTime inicio, ZonedDateTime fin, String estado);
}
