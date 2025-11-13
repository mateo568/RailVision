package com.example.viajesservice.Dtos.Cargamento;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CargamentoPutDto {
    private Integer id;

    private String detalle;

    private String tipo;

    private BigDecimal peso;

    private String estado;
}
