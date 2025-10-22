package com.example.estacionesservice.Dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class EstacionPostDto {
    private String nombre;
    private Integer ciudad;
}
