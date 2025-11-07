package com.example.viajesservice.Service;

import com.example.viajesservice.Dtos.Viaje.ViajePostDto;
import com.example.viajesservice.Entity.Viaje;

import java.util.List;

public interface ViajeService {
    List<Viaje> consultarViajes();

    Viaje crearViaje(ViajePostDto nuevoViaje);

    void eliminarViaje(Integer viajeId);
}
