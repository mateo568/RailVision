package com.example.rutasservice.Dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RutasPutDto {
    private Integer rutaId;
    private String nombre;
    private String estado;
}
