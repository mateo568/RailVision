package com.example.estacionesservice.Service;

import com.example.estacionesservice.Entity.Ciudad;

import java.util.List;

public interface CiudadService {
    Ciudad consultarCiudad(Integer id);
    List<Ciudad> consultarCiudades();
}
