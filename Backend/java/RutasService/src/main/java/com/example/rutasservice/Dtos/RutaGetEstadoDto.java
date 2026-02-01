package com.example.rutasservice.Dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RutaGetEstadoDto {
    private Integer rutaId;
    private String nombre;
    private String estado;
}
