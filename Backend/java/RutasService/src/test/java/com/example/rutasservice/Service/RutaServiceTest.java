package com.example.rutasservice.Service;

import com.example.rutasservice.Dtos.RutasPutDto;
import com.example.rutasservice.Entity.Ruta;
import com.example.rutasservice.Repository.RutaRepository;
import com.example.rutasservice.Service.Impl.RutaServiceImpl;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RutaServiceTest {

    @Mock
    RutaRepository repository;

    @InjectMocks
    RutaService rutaService = new RutaServiceImpl();

    List<Ruta> rutas = new ArrayList<>();

    @BeforeEach
    void loadRutas(){
        rutas.add(Ruta.builder().id(1).nombre("Ruta Córdoba - Rosario").estacionOrigen(10)
                .estacionDestino(12).distanciaKm(new BigDecimal("400.50"))
                .estado("activo").fechaCreacion(LocalDateTime.now()).build());

        rutas.add(Ruta.builder().id(2).nombre("Ruta Buenos Aires - Mendoza").estacionOrigen(1)
                .estacionDestino(8).distanciaKm(new BigDecimal("1050.75")).estado("inactivo")
                .fechaCreacion(LocalDateTime.of(2024, 5, 15, 10, 30))
                .build());
    }

    @Test
    public void consultarRutas() {
        when(repository.findAll()).thenReturn(rutas);

        List<Ruta> listaRutas = rutaService.consultarRutas();

        assertNotNull(listaRutas);
        assertEquals(2, listaRutas.size());
        assertEquals("Ruta Córdoba - Rosario", listaRutas.get(0).getNombre());
        assertEquals(8, listaRutas.get(1).getEstacionDestino());
    }

    @Test
    public void modificarEstadoRuta() {
        when(repository.findById(1)).thenReturn(Optional.of(rutas.get(0)));
        when(repository.save(any(Ruta.class))).thenReturn(rutas.get(0));

        Ruta rutaModificada = rutaService.modificarRuta(1,"mantenimiento");

        assertNotNull(rutaModificada);
        assertEquals(1, rutaModificada.getId());
        assertEquals("mantenimiento", rutaModificada.getEstado());
    }

    @Test
    public void modificarEstadoRutaInexistente() {
        when(repository.findById(1)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> rutaService.modificarRuta(1,"activo")).isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("No se encontro la ruta a modificar");
    }

    @Test
    void modificarRutas() {
        List<RutasPutDto> listaDto = new ArrayList<>();
        listaDto.add(RutasPutDto.builder().rutaId(1).nombre("Ruta Córdoba - Rosario").estado("activo").build());
        listaDto.add(RutasPutDto.builder().rutaId(2).nombre("Ruta Buenos Aires - Mendoza").estado("inactivo").build());

        when(repository.findById(1)).thenReturn(Optional.of(rutas.get(0)));
        when(repository.findById(2)).thenReturn(Optional.of(rutas.get(1)));
        when(repository.save(any(Ruta.class))).thenAnswer(ruta -> ruta.getArgument(0));

        List<Ruta> rutasModificadas = rutaService.modificarRutas(listaDto);

        assertNotNull(rutasModificadas);
        assertEquals(2, rutasModificadas.size());
        assertEquals("Ruta Córdoba - Rosario", rutasModificadas.get(0).getNombre());
        assertEquals("Ruta Buenos Aires - Mendoza", rutasModificadas.get(1).getNombre());
        assertEquals("activo", rutasModificadas.get(0).getEstado());
        assertEquals("inactivo", rutasModificadas.get(1).getEstado());
    }

    @Test
    public void modificarRutaInexistente() {
        List<RutasPutDto> listaDto = new ArrayList<>();
        listaDto.add(RutasPutDto.builder().rutaId(1).nombre("Ruta Córdoba - Rosario").estado("activo").build());
        listaDto.add(RutasPutDto.builder().rutaId(2).nombre("Ruta Buenos Aires - Mendoza").estado("inactivo").build());

        when(repository.findById(1)).thenReturn(Optional.of(rutas.get(0)));
        when(repository.findById(2)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> rutaService.modificarRutas(listaDto)).isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("No se encontro la ruta ('"+ listaDto.get(1).getNombre() + "') para modificarla");

        verify(repository, times(1)).save(any(Ruta.class));
    }

}
