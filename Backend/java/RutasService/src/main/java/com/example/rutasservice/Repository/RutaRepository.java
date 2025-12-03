package com.example.rutasservice.Repository;

import com.example.rutasservice.Entity.Ruta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RutaRepository extends JpaRepository<Ruta, Integer> {
    Optional<Ruta> findByIdAndBajaLogica (Integer id, Boolean estado);

    List<Ruta> findByBajaLogica (Boolean estado);
}
