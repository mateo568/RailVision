package com.example.rutasservice.Service;

import com.example.rutasservice.Entity.Ruta;
import com.example.rutasservice.Repository.RutaRepository;
import com.example.rutasservice.Service.Impl.RutaServiceImpl;
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

import static org.junit.jupiter.api.Assertions.*;
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
                .estado("Activa").fechaCreacion(LocalDateTime.now()).build());

        rutas.add(Ruta.builder().id(2).nombre("Ruta Buenos Aires - Mendoza").estacionOrigen(1)
                .estacionDestino(8).distanciaKm(new BigDecimal("1050.75")).estado("Inactiva")
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

}
