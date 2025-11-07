package com.example.viajesservice.Repository;

import com.example.viajesservice.Entity.Cargamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CargamentoRepository extends JpaRepository<Cargamento, Integer> {
}
