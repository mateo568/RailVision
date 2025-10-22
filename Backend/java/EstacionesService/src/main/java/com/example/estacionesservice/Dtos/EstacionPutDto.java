package com.example.estacionesservice.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstacionPutDto {
    private String nombre;
    private Boolean estado;
}
