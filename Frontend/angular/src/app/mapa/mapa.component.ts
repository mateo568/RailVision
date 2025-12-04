import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { concatMap, delay, forkJoin, from, Subscription } from 'rxjs';
import { Viaje } from '../../models/Entity/viaje';
import { Ruta } from '../../models/Entity/ruta';
import { ServicioViajesService } from '../../services/servicio-viajes.service';
import { ServicioRutasService } from '../../services/servicio-rutas.service';
import { DtoListaMapaViaje } from '../../models/Dto/dto-viaje';
import { ServicioMapaService } from '../../services/servicio-mapa.service';
import { Estacion } from '../../models/Entity/estacion';
import { ServicioEstacionService } from '../../services/servicio-estacion.service';
import { Tren } from '../../models/Entity/tren';
import { ServicioTrenesService } from '../../services/servicio-trenes.service';
declare var bootstrap: any;

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent implements OnInit, OnDestroy{  
  private subscripciones: Subscription[] = [];

  private tooltips: any[] = [];

  listaViajes: Viaje[] = [];
  listaRutas: Ruta[] = [];
  listaEstaciones: Estacion[] = [];
  listaTrenes: Tren[] = [];

  listadoViajesCurso: DtoListaMapaViaje[] = [];
  listadoViajeProgramado: DtoListaMapaViaje[] = [];

  private mapa: any;
  private icono: any;

  servicioMapa = inject(ServicioMapaService)
  servicioViaje = inject(ServicioViajesService)
  servicioRuta = inject(ServicioRutasService)
  servicioEstacion = inject(ServicioEstacionService)
  servicioTrenes = inject(ServicioTrenesService)
  router = inject(Router);

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    setTimeout(() => { this.mapa = this.servicioMapa.iniciarMapa(); });
    this.cargarToggles();
    this.cargarDatos();
  }

  private cargarToggles() {
      const tooltipElements = this.el.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipElements.forEach((el: HTMLElement) => {
      const tooltip = new bootstrap.Tooltip(el);
      this.tooltips.push(tooltip);
    });
  }

  private cargarDatos() {
    this.subscripciones.push(
      forkJoin({
        rutas: this.servicioRuta.getRutas(),
        viajes: this.servicioViaje.getViajes(),
        estaciones: this.servicioEstacion.getEstaciones(),
        trenes: this.servicioTrenes.getTrenes()
      }).subscribe(({rutas, viajes, estaciones, trenes}) =>{
        this.listaRutas = rutas;
        this.listaViajes = viajes;
        this.listaEstaciones = estaciones;
        this.listaTrenes = trenes;
        this.cargarListados();
      })
    )
  }

  private cargarListados() {
    this.listadoViajeProgramado = [];
    this.listadoViajesCurso = [];
    this.listaViajes.filter(viaje => { return viaje.estado !== "finalizado" })

    this.listaViajes.forEach( viaje => {
      const Ruta = this.listaRutas.find(ruta => ruta.id === viaje.rutaId)?.nombre! 
      const Tren = this.listaTrenes.find(tren => tren.tren_id === viaje.trenId)?.codigo!

      var item: DtoListaMapaViaje = {
        id: viaje.id,
        tren: Tren,
        ruta: Ruta.replace(/^Ruta\s*/i, ""),
        fechaSalida: viaje.fechaSalida,
        fechaLlegada: viaje.fechaLlegada,
        estado: viaje.estado,
      }

      if (viaje.estado === "en curso" && this.listadoViajesCurso.length < 3) { this.listadoViajesCurso.push(item) }
      if (viaje.estado === "programado" && this.listadoViajeProgramado.length < 3){ this.listadoViajeProgramado.push(item) }
    });

    this.listadoViajesCurso.sort((a,b) => new Date(a.fechaLlegada.replace(" ", "T")).getTime() - new Date(b.fechaLlegada.replace(" ", "T")).getTime())
    this.listadoViajeProgramado.sort((a,b) => new Date(a.fechaSalida.replace(" ", "T")).getTime() - new Date(b.fechaSalida.replace(" ", "T")).getTime())
  }

  trazarViaje(ruta: string, estado: string) {
    console.log("Metodo llamado")
    const datosRuta = this.listaRutas.find(r => r.nombre === `Ruta ${ruta}`);
    if (!datosRuta) return;

    const estacionOrigen = this.listaEstaciones.find(e => e.id === datosRuta.estacionOrigen);
    const estacionDestino = this.listaEstaciones.find(e => e.id === datosRuta.estacionDestino);

    if (!estacionOrigen || !estacionDestino) return;

    const latitudOrigen = Number(estacionOrigen.ciudad.latitud);
    const longitudOrigen = Number(estacionOrigen.ciudad.longitud);
    const latitudDestino = Number(estacionDestino.ciudad.latitud);
    const longitudDestino = Number(estacionDestino.ciudad.longitud);

    this.icono = this.servicioMapa.cargarIcono(estacionOrigen.ciudad.latitud, estacionOrigen.ciudad.longitud, estacionOrigen.nombre)
    this.icono.addTo(this.mapa);
    
    this.icono = this.servicioMapa.cargarIcono(estacionDestino.ciudad.latitud, estacionDestino.ciudad.longitud, estacionDestino.nombre)
    this.icono.addTo(this.mapa) 

    this.servicioMapa.calcularRuta([longitudOrigen,latitudOrigen],[longitudDestino,latitudDestino],this.mapa)
  }

  irPostMapa() {
    this.router.navigate(["menu/viajes/post"]);
  }

  irListaViajes() {
    this.router.navigate(["menu/viajes/lista"]);
  }

  ngOnDestroy(): void {
    this.subscripciones.forEach(sub => sub.unsubscribe());
    this.mapa = this.servicioMapa.eliminarMapa(this.mapa);

    const tooltipTriggerList = this.el.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((tooltipTriggerEl: any) => {
      const t = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
      if (t) {
        t.dispose();
      }
    });
  }
}
