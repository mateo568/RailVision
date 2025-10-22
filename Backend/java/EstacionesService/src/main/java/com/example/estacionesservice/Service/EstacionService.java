package com.example.estacionesservice.Service;

import com.example.estacionesservice.Dtos.EstacionPostDto;
import com.example.estacionesservice.Dtos.EstacionPutDto;
import com.example.estacionesservice.Entity.Ciudad;
import com.example.estacionesservice.Entity.Estacion;

import java.util.List;

public interface EstacionService {
    List<Estacion> consultarEstaciones();

    Estacion crearEstacion(String nombre, Ciudad ciudad);

    Estacion modificarEstacion(Integer id, EstacionPutDto estacionPutDto);
}
