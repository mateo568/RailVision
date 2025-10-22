package com.example.estacionesservice.Service.Impl;

import com.example.estacionesservice.Dtos.EstacionPutDto;
import com.example.estacionesservice.Entity.Ciudad;
import com.example.estacionesservice.Entity.Estacion;
import com.example.estacionesservice.Repository.EstacionRepository;
import com.example.estacionesservice.Service.EstacionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EstacionServiceImpl implements EstacionService {

    @Autowired
    EstacionRepository repository;

    public List<Estacion> consultarEstaciones() {
        return repository.findAll();
    }

    @Override
    public Estacion crearEstacion(String nombre, Ciudad ciudad) {
        Estacion estacion = Estacion.builder().nombre(nombre).estado(true)
                .fechaCreacion(LocalDateTime.now()).ciudad(ciudad).build();

        Optional<Estacion> estacionExistente = repository.findByCiudad(ciudad);

        if (estacionExistente.isPresent()) {
            throw new IllegalArgumentException("Ya existe una estacion en esta ubicacion");
        }

        return repository.save(estacion);
    }

    public Estacion modificarEstacion(Integer id, EstacionPutDto datos) {
        Estacion estacion = repository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Estacion no encontrada"));

        estacion.setNombre(datos.getNombre());
        estacion.setEstado(datos.getEstado());
        return repository.save(estacion);
    }

}
