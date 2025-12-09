package com.example.rutasservice.Dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RutaPostDto {
    String nombre;
    Integer estacionOrigen;
    Integer estacionDestino;
    BigDecimal distanciaKm;
}
