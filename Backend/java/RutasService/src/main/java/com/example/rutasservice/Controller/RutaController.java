package com.example.rutasservice.Controller;

import com.example.rutasservice.Dtos.RutaPostDto;
import com.example.rutasservice.Dtos.RutasPutDto;
import com.example.rutasservice.Entity.Ruta;
import com.example.rutasservice.Service.RutaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/railvision/rutas")
public class RutaController {

    @Autowired
    RutaService rutaService;

    @GetMapping
    public ResponseEntity<List<Ruta>> consultarRutas() { return ResponseEntity.ok(rutaService.consultarRutas()); }

    @PostMapping
    public ResponseEntity<Ruta> crearRuta(@RequestBody RutaPostDto rutaNueva) {
        return ResponseEntity.ok(rutaService.crearRuta(rutaNueva));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ruta> modificarRuta(@PathVariable Integer id, @RequestBody String estado) {
        return ResponseEntity.ok(rutaService.modificarRuta(id,estado));
    }

    @PutMapping()
    public ResponseEntity<List<Ruta>> modificarEstadoRutas(@RequestBody List<RutasPutDto> rutasModificadas){
        return ResponseEntity.ok(rutaService.modificarRutas(rutasModificadas));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRuta(@PathVariable Integer id) {
        rutaService.eliminarRuta(id);
        return ResponseEntity.noContent().build();
    }
}
