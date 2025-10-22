package com.example.estacionesservice.Controller;

import com.example.estacionesservice.Entity.Ciudad;
import com.example.estacionesservice.Service.CiudadService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;


@WebMvcTest(CiudadController.class)
@AutoConfigureMockMvc(addFilters = false)
public class CiudadControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    CiudadService service;

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
    void verificarExistencia() {
        assertThat(mockMvc).isNotNull();
        assertThat(service).isNotNull();
    }

    @Test
    void consultarEstaciones() throws Exception{

        when(service.consultarCiudades()).thenReturn(ciudades);

        this.mockMvc.perform(get("/railvision/ciudades").contentType(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isOk());
    }
}
