package com.example.viajesservice.Service.Impl;

import com.example.viajesservice.Dtos.Viaje.ViajePostDto;
import com.example.viajesservice.Entity.Cargamento;
import com.example.viajesservice.Entity.Viaje;
import com.example.viajesservice.Repository.CargamentoRepository;
import com.example.viajesservice.Repository.ViajeRepository;
import com.example.viajesservice.Service.ViajeService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ViajeServiceImpl implements ViajeService {

    @Autowired
    ViajeRepository repository;

    @Autowired
    CargamentoRepository cargamentoRepository;

    @Override
    public List<Viaje> consultarViajes() { return repository.findAll(); }

    @Override
    @Transactional
    public Viaje crearViaje(ViajePostDto nuevoViaje) {

        Viaje viaje = Viaje.builder().trenId(nuevoViaje.getTrenId())
                .rutaId(nuevoViaje.getRutaId()).usuarioId(nuevoViaje.getUsuarioId())
                .fechaSalida(nuevoViaje.getFechaSalida()).fechaLlegada(nuevoViaje.getFechaLlegada())
                .carga(nuevoViaje.getCarga()).estado("programado").fechaCreacion(LocalDateTime.now())
                .build();

        Viaje viajeGuardado = repository.save(viaje);

        List<Cargamento> listaCargamentos = Optional.ofNullable(nuevoViaje.getListaCargamento()).orElse(List.of())
                .stream().map(c -> Cargamento.builder().viajeId(viajeGuardado.getId()).detalle(c.getDetalle()).tipo(c.getTipo()).peso(c.getPeso())
                        .build()).toList();

        cargamentoRepository.saveAll(listaCargamentos);

        viajeGuardado.setCargamentos(listaCargamentos);

        return viajeGuardado;
    }

    @Override
    @Transactional
    public void eliminarViaje(Integer viajeId) {
        Viaje viaje = repository.findById(viajeId).orElseThrow(
                () -> new EntityNotFoundException("No se encontro el viaje a eliminar")
        );

        viaje.setEstado("cancelado");
        repository.save(viaje);
    }
}
