package com.example.viajesservice.Dtos.Viaje;

import com.example.viajesservice.Dtos.Cargamento.CargamentoPutDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ViajePutDto {
    private Integer viajeId;

    private LocalDateTime fechaSalida;

    private LocalDateTime fechaLlegada;

    private BigDecimal carga;

    private List<CargamentoPutDto> listaCargamento = new ArrayList<>();
}
