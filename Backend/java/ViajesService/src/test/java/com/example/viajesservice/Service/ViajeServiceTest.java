package com.example.viajesservice.Service;

import com.example.viajesservice.Dtos.Cargamento.CargamentoPostDto;
import com.example.viajesservice.Dtos.Cargamento.CargamentoPutDto;
import com.example.viajesservice.Dtos.Viaje.ViajePostDto;
import com.example.viajesservice.Dtos.Viaje.ViajePutDto;
import com.example.viajesservice.Entity.Cargamento;
import com.example.viajesservice.Entity.Viaje;
import com.example.viajesservice.Repository.CargamentoRepository;
import com.example.viajesservice.Repository.ViajeRepository;
import com.example.viajesservice.Service.Impl.ViajeServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ViajeServiceTest {

    @Mock
    ViajeRepository repository;

    @Mock
    CargamentoRepository cargamentoRepository;

    @InjectMocks
    ViajeService viajeService = new ViajeServiceImpl();

    List<Viaje> viajes = new ArrayList<>();

    List<Cargamento> cargamentos = new ArrayList<>();

    @BeforeEach
    void crearEntidades() {
        cargamentos.add(Cargamento.builder().id(1).viajeId(1).detalle("Piedra caliza")
                .tipo("mineria").peso(new BigDecimal(5)).estado("activo").build());

        viajes.add(Viaje.builder().id(1).trenId(1).rutaId(2).usuarioId(7).fechaSalida(LocalDateTime.now())
                .fechaLlegada(LocalDateTime.now().plusHours(3)).carga(new BigDecimal("12.50"))
                .estado("programado").fechaCreacion(LocalDateTime.now()).cargamentos(cargamentos).build());

        viajes.add(Viaje.builder().id(2).trenId(2).rutaId(1).usuarioId(3).fechaSalida(LocalDateTime.now())
                .fechaLlegada(LocalDateTime.now().plusHours(4)).carga(new BigDecimal("14.50"))
                .estado("programado").fechaCreacion(LocalDateTime.now()).cargamentos(cargamentos).build());
    }

    @Test
    void consultarViajes() {
        when(repository.findAll()).thenReturn(viajes);

        List<Viaje> listaViajes = viajeService.consultarViajes();

        assertEquals(2, listaViajes.size());
        assertEquals(1, listaViajes.get(0).getId());
        assertEquals(1, listaViajes.get(1).getCargamentos().size());
    }

    @Test
    void consultarViajesExistentes() {
        when(repository.existsByRutaIdInAndEstado(List.of(1), "programado")).thenReturn(false);

        Boolean viajeProgramados = viajeService.consultarViajeProgramado(List.of(1));

        assertEquals(false, viajeProgramados);
    }

    @Test
    void crearViaje() {
        List<CargamentoPostDto> dtoCargamentos = new ArrayList<>();
        dtoCargamentos.add(CargamentoPostDto.builder().detalle("Piedra caliza")
                .tipo("mineria").peso(new BigDecimal("5"))
                .build());

        ViajePostDto dto = ViajePostDto.builder().trenId(1).rutaId(2).usuarioId(7)
                .fechaSalida(LocalDateTime.now()).fechaLlegada(LocalDateTime.now().plusHours(3))
                .carga(new BigDecimal("12.50")).listaCargamento(dtoCargamentos)
                .build();

        when(repository.save(any(Viaje.class))).thenReturn(viajes.get(0));
        when(cargamentoRepository.saveAll(anyList())).thenReturn(cargamentos);

        Viaje viaje = viajeService.crearViaje(dto);

        assertEquals(viajes.get(0).getId(), viaje.getId());
        assertEquals(7, viaje.getUsuarioId());
        assertEquals(1, viaje.getCargamentos().size());
    }

    @Test
    void modificarViaje() {
        List<CargamentoPutDto> dtoCargamentos = new ArrayList<>();
        dtoCargamentos.add(CargamentoPutDto.builder().detalle("Piedra caliza")
                .tipo("mineria").peso(new BigDecimal("5")).estado("activo")
                .build());

        ViajePutDto viajePutDto = ViajePutDto.builder().viajeId(1)
                .fechaSalida(LocalDateTime.now()).fechaLlegada(LocalDateTime.now().plusHours(3))
                .carga(new BigDecimal("12.50")).listaCargamento(dtoCargamentos)
                .build();

        when(repository.findById(1)).thenReturn(Optional.of(viajes.get(0)));
        when(cargamentoRepository.findAllByViajeId(1)).thenReturn(cargamentos);
        when(repository.save(any(Viaje.class))).thenReturn(viajes.get(0));
        when(cargamentoRepository.saveAll(anyList())).thenReturn(cargamentos);

        Viaje viaje = viajeService.modificarViaje(viajePutDto);

        assertEquals(viajes.get(0).getId(), viaje.getId());
        assertEquals(7, viaje.getUsuarioId());
        assertEquals(1, viaje.getCargamentos().size());
        assertEquals("activo", viaje.getCargamentos().get(0).getEstado());
    }

    @Test
    void modificarViajeSinCargamento() {
        ViajePutDto viajePutDto = ViajePutDto.builder().viajeId(1)
                .fechaSalida(LocalDateTime.now()).fechaLlegada(LocalDateTime.now().plusHours(3))
                .carga(new BigDecimal("0"))
                .build();

        when(repository.findById(1)).thenReturn(Optional.of(viajes.get(0)));
        when(repository.save(any(Viaje.class))).thenReturn(viajes.get(0));

        viajes.get(0).setCargamentos(null);

        Viaje viaje = viajeService.modificarViaje(viajePutDto);

        assertEquals(viajes.get(0).getId(), viaje.getId());
        assertEquals(7, viaje.getUsuarioId());
        assertNull(viaje.getCargamentos());
    }

    @Test
    void modificarViajeNoExistente() {
        ViajePutDto viajePutDto = ViajePutDto.builder().viajeId(1)
                .fechaSalida(LocalDateTime.now()).fechaLlegada(LocalDateTime.now().plusHours(3))
                .carga(new BigDecimal("0"))
                .build();

        when(repository.findById(any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> viajeService.modificarViaje(viajePutDto)).isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("No se encontro el viaje a modificar");

        verify(repository, times(0)).save(any(Viaje.class));
    }

    @Test
    void eliminarViaje() {
        viajes.get(0).setEstado("cancelado");
        when(repository.findById(1)).thenReturn(Optional.of(viajes.get(0)));

        viajeService.eliminarViaje(1);

        assertEquals("cancelado" ,viajes.get(0).getEstado());
    }

    @Test
    void eliminarViajeNoExistente() {
        when(repository.findById(any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> viajeService.eliminarViaje(1)).isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("No se encontro el viaje a eliminar");

        verify(repository, times(0)).save(any(Viaje.class));
    }
}
