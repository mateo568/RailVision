package com.example.viajesservice.Service.Impl;

import com.example.viajesservice.Dtos.RestTemplate.EstadoRutaDto;
import com.example.viajesservice.Entity.Notificacion;
import com.example.viajesservice.Repository.NotificacionRepository;
import com.example.viajesservice.Service.NotificacionService;
import com.example.viajesservice.Service.NotificacionUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class NotificacionServiceImpl implements NotificacionService {

    @Autowired
    NotificacionRepository repository;

    @Autowired
    NotificacionUsuarioService notificacionUsuarioService;

    @Override
    public void crearNotificacion(Integer viajeId, String nombreRuta, LocalDateTime inicio, LocalDateTime fin, String estado) {

        String ruta = nombreRuta.substring(5);
        ZoneId zona = ZoneId.of("America/Argentina/Buenos_Aires");
        ZonedDateTime horaZonaInicio = inicio.atZone(zona);
        ZonedDateTime horaZonaFin = fin.atZone(zona);

        String horaInicio = horaZonaInicio.format(DateTimeFormatter.ofPattern("HH:mm"));
        String horaFin = horaZonaFin.format(DateTimeFormatter.ofPattern("HH:mm"));

        String mensaje = switch (estado) {
            case "cancelado" -> "El viaje de " + ruta + " (" + horaInicio + " - " + horaFin + ") ha sido cancelado";
            case "en curso" -> "El viaje de " + ruta + " (" + horaInicio + " - " + horaFin + ") ha comenzado";
            case "finalizado" -> "El viaje de " + ruta + " (" + horaInicio + " - " + horaFin + ") ha finalizado";
            default -> "";
        };

        Notificacion notificacion = Notificacion.builder().mensaje(mensaje).fechaCreacion(LocalDateTime.now(zona)).referenciaViaje(viajeId).build();

        repository.save(notificacion);
        notificacionUsuarioService.crearNotificacionesUsuarios(notificacion);
    }
}
