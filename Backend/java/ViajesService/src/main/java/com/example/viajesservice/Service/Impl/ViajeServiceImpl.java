package com.example.viajesservice.Service.Impl;

import com.example.viajesservice.Entity.Viaje;
import com.example.viajesservice.Repository.ViajeRepository;
import com.example.viajesservice.Service.ViajeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ViajeServiceImpl implements ViajeService {

    @Autowired
    ViajeRepository repository;

    @Override
    public List<Viaje> consultarViajes() { return repository.findAll(); }
}
