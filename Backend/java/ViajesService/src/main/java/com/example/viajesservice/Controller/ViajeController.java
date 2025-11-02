package com.example.viajesservice.Controller;

import com.example.viajesservice.Entity.Viaje;
import com.example.viajesservice.Service.ViajeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/railvision/viajes")
public class ViajeController {

    @Autowired
    ViajeService viajeService;

    @GetMapping
    public ResponseEntity<List<Viaje>> consultarRutas() { return ResponseEntity.ok(viajeService.consultarViajes()); }


}
