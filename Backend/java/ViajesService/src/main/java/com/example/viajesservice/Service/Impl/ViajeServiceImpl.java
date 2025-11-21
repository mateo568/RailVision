package com.example.viajesservice.Service.Impl;

import com.example.viajesservice.Dtos.Cargamento.CargamentoPutDto;
import com.example.viajesservice.Dtos.Viaje.ViajePostDto;
import com.example.viajesservice.Dtos.Viaje.ViajePutDto;
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
import java.util.ArrayList;
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
                .stream().map(c -> Cargamento.builder()
                        .viajeId(viajeGuardado.getId()).detalle(c.getDetalle())
                        .tipo(c.getTipo()).peso(c.getPeso()).estado("activo")
                        .build()).toList();

        cargamentoRepository.saveAll(listaCargamentos);

        viajeGuardado.setCargamentos(listaCargamentos);

        return viajeGuardado;
    }

    @Override
    @Transactional
    public Viaje modificarViaje(ViajePutDto dtoViaje) {
        Viaje viajeModificado = repository.findById(dtoViaje.getViajeId()).orElseThrow(
                () -> new EntityNotFoundException("No se encontro el viaje a modificar")
        );

        viajeModificado.setFechaSalida(dtoViaje.getFechaSalida());
        viajeModificado.setFechaLlegada(dtoViaje.getFechaLlegada());
        viajeModificado.setCarga(dtoViaje.getCarga());

        if (dtoViaje.getListaCargamento() == null || dtoViaje.getListaCargamento().isEmpty()) {
            repository.save(viajeModificado);
            return viajeModificado;
        }

        List<Cargamento> cargamentoViaje = cargamentoRepository.findAllByViajeId(dtoViaje.getViajeId());
        List<Cargamento> cargamentoModificado = new ArrayList<>();
        for (CargamentoPutDto c : dtoViaje.getListaCargamento()) {

            Optional<Cargamento> cargamento = cargamentoViaje.stream()
                    .filter(car -> car.getId().equals(c.getId())).findFirst();

            if (cargamento.isPresent()) {
                Cargamento car = cargamento.get();

                if ("activo".equalsIgnoreCase(c.getEstado())) {
                    car.setDetalle(c.getDetalle());
                    car.setTipo(c.getTipo());
                    car.setPeso(c.getPeso());
                    car.setEstado("activo");
                }
                if ("inactivo".equalsIgnoreCase(c.getEstado())) {
                    car.setEstado("inactivo");
                }
                cargamentoModificado.add(car);
            }
            else {
                cargamentoModificado.add(Cargamento.builder().viajeId(dtoViaje.getViajeId())
                        .detalle(c.getDetalle()).tipo(c.getTipo()).peso(c.getPeso())
                        .estado("activo").build());
            }

        }

        cargamentoRepository.saveAll(cargamentoModificado);
        viajeModificado.getCargamentos().clear();
        viajeModificado.getCargamentos().addAll(cargamentoModificado);

        repository.save(viajeModificado);

        return viajeModificado;
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
