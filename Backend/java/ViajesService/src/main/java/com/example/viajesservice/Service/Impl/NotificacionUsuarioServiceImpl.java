package com.example.viajesservice.Service.Impl;

import com.example.viajesservice.Dtos.Usuario.UsuarioGetDto;
import com.example.viajesservice.Dtos.Usuario.UsuarioResponse;
import com.example.viajesservice.Entity.Notificacion;
import com.example.viajesservice.Entity.NotificacionUsuario;
import com.example.viajesservice.Repository.NotificacionUsuarioRepository;
import com.example.viajesservice.Service.NotificacionUsuarioService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class NotificacionUsuarioServiceImpl implements NotificacionUsuarioService {

    @Autowired
    NotificacionUsuarioRepository repository;

    @Autowired
    RestTemplate restTemplate;

    @Value("${services.usuarios.url}")
    private String urlUsuarios;

    @Override
    public List<NotificacionUsuario> consultarNotificacionesUsuario(Integer usuarioId) {
        return repository.findAllByUsuarioIdAndLeidaOrderByFechaCreacionDesc(usuarioId ,false);
    }

    @Override
    public void crearNotificacionesUsuarios(Notificacion notificacion) {
        List<UsuarioGetDto> usuarios = obtenerUsuarios();
        List<NotificacionUsuario> notificaciones = new ArrayList<>();
        ZoneId zona = ZoneId.of("America/Argentina/Buenos_Aires");

        usuarios = usuarios.stream().filter(u -> !"cliente".equals(u.getRol()) && u.getEstado()).collect(Collectors.toList());
        if(usuarios.isEmpty()) { return; }

        for (UsuarioGetDto u: usuarios) {
            notificaciones.add(NotificacionUsuario.builder().leida(false).notificacion(notificacion)
                    .usuarioId(u.getUsuario_id()).fechaCreacion(LocalDateTime.now(zona)).build());
        }

        repository.saveAll(notificaciones);
    }

    @Override
    public void cambiarNotificacionLeida(Integer notificacionId) {
        NotificacionUsuario notificacionUsuario = repository.findById(notificacionId)
                .orElseThrow(() -> new EntityNotFoundException("No se encontro la notificacion para marcarla como leida"));

        notificacionUsuario.setLeida(true);
        repository.save(notificacionUsuario);
    }

    private List<UsuarioGetDto> obtenerUsuarios() {

        List<UsuarioGetDto> usuarios = new ArrayList<>();

        try {
            ResponseEntity<UsuarioResponse> listaUsuarios = restTemplate.exchange(urlUsuarios + "/",
                    HttpMethod.GET, null, UsuarioResponse.class
            );

            UsuarioResponse respuesta = listaUsuarios.getBody();

            if (respuesta.getUsuarios().isEmpty()) {
                log.info("No se cargaron usuarios con notificaciones:");
                return Collections.emptyList();
            }

            usuarios = respuesta.getUsuarios();
            log.info("Usuarios actuales: " + usuarios.size());
            return usuarios;
        }
        catch (Exception e) {
            log.info("No se conecto correctamente con el micro de usuarios: " + e.getMessage(), e);
            return Collections.emptyList();
        }
    }
}
