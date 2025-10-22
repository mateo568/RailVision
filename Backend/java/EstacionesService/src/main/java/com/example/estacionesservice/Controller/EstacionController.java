package com.example.estacionesservice.Controller;

import com.example.estacionesservice.Dtos.EstacionPostDto;
import com.example.estacionesservice.Dtos.EstacionPutDto;
import com.example.estacionesservice.Entity.Ciudad;
import com.example.estacionesservice.Entity.Estacion;
import com.example.estacionesservice.Service.CiudadService;
import com.example.estacionesservice.Service.EstacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/railvision/estaciones")
public class EstacionController {

    @Autowired
    EstacionService service;

    @Autowired
    CiudadService ciudadService;

    @GetMapping
    public ResponseEntity<List<Estacion>> getAllEstaciones(){
        return ResponseEntity.ok(service.consultarEstaciones());
    }

    @PostMapping
    public ResponseEntity<Estacion> postEstacion(@RequestBody EstacionPostDto estacionNueva) {
        Ciudad ciudad = ciudadService.consultarCiudad(estacionNueva.getCiudad());

        return ResponseEntity.ok(service.crearEstacion(estacionNueva.getNombre(), ciudad));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Estacion> putEstacion(@PathVariable Integer id, @RequestBody EstacionPutDto estacionModificada) {
        return ResponseEntity.ok(service.modificarEstacion(id, estacionModificada));
    }
}
