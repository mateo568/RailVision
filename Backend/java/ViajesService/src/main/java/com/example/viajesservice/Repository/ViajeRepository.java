package com.example.viajesservice.Repository;

import com.example.viajesservice.Entity.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ViajeRepository extends JpaRepository<Viaje, Integer> {
    boolean existsByRutaIdInAndEstado (List<Integer> rutasId, String estado);

    List<Viaje> findByFechaSalidaBetween (LocalDateTime inicioDia, LocalDateTime finDia);

    List<Viaje> findByFechaLlegadaBetween (LocalDateTime inicioDia, LocalDateTime finDia);
}
