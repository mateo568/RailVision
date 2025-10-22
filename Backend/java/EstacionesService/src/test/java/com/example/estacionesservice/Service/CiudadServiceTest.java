package com.example.estacionesservice.Service;

import com.example.estacionesservice.Entity.Ciudad;
import com.example.estacionesservice.Repository.CiudadRepository;
import com.example.estacionesservice.Service.Impl.CiudadServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
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
    public void consultarCiudades() {
        when(repository.findAll()).thenReturn(ciudades);

        List<Ciudad> resultado = service.consultarCiudades();

        assertThat(resultado).isNotNull();
        assertThat(resultado).hasSize(2);
        assertThat(resultado.get(0).getNombre()).isEqualTo("Cordoba");
    }
}
