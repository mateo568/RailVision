package com.example.viajesservice.Service.Impl;

import com.example.viajesservice.Dtos.Usuario.UsuarioGetDto;
import com.example.viajesservice.Entity.Notificacion;
import com.example.viajesservice.Entity.NotificacionUsuario;
import com.example.viajesservice.Repository.NotificacionUsuarioRepository;
import com.example.viajesservice.Service.NotificacionUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
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

        usuarios = usuarios.stream().filter(u -> !"cliente".equals(u.getRol())).collect(Collectors.toList());
        if(usuarios.isEmpty()) { return; }

        for (UsuarioGetDto u: usuarios) {
            notificaciones.add(NotificacionUsuario.builder().leida(false).notificacion(notificacion)
                    .usuarioId(u.getUsuario_id()).fechaCreacion(LocalDateTime.now()).build());
        }

        repository.saveAll(notificaciones);
    }

    private List<UsuarioGetDto> obtenerUsuarios() {

        List<UsuarioGetDto> usuarios = new ArrayList<>();

        try {
            ResponseEntity<List<UsuarioGetDto>> listaUsuarios = restTemplate.exchange(
                    urlUsuarios + "", HttpMethod.GET, null,
                    new ParameterizedTypeReference<List<UsuarioGetDto>>() {}
            );

            usuarios = listaUsuarios.getBody();
            return usuarios;
        }
        catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
