package com.example.viajesservice.Controller;

import com.example.viajesservice.Entity.NotificacionUsuario;
import com.example.viajesservice.Service.NotificacionUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/railvision/notificaciones")
public class NotificacionController {

    @Autowired
    NotificacionUsuarioService service;

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<NotificacionUsuario>> consultarNotificaciones(@PathVariable Integer id) {
        return ResponseEntity.ok(service.consultarNotificacionesUsuario(id));
    }
}
