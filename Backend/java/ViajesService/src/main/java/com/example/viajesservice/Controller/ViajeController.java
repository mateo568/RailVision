package com.example.viajesservice.Controller;

import com.example.viajesservice.Dtos.Viaje.ViajePostDto;
import com.example.viajesservice.Entity.Viaje;
import com.example.viajesservice.Service.ViajeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/railvision/viajes")
public class ViajeController {

    @Autowired
    ViajeService viajeService;

    @GetMapping
    public ResponseEntity<List<Viaje>> consultarRutas() { return ResponseEntity.ok(viajeService.consultarViajes()); }

    @PostMapping
    public ResponseEntity<Viaje> crearViaje(@RequestBody ViajePostDto nuevoViaje) {
        return ResponseEntity.ok(viajeService.crearViaje(nuevoViaje));
    }

    @DeleteMapping("/{viajeId}")
    public ResponseEntity<Void> cancelarViaje(@PathVariable Integer viajeId) {
        viajeService.eliminarViaje(viajeId);
        return ResponseEntity.noContent().build();
    }
}
