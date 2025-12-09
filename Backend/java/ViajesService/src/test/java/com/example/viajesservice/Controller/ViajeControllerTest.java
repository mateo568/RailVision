package com.example.viajesservice.Controller;

import com.example.viajesservice.Dtos.Cargamento.CargamentoPostDto;
import com.example.viajesservice.Dtos.Cargamento.CargamentoPutDto;
import com.example.viajesservice.Dtos.Viaje.ViajePostDto;
import com.example.viajesservice.Dtos.Viaje.ViajePutDto;
import com.example.viajesservice.Entity.Cargamento;
import com.example.viajesservice.Entity.Viaje;
import com.example.viajesservice.Service.ViajeService;
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
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ViajeController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ViajeControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ViajeService viajeService;

    List<Viaje> viajes = new ArrayList<>();

    List<Cargamento> cargamentos = new ArrayList<>();

    @BeforeEach
    void crearEntidades() {
        cargamentos.add(Cargamento.builder().id(1).viajeId(1).detalle("Piedra caliza")
                .tipo("mineria").peso(new BigDecimal(5)).estado("activo").build());

        viajes.add(Viaje.builder().id(1).trenId(1).rutaId(2).usuarioId(7).fechaSalida(LocalDateTime.now())
                .fechaLlegada(LocalDateTime.now().plusHours(3)).carga(new BigDecimal("12.50"))
                .estado("programado").fechaCreacion(LocalDateTime.now()).cargamentos(cargamentos).build());

        viajes.add(Viaje.builder().id(2).trenId(2).rutaId(1).usuarioId(3).fechaSalida(LocalDateTime.now())
                .fechaLlegada(LocalDateTime.now().plusHours(4)).carga(new BigDecimal("14.50"))
                .estado("programado").fechaCreacion(LocalDateTime.now()).cargamentos(cargamentos).build());
    }

    @Test
    void consultarViajes() throws Exception {
        when(viajeService.consultarViajes()).thenReturn(viajes);

        MvcResult result = this.mockMvc.perform(get("/railvision/viajes").contentType(MediaType.APPLICATION_JSON))
                .andDo(print()).andExpect(status().isOk()).andReturn();

        List<Viaje> resultado = List.of(objectMapper.readValue(result.getResponse().getContentAsString(), Viaje[].class));

        assertEquals(2, resultado.size());
        assertEquals(1, resultado.get(0).getId());
        assertEquals(1, resultado.get(1).getCargamentos().size());
    }

    @Test
    void consultarViajesExistentes() throws Exception {
        when(viajeService.consultarViajeProgramado(List.of(1))).thenReturn(true);

        MvcResult result = this.mockMvc.perform(get("/railvision/viajes/viajesExistentes")
                        .contentType(MediaType.APPLICATION_JSON).param("rutasId","1"))
                .andDo(print()).andExpect(status().isOk()).andReturn();

        Boolean resultado = objectMapper.readValue(result.getResponse().getContentAsString(), Boolean.class);

        assertEquals(true, resultado);
    }

    @Test
    void crearViaje() throws Exception {
        List<CargamentoPostDto> cargamentos = new ArrayList<>();
        cargamentos.add(CargamentoPostDto.builder().detalle("Piedra caliza")
                .tipo("mineria").peso(new BigDecimal("5"))
                .build());

        ViajePostDto dto = ViajePostDto.builder().trenId(1).rutaId(2).usuarioId(7)
                .fechaSalida(LocalDateTime.now()).fechaLlegada(LocalDateTime.now().plusHours(3))
                .carga(new BigDecimal("12.50")).listaCargamento(cargamentos)
                .build();

        when(viajeService.crearViaje(dto)).thenReturn(viajes.get(0));

        MvcResult result = this.mockMvc.perform(post("/railvision/viajes")
                        .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(dto)))
                .andDo(print()).andExpect(status().isOk()).andReturn();

        Viaje resultado = objectMapper.readValue(result.getResponse().getContentAsString(), Viaje.class);

        assertEquals(viajes.get(0).getId(),resultado.getId());
        assertEquals(7, resultado.getUsuarioId());
        assertEquals(1, resultado.getCargamentos().size());
    }

    @Test
    void modificarViaje() throws Exception {
        List<CargamentoPutDto> cargamentos = new ArrayList<>();
        cargamentos.add(CargamentoPutDto.builder().detalle("Piedra caliza")
                .tipo("mineria").peso(new BigDecimal("5")).estado("activo")
                .build());

        ViajePutDto viajePutDto = ViajePutDto.builder().viajeId(1)
                .fechaSalida(LocalDateTime.now()).fechaLlegada(LocalDateTime.now().plusHours(3))
                .carga(new BigDecimal("12.50")).listaCargamento(cargamentos)
                .build();

        when(viajeService.modificarViaje(viajePutDto)).thenReturn(viajes.get(0));

        MvcResult result = this.mockMvc.perform(put("/railvision/viajes")
                        .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(viajePutDto)))
                .andDo(print()).andExpect(status().isOk()).andReturn();

        Viaje resultado = objectMapper.readValue(result.getResponse().getContentAsString(), Viaje.class);

        assertEquals(viajes.get(0).getId(),resultado.getId());
        assertEquals(7, resultado.getUsuarioId());
        assertEquals(1, resultado.getCargamentos().size());
        assertEquals("activo", resultado.getCargamentos().get(0).getEstado());
    }

    @Test
    void eliminarViaje() throws Exception {
        doNothing().when(viajeService).eliminarViaje(viajes.get(0).getId());

        mockMvc.perform(delete("/railvision/viajes/1"))
                .andDo(print()).andExpect(status().isNoContent());

        verify(viajeService, times(1)).eliminarViaje(1);
    }
}
