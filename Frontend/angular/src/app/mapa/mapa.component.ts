import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { concatMap, delay, forkJoin, from, Subscription } from 'rxjs';
import { Viaje } from '../../models/Entity/viaje';
import { Ruta } from '../../models/Entity/ruta';
import { ServicioViajesService } from '../../services/servicio-viajes.service';
import { ServicioRutasService } from '../../services/servicio-rutas.service';
import { DtoListaMapaViaje } from '../../models/Dto/dto-viaje';
import { ServicioMapaService } from '../../services/servicio-mapa.service';
import { Estacion } from '../../models/Entity/estacion';
import { ServicioEstacionService } from '../../services/servicio-estacion.service';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent implements OnInit, OnDestroy{  
  private subscripciones: Subscription[] = [];

  listaViajes: Viaje[] = [];
  listaRutas: Ruta[] = [];
  listaEstaciones: Estacion[] = [];

  listadoViajesCurso: DtoListaMapaViaje[] = [];
  listadoViajeProgramado: DtoListaMapaViaje[] = [];

  private mapa: any;
  private icono: any;

  servicioMapa = inject(ServicioMapaService)
  servicioViaje = inject(ServicioViajesService)
  servicioRuta = inject(ServicioRutasService)
  servicioEstacion = inject(ServicioEstacionService)
  router = inject(Router);

  ngOnInit(): void {
    this.mapa = this.servicioMapa.iniciarMapa();
    this.cargarDatos();

    // this.calcularRuta([-64.188938, -31.419429], [-63.240833, -32.407500]);
    // this.calcularRuta([-64.349869, -33.130684], [-63.240833, -32.407500]);
    // this.calcularRuta([-64.350349, -30.420956], [-64.499394, -31.420083]);
    // this.calcularRuta([-64.188938, -31.419429], [-62.082308, -31.427960]);

  //   const rutas: [number, number][][] = [
  //   [[-64.188938, -31.419429], [-63.240833, -32.407500]], // Córdoba → Villa María
  //   [[-64.349869, -33.130684], [-63.240833, -32.407500]], // Río Cuarto → Villa María
  //   [[-64.350349, -30.420956], [-64.499394, -31.420083]], // Deán Funes → Carlos Paz
  //   [[-64.188938, -31.419429], [-62.082308, -31.427960]], // Córdoba → San Francisco
  //   ];

  //   from(rutas).pipe(
  //     concatMap(([start, end]) =>
  //       // llamamos a calcularRuta con 1.5s de delay entre cada ruta
  //       this.delayCall(start, end, 2000)
  //     )
  //  ).subscribe();

        // private delayCall(start: [number, number], end: [number, number], ms: number) {
        //   return from([null]).pipe(
        //     delay(ms),
        //     concatMap(() => {
        //       this.calcularRuta(start, end);
        //       return from([true]); // devolver algo para que concatMap funcione
        //     })
        //   );
        // }
    
  }

  private cargarDatos() {
    this.subscripciones.push(
      forkJoin({
        rutas: this.servicioRuta.getRutas(),
        viajes: this.servicioViaje.getViajes(),
        estaciones: this.servicioEstacion.getEstaciones()
      }).subscribe(({rutas, viajes, estaciones}) =>{
        this.listaRutas = rutas;
        this.listaViajes = viajes;
        this.listaEstaciones = estaciones;
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

      var item: DtoListaMapaViaje = {
        id: viaje.id,
        trenId: viaje.trenId,
        ruta: Ruta.replace(/^Ruta\s*/i, ""),
        fechaSalida: viaje.fechaSalida,
        fechaLlegada: viaje.fechaLlegada,
        estado: viaje.estado,
      }

      if (viaje.estado === "en curso") { this.listadoViajesCurso.push(item) }
      if (viaje.estado === "programado"){ this.listadoViajeProgramado.push(item) }

    });
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
  }
}
