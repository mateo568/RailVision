package com.example.viajesservice.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "notificaciones_usuarios")
public class NotificacionUsuario {

    @Id
    @Column(name = "notificacion_usuario_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Boolean leida;

    @ManyToOne(optional = false)
    @JoinColumn(name = "notificacion_id", nullable = false)
    private Notificacion notificacion;

    @Column(name = "usuario_id", nullable = false)
    private Integer usuarioId;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
}
