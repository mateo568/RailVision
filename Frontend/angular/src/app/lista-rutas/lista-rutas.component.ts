import { Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Ruta } from '../../models/Entity/ruta';
import { ServicioRutasService } from '../../services/servicio-rutas.service';
import { Estacion } from '../../models/Entity/estacion';
import { Ciudad } from '../../models/Entity/ciudad';
import { ServicioEstacionService } from '../../services/servicio-estacion.service';
import { DtoListadoRutas } from '../../models/Dto/dto-ruta';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-lista-rutas',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './lista-rutas.component.html',
  styleUrl: './lista-rutas.component.css'
})
export class ListaRutasComponent implements OnInit, OnDestroy{
  private subscripciones: Subscription[] = [];

  private tooltips: any[] = [];

  listaRutas: Ruta[] = [];  // Datos del observable "rutas" estructurado en base a la entidad de rutas de la base de datos
  listaEstaciones: Estacion[] = [];

  listadoRutas: DtoListadoRutas[] = []; // Datos de "listaRutas" estructurado para presentar en la tabla de la pantalla
  listaCiudadesOrigen: string[] = [];
  listaCiudadesDestino: string[] = [];

  filtroEstado: string = "";
  filtroCiudadOrigen: string = "";
  filtroCiudadDestino: string = "";
  listaFiltrada: DtoListadoRutas[] = [];  // Datos filtrado de "listadoRutas"

  servicioRuta = inject(ServicioRutasService)
  servicioEstacion = inject(ServicioEstacionService)

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.cargarToggles();
    this.cargarDatos();

    setTimeout(() => {
      localStorage.setItem('nombrePantalla', 'Rutas')
      window.dispatchEvent(new Event('storage'));
    });
  }

  private cargarToggles() {
      const tooltipElements = this.el.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipElements.forEach((el: HTMLElement) => {
      const tooltip = new bootstrap.Tooltip(el, { container: 'body', trigger: 'hover' });
      this.tooltips.push(tooltip);
    });
  }

  cargarDatos(){
    this.subscripciones.push(
      forkJoin({
        rutas: this.servicioRuta.getRutas(),
        estaciones: this.servicioEstacion.getEstaciones()
      }).subscribe(({rutas, estaciones}) => {
        this.listaRutas = rutas;
        this.listaEstaciones = estaciones;
        this.cargarListadoRutas();
      }))
  }

  cargarListadoRutas(){
    this.listaCiudadesOrigen = [];
    this.listaCiudadesDestino = [];
    this.listadoRutas = [];

    this.listaRutas.forEach( ruta => {
      if(!ruta.bajaLogica) {
        var estacionOrigen: Estacion | undefined;
        var estacionDestino: Estacion | undefined;
  
        estacionOrigen = this.listaEstaciones.find(estacion => estacion.id === ruta.estacionOrigen)
        estacionDestino = this.listaEstaciones.find(estacion => estacion.id === ruta.estacionDestino)
  
        var item: DtoListadoRutas = {
          id: ruta.id,
          nombre: ruta.nombre,
          ciudadOrigen: estacionOrigen?.ciudad.nombre!,
          ciudadDestino: estacionDestino?.ciudad.nombre!,
          estadoEstacionOrigen: estacionOrigen?.estado!,
          estadoEstacionDestino: estacionDestino?.estado!,
          estado: ruta.estado
        };
        
        this.listaCiudadesOrigen.push(estacionOrigen?.ciudad.nombre!)
        this.listaCiudadesDestino.push(estacionDestino?.ciudad.nombre!)
        this.listadoRutas.push(item);
      }
    });

    this.listaCiudadesOrigen = Array.from(new Set(this.listaCiudadesOrigen));
    this.listaCiudadesDestino = Array.from(new Set(this.listaCiudadesDestino));
    this.filtrar();
  }

  filtrar() {
    this.listaFiltrada = this.listadoRutas;

    if(this.filtroEstado){
      this.listaFiltrada = this.listaFiltrada.filter( ruta =>{
        return ruta.estado === this.filtroEstado;
      } )
    }

    if(this.filtroCiudadOrigen){
      this.listaFiltrada = this.listaFiltrada.filter( ruta => {
        return ruta.ciudadOrigen === this.filtroCiudadOrigen;
      } )
    }

    if(this.filtroCiudadDestino){
      this.listaFiltrada = this.listaFiltrada.filter( ruta => {
        return ruta.ciudadDestino === this.filtroCiudadDestino;
      } )
    }
  }

  limpiarFiltro(){
    this.filtroEstado = "";
    this.filtroCiudadOrigen = "";
    this.filtroCiudadDestino = "";
    this.filtrar();
  }

  modificarEstadoRuta(id: number, estado: string){
    const sub = this.servicioRuta.putEstadoRuta(id,estado).subscribe(() =>{
      this.filtroEstado = "";
      this.filtroCiudadOrigen = "";
      this.filtroCiudadDestino = "";
      this.cargarDatos();
    })

    //console.log("Id: " + id + " Estado: " + estado)
  }

  ngOnDestroy(): void {
    this.subscripciones.forEach(sub => sub.unsubscribe());

    const tooltipTriggerList = this.el.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((tooltipTriggerEl: any) => {
      const t = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
      if (t) {
        t.dispose();
      }
    });
  }
}
