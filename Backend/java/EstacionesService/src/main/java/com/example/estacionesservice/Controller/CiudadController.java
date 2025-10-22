package com.example.estacionesservice.Controller;

import com.example.estacionesservice.Entity.Ciudad;
import com.example.estacionesservice.Service.CiudadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/railvision/ciudades")
public class CiudadController {

    @Qualifier("ciudadServiceImpl")
    @Autowired
    CiudadService ciudadService;

    @GetMapping
    public List<Ciudad> getCiudades(){
        return ciudadService.consultarCiudades();
    }
}
