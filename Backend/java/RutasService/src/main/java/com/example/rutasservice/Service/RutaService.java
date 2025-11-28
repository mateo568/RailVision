package com.example.rutasservice.Service;

import com.example.rutasservice.Dtos.RutaDeleteDto;
import com.example.rutasservice.Dtos.RutaPostDto;
import com.example.rutasservice.Dtos.RutasPutDto;
import com.example.rutasservice.Entity.Ruta;

import java.util.List;

public interface RutaService {
    List<Ruta> consultarRutas();
    Ruta crearRuta(RutaPostDto nuevaRuta);
    Ruta modificarRuta(Integer rutaId, String estado);
    List<Ruta> modificarRutas(List<RutasPutDto> estacionId);
    void eliminarRuta(Integer rutaId);
    void eliminarRutas(RutaDeleteDto rutas);
}
