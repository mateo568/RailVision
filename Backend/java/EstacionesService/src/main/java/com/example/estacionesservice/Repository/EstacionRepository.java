package com.example.estacionesservice.Repository;

import com.example.estacionesservice.Entity.Ciudad;
import com.example.estacionesservice.Entity.Estacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstacionRepository extends JpaRepository<Estacion, Integer> {
    Optional<Estacion> findByCiudadAndBajaLogica(Ciudad ciudad, Boolean estado);
}
