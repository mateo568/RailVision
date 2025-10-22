import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ServicioMapaService } from '../../services/servicio-mapa.service';
import { Observable, Subscription } from 'rxjs';
import { Estacion } from '../../models/Entity/estacion';
import { ServicioEstacionService } from '../../services/servicio-estacion.service';
import { CommonModule } from '@angular/common';
import { Ciudad } from '../../models/Entity/ciudad';
import { FormsModule, ReactiveFormsModule, ɵInternalFormsSharedModule } from "@angular/forms";
import { DtoPutEstacion } from '../../models/Dto/dto-put-estacion';

@Component({
  selector: 'app-lista-estaciones',
  standalone: true,
  imports: [CommonModule, ɵInternalFormsSharedModule, ReactiveFormsModule, FormsModule],
  templateUrl: './lista-estaciones.component.html',
  styleUrl: './lista-estaciones.component.css'
})
export class ListaEstacionesComponent implements OnInit, OnDestroy{

  private mapa: any;
  private marcador: any;
  
  estaciones!: Observable<Estacion[]>
  ciudades!: Observable<Ciudad[]>
  private subscripciones: Subscription[] = [];

  listaCiudades: Ciudad[] = [];
  listaEstaciones: Estacion[] = [];
  listaFiltrada: Estacion[] = [];
  modalEstacion: DtoPutEstacion = { id: 0, nombre: "", estado: true };
  filtroEstado: string = "";

  servicioMapa = inject(ServicioMapaService)
  servicioEstacion = inject(ServicioEstacionService)

  ngOnInit(): void {
    this.mapa = this.servicioMapa.iniciarMapa();
    this.cargarDatos();
  }
  
  cargarDatos(){
    this.ciudades = this.servicioEstacion.getCiudades();
    this.subscripciones.push(
      this.ciudades.subscribe(ciudades => {
        this.listaCiudades = ciudades;
      })
    )
    
    this.estaciones = this.servicioEstacion.getEstaciones();
    this.subscripciones.push(
      this.estaciones.subscribe(estaciones => {
        this.listaEstaciones = estaciones;
        this.listaFiltrada = this.listaEstaciones;
        this.cargarIconosEstacion();
      })
    )
  }

  cargarIconosEstacion(){
    this.listaFiltrada.forEach(estacion => {
      this.marcador = this.servicioMapa.cargarIconoEstado(estacion.ciudad.latitud, estacion.ciudad.longitud, 
                                                          estacion.nombre, estacion.estado);
      this.marcador.addTo(this.mapa);
    })
  }
  
  cargarModalEstacion(estacion: Estacion) {
    this.modalEstacion.id = estacion.id;
    this.modalEstacion.nombre = estacion.nombre;
    this.modalEstacion.estado = estacion.estado;
  }

  filtrarDatos() {
    this.mapa = this.servicioMapa.limpiarIconos();
    this.listaFiltrada = this.listaEstaciones;

    if (this.filtroEstado !== null && this.filtroEstado !== ""){
      const valor = this.filtroEstado === "true";
      this.listaFiltrada = this.listaEstaciones.filter( estacion => {
        return estacion.estado == valor; 
      });
    }
    this.cargarIconosEstacion();
  }

  modificarEstacion(){
    const sub = this.servicioEstacion.putEstadoEstacion(this.modalEstacion).subscribe(() =>{
      this.mapa = this.servicioMapa.limpiarIconos();
      this.cargarDatos();
      this.filtroEstado = "";
    });

    this.subscripciones.push(sub);
  }

  ngOnDestroy(): void {
    this.subscripciones.forEach(sub => sub.unsubscribe());
  }
}
