package com.example.rutasservice.Service.Impl;

import com.example.rutasservice.Dtos.RutaDeleteDto;
import com.example.rutasservice.Dtos.RutaGetEstadoDto;
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
    public List<RutaGetEstadoDto> consultarEstadoRutas() {
        List<Ruta> rutas = repository.findByBajaLogica(false);
        List<RutaGetEstadoDto> listaDto = new ArrayList<>();

        for (Ruta r : rutas) {
            listaDto.add(RutaGetEstadoDto.builder()
                    .rutaId(r.getId()).nombre(r.getNombre()).estado(r.getEstado()).build());
        }

        return listaDto;
    }

    @Override
    @Transactional
    public Ruta crearRuta(RutaPostDto datosRuta) {
        return repository.save(Ruta.builder()
                .nombre(datosRuta.getNombre()).estacionOrigen(datosRuta.getEstacionOrigen())
                .estacionDestino(datosRuta.getEstacionDestino())
                .distanciaKm(datosRuta.getDistanciaKm()).estado("activo")
                .fechaCreacion(LocalDateTime.now()).bajaLogica(false)
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

    @Override
    @Transactional
    public void eliminarRuta(Integer rutaId) {
        Ruta ruta = repository.findById(rutaId).orElseThrow(
                () -> new EntityNotFoundException("No se encontro la ruta a eliminar"));

        repository.delete(ruta);
    }

    @Override
    @Transactional
    public void eliminarRutas(RutaDeleteDto rutas) {
        List<Ruta> listaRutas = new ArrayList<>();
        for (Integer id : rutas.getRutasId()) {
            Ruta ruta = rutas.getEstado() ? repository.findByIdAndBajaLogica(id, false).orElseThrow(
                    () -> new EntityNotFoundException("No se encontro la ruta a eliminar"))
                    : repository.findById(id).orElseThrow(
                    () -> new EntityNotFoundException("No se encontro la ruta a eliminar"));

                ruta.setBajaLogica(rutas.getEstado());
                ruta.setFechaDestruccion(rutas.getEstado() ? LocalDateTime.now() : null);

                listaRutas.add(ruta);
        }
        repository.saveAll(listaRutas);
    }
}
