package com.example.estacionesservice;

import com.example.estacionesservice.Controller.CiudadController;
import com.example.estacionesservice.Controller.EstacionController;
import com.example.estacionesservice.Repository.CiudadRepository;
import com.example.estacionesservice.Repository.EstacionRepository;
import com.example.estacionesservice.Service.Impl.CiudadServiceImpl;
import com.example.estacionesservice.Service.Impl.EstacionServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class ContextoTest {

    @Autowired
    private EstacionController estacionController;

    @Autowired
    private EstacionServiceImpl estacionService;

    @Autowired
    private EstacionRepository estacionRepository;

    @Autowired
    private CiudadController ciudadController;

    @Autowired
    private CiudadServiceImpl ciudadService;

    @Autowired
    private CiudadRepository ciudadRepository;

    @Test
    void verificarExistencia() {
        assertThat(estacionController).isNotNull();
        assertThat(estacionService).isNotNull();
        assertThat(estacionRepository).isNotNull();
        assertThat(ciudadController).isNotNull();
        assertThat(ciudadService).isNotNull();
        assertThat(ciudadRepository).isNotNull();
    }
}
