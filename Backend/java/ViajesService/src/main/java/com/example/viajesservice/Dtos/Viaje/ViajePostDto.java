package com.example.viajesservice.Dtos.Viaje;

import com.example.viajesservice.Dtos.Cargamento.CargamentoPostDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ViajePostDto {

    private Integer trenId;

    private Integer rutaId;

    private Integer usuarioId;

    private LocalDateTime fechaSalida;

    private LocalDateTime fechaLlegada;

    private BigDecimal carga;

    private List<CargamentoPostDto> listaCargamento;
}
