package com.example.viajesservice.Controller;

import com.example.viajesservice.Dtos.Viaje.ViajePostDto;
import com.example.viajesservice.Dtos.Viaje.ViajePutDto;
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
    public ResponseEntity<List<Viaje>> consultarViajes() { return ResponseEntity.ok(viajeService.consultarViajes()); }

    @GetMapping("/viajesExistentes")
    public ResponseEntity<Boolean> consultarViajesExistentes(@RequestParam List<Integer> rutasId) {
        return ResponseEntity.ok(viajeService.consultarViajeProgramado(rutasId));
    }

    @PostMapping
    public ResponseEntity<Viaje> crearViaje(@RequestBody ViajePostDto nuevoViaje) {
        return ResponseEntity.ok(viajeService.crearViaje(nuevoViaje));
    }

    @PutMapping
    public ResponseEntity<Viaje> modificarViaje(@RequestBody ViajePutDto viajeModificado) {
        return ResponseEntity.ok(viajeService.modificarViaje(viajeModificado));
    }

    @DeleteMapping("/{viajeId}")
    public ResponseEntity<Void> cancelarViaje(@PathVariable Integer viajeId) {
        viajeService.eliminarViaje(viajeId);
        return ResponseEntity.noContent().build();
    }
}
