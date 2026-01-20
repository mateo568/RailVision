package com.example.estacionesservice.Controller;

import com.example.estacionesservice.Dtos.EstacionPostDto;
import com.example.estacionesservice.Dtos.EstacionPutDto;
import com.example.estacionesservice.Entity.Ciudad;
import com.example.estacionesservice.Entity.Estacion;
import com.example.estacionesservice.Service.CiudadService;
import com.example.estacionesservice.Service.EstacionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;


@WebMvcTest(EstacionController.class)
@AutoConfigureMockMvc(addFilters = false)
public class EstacionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EstacionService service;

    @MockBean
    private CiudadService ciudadService;

    List<Estacion> estaciones = new ArrayList<>();
    Ciudad ciudad;

    @BeforeEach
    void crearEntidades() {
        ciudad = Ciudad.builder().id(1).nombre("Cordoba").provincia("Cordoba").pais("Argentina")
                .latitud("-30.192039").longitud("-62.193847").build();

        estaciones.add(Estacion.builder().id(1).nombre("Nueva estacion")
                .estado(true).fechaCreacion(LocalDateTime.now()).ciudad(ciudad).build());
        estaciones.add(Estacion.builder().id(2).nombre("Prueba 2")
                .estado(true).fechaCreacion(LocalDateTime.now()).ciudad(new Ciudad()).build());

    }

    @Test
    void consultarEstaciones() throws Exception {
        when(service.consultarEstaciones()).thenReturn(estaciones);

        MvcResult result = this.mockMvc.perform(get("/railvision/estaciones").contentType(MediaType.APPLICATION_JSON))
                .andDo(print()).andExpect(status().isOk()).andReturn();

        List<Estacion> estacionesResultado = List.of(objectMapper.readValue(result.getResponse().getContentAsString(), Estacion[].class));

        assertThat(estacionesResultado.size()).isEqualTo(2);
        assertThat(estacionesResultado.get(0).getNombre()).isEqualTo("Nueva estacion");
        assertThat(estacionesResultado.get(1).getId()).isNotEqualTo(1);
        assertEquals(estaciones.get(0).getNombre(), estacionesResultado.get(0).getNombre());
    }

    @Test
    void crearEstacion() throws Exception {
        EstacionPostDto estacionPostDto = EstacionPostDto.builder().nombre("Nueva estacion")
                .ciudad(1).build();

        when(ciudadService.consultarCiudad(estacionPostDto.getCiudad())).thenReturn(ciudad);
        when(service.crearEstacion(estacionPostDto.getNombre(),ciudad)).thenReturn(estaciones.get(0));


        MvcResult result = mockMvc.perform(post("/railvision/estaciones").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(estacionPostDto))).andDo(print()).andExpect(status().isOk()).andReturn();

        Estacion estacionResultado = objectMapper.readValue(result.getResponse().getContentAsString(), Estacion.class);

        assertThat(estacionResultado.getNombre()).isEqualTo("Nueva estacion");
        assertThat(estacionResultado.getCiudad()).isEqualTo(ciudad);
    }

    @Test
    void crearEstacionCiudadInvalida() throws Exception {
        EstacionPostDto estacionPostDto = EstacionPostDto.builder().nombre("Nueva estacion")
                .ciudad(1).build();

        when(ciudadService.consultarCiudad(estacionPostDto.getCiudad())).thenReturn(ciudad);
        when(service.crearEstacion(estacionPostDto.getNombre(),ciudad))
                .thenThrow(new IllegalStateException("Ya existe una estacion en esta ubicacion"));

//        assertThrows(ServletException.class, () -> mockMvc.perform(post("/railvision/estaciones")
//                                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(estacionPostDto))));

        mockMvc.perform(post("/railvision/estaciones").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(estacionPostDto))).andDo(print()).andExpect(status().isBadRequest())
                .andExpect(result -> assertThat(result.getResolvedException()).isInstanceOf(IllegalStateException.class)
                        .hasMessage("Ya existe una estacion en esta ubicacion"));

    }

    @Test
    void modificarEstacion() throws Exception {

        EstacionPutDto estacionDto = new EstacionPutDto("Prueba 3", false);

        Estacion estacionModificada = Estacion.builder().id(1).nombre("Prueba 3")
                .estado(false).fechaCreacion(LocalDateTime.now()).ciudad(new Ciudad()).build();

        when(service.modificarEstacion(estaciones.get(0).getId(),estacionDto)).thenReturn(estacionModificada);

        MvcResult result = mockMvc.perform(put("/railvision/estaciones/1").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(estacionDto))).andDo(print()).andExpect(status().isOk()).andReturn();

        Estacion estacionResultado = objectMapper.readValue(result.getResponse().getContentAsString(), Estacion.class);

        assertThat(estacionResultado.getId()).isEqualTo(estaciones.get(0).getId());
        assertThat(estacionResultado.getNombre()).isEqualTo("Prueba 3");
        assertThat(estacionResultado.getEstado()).isEqualTo(false);
    }

}
