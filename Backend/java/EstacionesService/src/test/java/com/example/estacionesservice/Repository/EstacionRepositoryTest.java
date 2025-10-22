package com.example.estacionesservice.Repository;

import com.example.estacionesservice.Entity.Ciudad;
import com.example.estacionesservice.Entity.Estacion;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@DataJpaTest
public class EstacionRepositoryTest {

    @Autowired
    EstacionRepository repository;

    @Autowired
    CiudadRepository ciudadRepository;

    @BeforeEach
    public void crearDatos() {
        Ciudad ciudad = Ciudad.builder().nombre("Cordoba")
                .provincia("Cordoba").pais("Argentina")
                .latitud("-30.192039").longitud("-62.193847").build();

        ciudadRepository.save(ciudad);

        repository.save(Estacion.builder().nombre("Prueba 1")
                .estado(true).fechaCreacion(LocalDateTime.now()).ciudad(ciudad).build());

        repository.save(Estacion.builder().nombre("Prueba 2")
                .estado(false).fechaCreacion(LocalDateTime.now()).ciudad(ciudad).build());
    }

    @Test
    public void consultarListadoEstaciones() {

        List<Estacion> estaciones = repository.findAll();

        assertNotNull(estaciones);
        assertThat(estaciones.get(0).getId()).isEqualTo(1);
        assertThat(estaciones.get(1).getEstado()).isEqualTo(false);
        assertThat(estaciones.size()).isEqualTo(2);
    }
}
