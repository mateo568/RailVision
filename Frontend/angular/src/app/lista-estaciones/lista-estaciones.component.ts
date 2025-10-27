import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ServicioMapaService } from '../../services/servicio-mapa.service';
import { Observable, Subscription } from 'rxjs';
import { Estacion } from '../../models/Entity/estacion';
import { ServicioEstacionService } from '../../services/servicio-estacion.service';
import { CommonModule } from '@angular/common';
import { Ciudad } from '../../models/Entity/ciudad';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { DtoPostEstacion, DtoPutEstacion } from '../../models/Dto/dto-estacion';
import { Ruta } from '../../models/Entity/ruta';
import { ServicioRutasService } from '../../services/servicio-rutas.service';
import { DtoPutRuta } from '../../models/Dto/dto-ruta';

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
  rutas!: Observable<Ruta[]>
  private subscripciones: Subscription[] = [];

  listaCiudades: Ciudad[] = [];
  listaEstaciones: Estacion[] = [];
  listaRutas: Ruta[] = [];
  listaFiltrada: Estacion[] = [];

  modalEstacion: DtoPutEstacion = { id: 0, nombre: "", estado: true };
    nuevaEstacion = new FormGroup({
    nombre: new FormControl('',[Validators.required, Validators.minLength(7)]),
    ciudad: new FormControl(0,[Validators.required])
  })
  
  filtroEstado: string = "";

  servicioMapa = inject(ServicioMapaService)
  servicioEstacion = inject(ServicioEstacionService)
  servicioRuta = inject(ServicioRutasService)

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

    this.rutas = this.servicioRuta.getRutas();
    this.subscripciones.push(
      this.rutas.subscribe(rutas => {
        this.listaRutas = rutas;
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

  crearEstacion(){
    if (this.nuevaEstacion.valid){ 
      const form = this.nuevaEstacion.value ;
    
      const estacion: DtoPostEstacion = {
        nombre: form.nombre!,
        ciudad: form.ciudad!
      }

      console.log("Datos correctos: " + estacion.nombre + ", " + estacion.ciudad)

      // const sub = this.servicioEstacion.postEstacion(estacion).subscribe(() =>{
      //   this.mapa = this.servicioMapa.limpiarIconos();
      //   this.cargarDatos();
      //   this.filtroEstado = "";
      // })
  
      // this.subscripciones.push(sub);
    } else { console.log("falta completar") }
  }

  modificarEstacion(){
    if (this.modalEstacion.nombre && this.modalEstacion.nombre?.trim().length >= 7) {
      const sub = this.servicioEstacion.putEstacion(this.modalEstacion).subscribe(() =>{
        this.mapa = this.servicioMapa.limpiarIconos();
        this.filtroEstado = "";
        this.modificarRutas()
      });
  
      this.subscripciones.push(sub);
    } else { console.log("Datos no validos") }
  }

  modificarRutas() {
    const listaRutasModificadas = this.listaRutas.filter( estacion => {
      return estacion.estacionOrigen == this.modalEstacion.id || estacion.estacionDestino == this.modalEstacion.id
    })
    
    var listaRutasDto: DtoPutRuta[] = [];
    listaRutasModificadas.forEach( ruta => {
      var estacion: Estacion | undefined;
      var nombreRuta = "";
      var estadoRuta = "";

      if (ruta.estacionOrigen === this.modalEstacion.id){
        estacion = this.listaEstaciones.find( estacion => estacion.id === ruta.estacionDestino )
        nombreRuta = `Ruta ${this.modalEstacion.nombre} - ${estacion?.nombre}`
      } else {
        estacion = this.listaEstaciones.find( estacion => estacion.id === ruta.estacionOrigen )
        nombreRuta = `Ruta ${estacion?.nombre} - ${this.modalEstacion.nombre}`
      }
       
      if (this.modalEstacion.estado && estacion?.estado) {estadoRuta = "activo" }
      else { estadoRuta = "inactivo" }

      var rutaModificada: DtoPutRuta = { rutaId: ruta.id, nombre: nombreRuta, estado: estadoRuta }
      listaRutasDto.push(rutaModificada)
    });

    const sub = this.servicioRuta.putRutas(listaRutasDto).subscribe(() => {
      this.cargarDatos();
    })

    this.subscripciones.push(sub);
  }

  ngOnDestroy(): void {
    this.subscripciones.forEach(sub => sub.unsubscribe());
  }
}
