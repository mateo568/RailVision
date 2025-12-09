package com.example.rutasservice.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "rutas")
public class Ruta {

    @Id
    @Column(name = "ruta_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;

    @Column(name = "estacion_origen_id")
    private Integer estacionOrigen;

    @Column(name = "estacion_destino_id")
    private Integer estacionDestino;

    @Column(name = "distancia_km", precision = 7, scale = 2)
    private BigDecimal distanciaKm;

    private String estado;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "baja_logica")
    private Boolean bajaLogica;

    @Column(name = "fecha_destruccion")
    private LocalDateTime fechaDestruccion;
}
