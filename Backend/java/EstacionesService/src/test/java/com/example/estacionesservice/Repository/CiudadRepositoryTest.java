package com.example.estacionesservice.Repository;

import com.example.estacionesservice.Entity.Ciudad;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

@DataJpaTest
public class CiudadRepositoryTest {

    @Autowired
    CiudadRepository repository;

    @Test
    public void consultarListadoCiudades(){
        repository.save(Ciudad.builder().nombre("Córdoba")
                .provincia("Cordoba").pais("Argentina")
                .latitud("-30.192039").longitud("-62.193847").build());

        repository.save(Ciudad.builder().nombre("Rio Cuarto")
                .provincia("Cordoba").pais("Argentina")
                .latitud("-30.192039").longitud("-62.293829").build());

        List<Ciudad> ciudades = repository.findAll();

        Assertions.assertThat(ciudades).isNotNull();
        Assertions.assertThat(ciudades).hasSize(2);
        Assertions.assertThat(ciudades.get(0).getNombre()).isEqualTo("Córdoba");
        Assertions.assertThat(ciudades.get(1).getLongitud()).isEqualTo("-62.293829");
    }
}
