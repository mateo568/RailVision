package com.example.estacionesservice.Service;

import com.example.estacionesservice.Entity.Ciudad;
import com.example.estacionesservice.Repository.CiudadRepository;
import com.example.estacionesservice.Service.Impl.CiudadServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CiudadServiceTest {

    @Mock
    CiudadRepository repository;

    @InjectMocks
    CiudadService service = new CiudadServiceImpl();

    List<Ciudad> ciudades = new ArrayList<>();

    @BeforeEach
    public void crearListado() {
        ciudades.add(Ciudad.builder().id(1).nombre("Cordoba")
                .provincia("Cordoba").pais("Argentina")
                .latitud("-30.192039").longitud("-62.193847").build());

        ciudades.add(Ciudad.builder().id(2).nombre("Rio cuarto")
                .provincia("Cordoba").pais("Argentina")
                .latitud("-30.192129").longitud("-62.193127").build());
    }

    @Test
    public void consultarCiudadXId() {
        when(repository.findById(0)).thenReturn(Optional.of(ciudades.get(0)));

        Optional<Ciudad> ciudad = repository.findById(0);

        assertTrue(ciudad.isPresent());
        assertEquals("Cordoba" ,ciudad.get().getNombre());
        assertEquals("Argentina", ciudad.get().getPais());
        assertNotEquals("-62.193127", ciudad.get().getLongitud());
    }

    @Test
    public void consultarCiudadInexistente() {
        when(repository.findById(2)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> service.consultarCiudad(2));

        assertEquals("Ciudad no encontrada", exception.getMessage());
    }

    @Test
    public void consultarCiudades() {
        when(repository.findAll()).thenReturn(ciudades);

        List<Ciudad> resultado = service.consultarCiudades();

        assertThat(resultado).isNotNull();
        assertThat(resultado).hasSize(2);
        assertThat(resultado.get(0).getNombre()).isEqualTo("Cordoba");
    }
}
