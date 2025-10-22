package com.example.estacionesservice.Service.Impl;

import com.example.estacionesservice.Entity.Ciudad;
import com.example.estacionesservice.Repository.CiudadRepository;
import com.example.estacionesservice.Service.CiudadService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CiudadServiceImpl implements CiudadService {

    @Autowired
    CiudadRepository repository;

    @Override
    public Ciudad consultarCiudad(Integer id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Ciudad no encontrada"));
    }

    public List<Ciudad> consultarCiudades(){ return repository.findAll(); }
}
