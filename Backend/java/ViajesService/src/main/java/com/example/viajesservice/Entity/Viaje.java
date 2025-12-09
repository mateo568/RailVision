package com.example.viajesservice.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity(name = "viajes")
public class Viaje {

    @Id
    @EqualsAndHashCode.Include
    @Column(name = "viaje_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "tren_id")
    private Integer trenId;

    @Column(name = "ruta_id")
    private Integer rutaId;

    @Column(name = "usuario_id")
    private Integer usuarioId;

    @Column(name = "fecha_salida")
    private LocalDateTime fechaSalida;

    @Column(name = "fecha_llegada")
    private LocalDateTime fechaLlegada;

    @Column(name = "carga_toneladas")
    private BigDecimal carga;

    private String estado;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "viaje_id")
    private List<Cargamento> cargamentos = new ArrayList<>();
}
