package com.example.viajesservice.Config;

import com.example.viajesservice.Dtos.RestTemplate.EstadoRutaDto;
import com.example.viajesservice.Entity.Viaje;
import com.example.viajesservice.Repository.ViajeRepository;
import com.example.viajesservice.Service.NotificacionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.net.UnknownHostException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Configuration
@EnableScheduling
@Slf4j
public class EstadoViajesConfig {

    @Autowired
    ViajeRepository repository;

    @Autowired
    NotificacionService notificacionService;

    @Autowired
    RestTemplate restTemplate;

    @Value("${services.rutas.url}")
    private String urlRutas;

    private static List<EstadoRutaDto> cacheListaRutas = new ArrayList<>();

    @Scheduled(fixedRate = 60000)
    private void actualizarEstadosViaje() {

        // Consultar mediante restTemplate todas las rutas activas
        List<EstadoRutaDto> rutas = new ArrayList<>();
        log.info("Ejecutando proceso automatico de actualizar estado trenes {}: ",LocalDateTime.now());
        try {
            log.info("Llamando al micro de rutas para consultar estado de rutas");
            ResponseEntity<List<EstadoRutaDto>> listaRutas = restTemplate.exchange(
                    urlRutas + "/estado", HttpMethod.GET, null,
                    new ParameterizedTypeReference<List<EstadoRutaDto>>() {}
            );

            if (listaRutas.getBody().isEmpty()) {
                log.error("No se recibieron datos del microservicio de rutas. Utilizando cache");
                rutas = cacheListaRutas;

                if(cacheListaRutas.isEmpty()) {
                    log.error("El cache no cuenta datos para ejecutar las modificaciones. Metodo detenido");
                    return;
                }

            } else {
                rutas = listaRutas.getBody();
                cacheListaRutas = rutas;
                log.info("Microservicio de rutas respondió {} elementos", rutas.size());
            }

        }
        catch (HttpStatusCodeException e) {
            log.error("Error HTTP {} al consultar microservicio de rutas: {}", e.getStatusCode(), e.getMessage());
            return;

        }
        catch (ResourceAccessException e) {
            log.error("El micro de rutas no estaria levantado", e);
            rutas = cacheListaRutas;

            if (rutas.isEmpty()) {
                log.error("El cache está vacío. No es posible continuar.");
                return;
            }

            log.warn("Usando datos en cache porque el micro no responde");
        }
        catch (Exception e) {
            log.error("Error inesperado consultando microservicio de rutas", e);
            return;
        }


        // Conseguir todos los viajes del dia de hoy activos o programados
        LocalDate hoy = LocalDate.now();

        LocalDateTime inicioDia = hoy.atStartOfDay();
        LocalDateTime finDia = hoy.atTime(23, 59, 59);

        Set<Viaje> viajesHoy = new HashSet<>(repository.findByFechaSalidaBetween(inicioDia, finDia));
        viajesHoy.addAll(repository.findByFechaLlegadaBetween(inicioDia,finDia));

        log.info("Viajes por fechaSalida: {}", repository.findByFechaSalidaBetween(inicioDia, finDia));
        log.info("Viajes por fechaLlegada: {}", repository.findByFechaLlegadaBetween(inicioDia, finDia));
        log.info("Total viajes de hoy: {}", viajesHoy.size());

        List<Viaje> viajesActualizados = new ArrayList<>();

        // Comparar la hora y el estado de la ruta en relacion al viaje
        // Si la ruta esta no esta activa (X hora antes?) cancelar el viaje
        // Si la ruta esta activa y la hora actual coincide con la del inicio/fin del viaje cambiar su estado a "en curso"/"finalizado"

        ZonedDateTime ahora = ZonedDateTime.now(ZoneId.of("America/Argentina/Buenos_Aires"));
        LocalDateTime inicioMinuto = ahora.withSecond(0).withNano(0).toLocalDateTime();
        LocalDateTime finMinuto = inicioMinuto.plusSeconds(59);

        log.info("Inicio del minuto: {}", inicioMinuto);
        log.info("Fin del minuto: {}", finMinuto);

        for (Viaje viaje : viajesHoy) {
            String estadoRuta = rutas.stream().filter(r -> r.getRutaId().equals(viaje.getRutaId()))
                    .map(EstadoRutaDto::getEstado).findFirst().orElseThrow(
                            () -> new IllegalStateException("El estado de la ruta no esta definido")
                    );

            String nombreRuta = rutas.stream().filter(r -> r.getRutaId().equals(viaje.getRutaId()))
                    .map(EstadoRutaDto::getNombre).findFirst().orElseThrow(
                            () -> new IllegalStateException("El nombre de la ruta no esta definido")
                    );

            boolean esHoraDeSalida = !viaje.getFechaSalida().isBefore(inicioMinuto) &&
                            !viaje.getFechaSalida().isAfter(finMinuto);

            boolean esHoraDeLlegada = !viaje.getFechaLlegada().isBefore(inicioMinuto) &&
                            !viaje.getFechaLlegada().isAfter(finMinuto);

            ZoneId zona = ZoneId.of("America/Argentina/Buenos_Aires");
            ZonedDateTime inicio = viaje.getFechaSalida().minusHours(1).atZone(zona);
            ZonedDateTime salida = viaje.getFechaSalida().atZone(zona);

            boolean limiteHoraCancelacion = !ahora.isBefore(inicio) &&
                    !ahora.isAfter(salida);


            if ( limiteHoraCancelacion && (estadoRuta.equals("mantenimiento") || estadoRuta.equals("inactivo")) &&
                    (viaje.getEstado().equals("programado"))) {
                viaje.setEstado("cancelado");
                notificacionService.crearNotificacion(viaje.getId(),nombreRuta,viaje.getFechaSalida(),viaje.getFechaLlegada(),"cancelado");
                viajesActualizados.add(viaje);
            }

            if (esHoraDeSalida && viaje.getEstado().equals("programado") && estadoRuta.equals("activo")) {
                viaje.setEstado("en curso");
                notificacionService.crearNotificacion(viaje.getId(),nombreRuta,viaje.getFechaSalida(),viaje.getFechaLlegada(),"en curso");
                viajesActualizados.add(viaje);
            }

            if (esHoraDeLlegada && viaje.getEstado().equals("en curso") && estadoRuta.equals("activo")) {
                viaje.setEstado("finalizado");
                notificacionService.crearNotificacion(viaje.getId(),nombreRuta,viaje.getFechaSalida(),viaje.getFechaLlegada(),"finalizado");
                viajesActualizados.add(viaje);
            }
        }

        if (!viajesActualizados.isEmpty()) {
            repository.saveAll(viajesActualizados);
            log.info("Se han modificado {} viajes exitosamente", viajesActualizados.size());
        } else log.info("No hubo cambios en algun viaje");

        log.info("Se ha terminado de ejecutar el metodo exitosamente");
    }
}
