package com.example.estacionesservice.Service;

import com.example.estacionesservice.Dtos.EstacionPutDto;
import com.example.estacionesservice.Entity.Ciudad;
import com.example.estacionesservice.Entity.Estacion;
import com.example.estacionesservice.Repository.EstacionRepository;
import com.example.estacionesservice.Service.Impl.EstacionServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
public class EstacionServiceTest {

    @Mock
    EstacionRepository repository;

    @InjectMocks
    EstacionService service = new EstacionServiceImpl();

    List<Estacion> estaciones = new ArrayList<>();

    Ciudad ciudad;

    @BeforeEach
    public void crearListado() {
        ciudad = Ciudad.builder().id(1).nombre("Cordoba")
                .provincia("Cordoba").pais("Argentina")
                .latitud("-30.192039").longitud("-62.193847").build();

        estaciones.add(Estacion.builder().id(1).nombre("Prueba 1")
                .estado(true).fechaCreacion(LocalDateTime.now()).ciudad(ciudad).build());
        estaciones.add(Estacion.builder().id(2).nombre("Prueba 2")
                .estado(true).fechaCreacion(LocalDateTime.now()).ciudad(new Ciudad()).build());

    }

    @Test
    public void consultarEstaciones() {
        when(repository.findAll()).thenReturn(estaciones);

        List<Estacion> resultado = service.consultarEstaciones();

        assertThat(resultado).isNotNull();
        assertThat(resultado).hasSize(2);
        assertThat(resultado.get(0).getId()).isEqualTo(1);
        assertThat(resultado.get(1).getNombre()).isEqualTo("Prueba 2");
    }

    @Test
    public void crearEstacion() {
        when(repository.findByCiudad(ciudad)).thenReturn(Optional.empty());
        when(repository.save(any(Estacion.class))).thenReturn(estaciones.get(0));

        Estacion estacion = service.crearEstacion("Prueba 1", ciudad);

        assertEquals("Prueba 1", estacion.getNombre());
        assertEquals(true, estacion.getEstado());
        assertEquals("Cordoba", estacion.getCiudad().getNombre());
    }

    @Test
    public void crearEstacionInvalida() {
        when(repository.findByCiudad(any(Ciudad.class))).thenReturn(Optional.of(estaciones.get(0)));

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> service.crearEstacion("Prueba 1", ciudad));

        assertEquals("Ya existe una estacion en esta ubicacion", exception.getMessage());
    }

    @Test
    public void modificarEstacion() {

        Estacion estacionModificada = Estacion.builder().id(1).nombre("Prueba 3")
                .estado(false).fechaCreacion(LocalDateTime.now()).ciudad(new Ciudad()).build();

        EstacionPutDto estacionDto = new EstacionPutDto("Prueba 3", false);

        when(repository.findById(1)).thenReturn(Optional.of(estaciones.get(0)));
        when(repository.save(any(Estacion.class))).thenReturn(estacionModificada);

        Estacion resultado = service.modificarEstacion(1, estacionDto);

        assertThat(resultado.getId()).isEqualTo(1);
        assertThat(resultado.getNombre()).isNotEqualTo("Prueba 1");
        assertThat(resultado.getEstado()).isFalse();
    }

    @Test
    public void modificarEstacionNoEncontrada() {

        EstacionPutDto estacionDto = new EstacionPutDto("Prueba 3", false);

        when(repository.findById(10)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.modificarEstacion(10, estacionDto)).isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Estacion no encontrada");
    }
}
