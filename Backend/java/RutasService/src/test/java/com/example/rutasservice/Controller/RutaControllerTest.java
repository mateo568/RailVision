package com.example.rutasservice.Controller;

import com.example.rutasservice.Entity.Ruta;
import com.example.rutasservice.Service.RutaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.nio.charset.Charset;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@WebMvcTest(RutaController.class)
@AutoConfigureMockMvc(addFilters = false)
public class RutaControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper testMapper;

    @MockBean
    RutaService rutaService;

    List<Ruta> rutas = new ArrayList<>();

    @BeforeEach
    void loadRutas() {
        rutas.add(Ruta.builder().id(1).nombre("Ruta Córdoba - Rosario").estacionOrigen(10)
                .estacionDestino(12).distanciaKm(new BigDecimal("400.50"))
                .estado("Activa").fechaCreacion(LocalDateTime.now()).build());

        rutas.add(Ruta.builder().id(2).nombre("Ruta Buenos Aires - Mendoza").estacionOrigen(1)
                .estacionDestino(8).distanciaKm(new BigDecimal("1050.75")).estado("Inactiva")
                .fechaCreacion(LocalDateTime.of(2024, 5, 15, 10, 30))
                .build());
    }

    @Test
    public void consultarRutas() throws Exception {
        when(rutaService.consultarRutas()).thenReturn(rutas);

        MvcResult result = mockMvc.perform(get("/railvision/rutas").contentType(MediaType.APPLICATION_JSON))
                .andDo(print()).andExpect(status().isOk()).andReturn();

        List<Ruta> rutasResultado = List.of(testMapper.readValue(result.getResponse().getContentAsString(Charset.defaultCharset()), Ruta[].class));

        assertEquals(2, rutasResultado.size());
        assertEquals("Ruta Córdoba - Rosario", rutasResultado.get(0).getNombre());
        assertEquals(8, rutasResultado.get(1).getEstacionDestino());
    }
}
