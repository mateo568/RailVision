import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-form-viaje',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-viaje.component.html',
  styleUrl: './form-viaje.component.css'
})
export class FormViajeComponent implements OnInit{
  private mapa: any;
  router = inject(Router)

  nuevoViaje = new FormGroup({
    estacionIda: new FormControl('',[Validators.required]),
    estacionVuelta: new FormControl('',[Validators.required]),
    tren: new FormControl('',[Validators.required]),
    fecha: new FormControl('',[Validators.required]),
    horarioSalida: new FormControl('',[Validators.required]),
    horarioLlegada: new FormControl([Validators.required]),
    cargas: new FormArray([])
  })

  get arrayCargas(){
    return this.nuevoViaje.get("cargas") as FormArray;
  }

  ngOnInit(): void {
    this.iniciarMapa();
  }

  private iniciarMapa(){

    this.mapa = L.map('map', {minZoom: 7, maxZoom: 9, maxBounds: [
    [-36, -67], // suroeste
    [-29, -61]  // noreste
    ], maxBoundsViscosity: 1.0}).setView([-31.4167, -64.1833], 7);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.mapa);
  
    // Marcador en el centro de Córdoba (Plaza San Martín)
    L.marker([-31.419429, -64.188938]).addTo(this.mapa)
      .bindPopup('Centro de Córdoba')
      .openPopup();

          // Marcador en Villa María
    L.marker([-32.407500, -63.240833]).addTo(this.mapa)
      .bindPopup('Villa María')
      .openPopup();

    // Marcador en Río Cuarto
    L.marker([-33.130647, -64.349809]).addTo(this.mapa)
      .bindPopup('Río Cuarto')
      .openPopup();

    // Marcador en San Francisco
    L.marker([-31.427960, -62.082620]).addTo(this.mapa)
      .bindPopup('San Francisco')
      .openPopup();
  }

  private fixLeafletIconPaths() {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/assets/leaflet/marker-icon-2x.png',
      iconUrl: '/assets/leaflet/marker-icon.png',
      shadowUrl: '/assets/leaflet/marker-shadow.png',
    });
  }

  agregarCarga(){
    const nuevaCarga: FormGroup = new FormGroup({
      tipo: new FormControl('',[Validators.required]),
      detalle: new FormControl('',[Validators.required]),
      cantVagones: new FormControl(0,[Validators.required]),
      peso: new FormControl(0,[Validators.required]),

    })
    this.arrayCargas.push(nuevaCarga);
  }

  eliminarCarga(index: number){
    this.arrayCargas.removeAt(index);
  }

  irMenuViajes(){
    this.router.navigate(["menu/viajes"]);
  }

  submit(){
    alert("A");
    
  }


}
