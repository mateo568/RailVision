package com.example.rutasservice.Controller;

import com.example.rutasservice.Dtos.RutaGetEstadoDto;
import com.example.rutasservice.Dtos.RutaPostDto;
import com.example.rutasservice.Dtos.RutasPutDto;
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
                .estado("activo").fechaCreacion(LocalDateTime.now()).build());

        rutas.add(Ruta.builder().id(2).nombre("Ruta Buenos Aires - Mendoza").estacionOrigen(1)
                .estacionDestino(8).distanciaKm(new BigDecimal("1050.75")).estado("inactivo")
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

    @Test
    public void consultarEstadoRutas() throws Exception {
        List<RutaGetEstadoDto> estadoRutas = new ArrayList<>();
        estadoRutas.add(RutaGetEstadoDto.builder().rutaId(1).estado("activo").build());
        estadoRutas.add(RutaGetEstadoDto.builder().rutaId(2).estado("inactivo").build());

        when(rutaService.consultarEstadoRutas()).thenReturn(estadoRutas);

        MvcResult result = mockMvc.perform(get("/railvision/rutas/estado").contentType(MediaType.APPLICATION_JSON))
                .andDo(print()).andExpect(status().isOk()).andReturn();

        List<RutaGetEstadoDto> rutasResultado = List.of(testMapper.readValue(result.getResponse()
                .getContentAsString(Charset.defaultCharset()), RutaGetEstadoDto[].class));

        assertEquals(2, rutasResultado.size());
        assertEquals(1, rutasResultado.get(0).getRutaId());
        assertEquals("inactivo", rutasResultado.get(1).getEstado());
    }

    @Test
    public void crearRuta() throws Exception {
        RutaPostDto rutaDto = RutaPostDto.builder().nombre("Ruta Córdoba - Rosario")
                .estacionOrigen(10).estacionDestino(12).distanciaKm(new BigDecimal("400.50"))
                .build();

        when(rutaService.crearRuta(rutaDto)).thenReturn(rutas.get(0));

        MvcResult result = mockMvc.perform(post("/railvision/rutas").contentType(MediaType.APPLICATION_JSON)
                .content(testMapper.writeValueAsString(rutaDto))).andDo(print()).andExpect(status().isOk()).andReturn();

        Ruta rutaResultado = testMapper.readValue(result.getResponse().getContentAsString(), Ruta.class);

        assertEquals("Ruta Córdoba - Rosario", rutaResultado.getNombre());
        assertEquals(10, rutaResultado.getEstacionOrigen());
        assertEquals("activo", rutaResultado.getEstado());
    }

    @Test
    public void modificarEstadoRuta() throws Exception {
        Ruta ruta = Ruta.builder().id(3).nombre("Ruta Buenos Aires - Mendoza").estacionOrigen(1)
                .estacionDestino(8).distanciaKm(new BigDecimal("1050.75")).estado("mantenimiento")
                .fechaCreacion(LocalDateTime.of(2024, 5, 15, 10, 30))
                .build();

        when(rutaService.modificarRuta(3, "mantenimiento")).thenReturn(ruta);

        MvcResult result = mockMvc.perform(put("/railvision/rutas/3").contentType(MediaType.TEXT_PLAIN)
                .content("mantenimiento")).andDo(print()).andExpect(status().isOk()).andReturn();

        Ruta rutaResultado = testMapper.readValue(result.getResponse().getContentAsString(), Ruta.class);

        assertNotNull(rutaResultado);
        assertEquals(ruta.getId(), rutaResultado.getId());
        assertEquals(ruta.getEstado(), rutaResultado.getEstado());
    }

    @Test
    public void modificarRutas() throws Exception {
        List<RutasPutDto> listaDto = new ArrayList<>();
        listaDto.add(RutasPutDto.builder().rutaId(1).nombre("Ruta Córdoba - Rosario").estado("activa").build());
        listaDto.add(RutasPutDto.builder().rutaId(2).nombre("Ruta Buenos Aires - Mendoza").estado("inactiva").build());

        when(rutaService.modificarRutas(listaDto)).thenReturn(rutas);

        MvcResult result = mockMvc.perform(put("/railvision/rutas").contentType(MediaType.APPLICATION_JSON)
                .content(testMapper.writeValueAsString(listaDto))).andDo(print()).andExpect(status().isOk()).andReturn();

        List<Ruta> rutasResultado = List.of(testMapper.readValue(result.getResponse().getContentAsString(), Ruta[].class));


        assertEquals(2, rutasResultado.size());
        assertEquals(rutas.get(0).getNombre(), rutasResultado.get(0).getNombre());
        assertEquals(rutas.get(1).getEstado(), rutasResultado.get(1).getEstado());
    }

    @Test
    public void eliminarRuta() throws Exception {
        doNothing().when(rutaService).eliminarRuta(rutas.get(0).getId());

        mockMvc.perform(delete("/railvision/rutas/1"))
                .andDo(print()).andExpect(status().isNoContent());

        verify(rutaService, times(1)).eliminarRuta(1);
    }
}
