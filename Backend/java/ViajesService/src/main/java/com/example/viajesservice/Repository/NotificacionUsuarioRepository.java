package com.example.viajesservice.Repository;

import com.example.viajesservice.Entity.NotificacionUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionUsuarioRepository extends JpaRepository<NotificacionUsuario, Integer> {
    List<NotificacionUsuario> findAllByUsuarioIdAndLeidaOrderByFechaCreacionDesc(Integer id, Boolean leida);
}
