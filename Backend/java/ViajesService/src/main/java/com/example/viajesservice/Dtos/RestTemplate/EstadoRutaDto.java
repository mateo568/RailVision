package com.example.viajesservice.Dtos.RestTemplate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstadoRutaDto {
    private Integer rutaId;
    private String nombre;
    private String estado;
}
