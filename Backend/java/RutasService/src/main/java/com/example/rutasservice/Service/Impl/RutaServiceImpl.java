package com.example.rutasservice.Service.Impl;

import com.example.rutasservice.Dtos.RutaPostDto;
import com.example.rutasservice.Dtos.RutasPutDto;
import com.example.rutasservice.Entity.Ruta;
import com.example.rutasservice.Repository.RutaRepository;
import com.example.rutasservice.Service.RutaService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RutaServiceImpl implements RutaService {

    @Autowired
    RutaRepository repository;

    @Override
    public List<Ruta> consultarRutas() { return repository.findAll(); }

    @Override
    public Ruta crearRuta(RutaPostDto datosRuta) {
        return repository.save(Ruta.builder()
                .nombre(datosRuta.getNombre()).estacionOrigen(datosRuta.getEstacionOrigen())
                .estacionDestino(datosRuta.getEstacionDestino())
                .distanciaKm(datosRuta.getDistanciaKm()).estado("Activa")
                .fechaCreacion(LocalDateTime.now())
                .build());
    }

    @Override
    public Ruta modificarRuta(Integer rutaId, String estado) {
        Ruta ruta = repository.findById(rutaId).orElseThrow(
                () -> new EntityNotFoundException("No se encontro la ruta a modificar"));

        ruta.setEstado(estado);
        return repository.save(ruta);
    }

    @Override
    @Transactional
    public List<Ruta> modificarRutas(List<RutasPutDto> listaRutas) {

        List<Ruta> listaRutasActualizada = new ArrayList<>();

        for (RutasPutDto ruta : listaRutas) {
            Ruta rutaModificada = repository.findById(ruta.getRutaId()).orElseThrow(
                    () -> new EntityNotFoundException("No se encontro la ruta ('"+ ruta.getNombre() + "') para modificarla"));

            rutaModificada.setNombre(ruta.getNombre());
            rutaModificada.setEstado(ruta.getEstado());
            listaRutasActualizada.add(repository.save(rutaModificada));
        }

        return listaRutasActualizada;
    }
}
