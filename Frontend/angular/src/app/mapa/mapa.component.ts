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

  private mapa: any;
  private icono: any;

  fechaActual: string = '';

  listaViajes: Viaje[] = [];
  listaRutas: Ruta[] = [];
  listaEstaciones: Estacion[] = [];
  listaTrenes: Tren[] = [];

  listadoViajesCurso: DtoListaMapaViaje[] = [];
  listadoViajeProgramado: DtoListaMapaViaje[] = [];

  servicioMapa = inject(ServicioMapaService)
  servicioViaje = inject(ServicioViajesService)
  servicioRuta = inject(ServicioRutasService)
  servicioEstacion = inject(ServicioEstacionService)
  servicioTrenes = inject(ServicioTrenesService)
  router = inject(Router);

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    setTimeout(() => { 
      this.mapa = this.servicioMapa.iniciarMapa(); 
      localStorage.setItem('nombrePantalla', 'Viajes')
      window.dispatchEvent(new Event('storage'));
    });
    
    this.cargarToggles();
    this.cargarDatos();
    this.cargarFechaActual();
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

        this.listaViajes = viajes.map(v => ({
          ...v,
          fechaSalida: this.parsearFechas(v.fechaSalida),
          fechaLlegada: this.parsearFechas(v.fechaLlegada)
        }));

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

      if (viaje.estado === "en curso" && this.compararFechaHoy(viaje.fechaLlegada) && this.listadoViajesCurso.length < 3) { this.listadoViajesCurso.push(item) }
      if (viaje.estado === "programado" && this.compararFechaHoy(viaje.fechaSalida) && this.listadoViajeProgramado.length < 3){ this.listadoViajeProgramado.push(item) }
    });

    this.listadoViajesCurso.sort((a,b) => this.parsearFechas(a.fechaLlegada)!.getTime() - this.parsearFechas(b.fechaLlegada)!.getTime() )
    this.listadoViajeProgramado.sort((a,b) => this.parsearFechas(a.fechaSalida)!.getTime() - this.parsearFechas(b.fechaSalida)!.getTime())
  }

  private parsearFechas(fecha: any): Date | null {
    if (!fecha) return null;

    if (Array.isArray(fecha)) {
      const [y, m, d, h = 0, min = 0, s = 0] = fecha;
      return new Date(y, m - 1, d, h, min, s);
    }

    return new Date(fecha);
  }

  private compararFechaHoy(fecha: any): boolean {
    const fechaParseada = this.parsearFechas(fecha);
    if (!fechaParseada) return false;
    
    const hoy = new Date();
    
    return hoy.getFullYear() === fechaParseada.getFullYear() &&
          hoy.getMonth() === fechaParseada.getMonth() &&
          hoy.getDate() === fechaParseada.getDate();
  }

  private cargarFechaActual() {
    let fecha = new Date();
    let mes = '';
    
    switch(fecha.getMonth()) {
      case 0: mes = 'Enero' 
              break;
      case 1: mes = 'Febrero'
              break;
      case 2: mes = 'Marzo'
              break;
      case 3: mes = 'Abril'
              break;
      case 4: mes = 'Mayo'
              break;
      case 5: mes = 'Junio'
              break;
      case 6: mes = 'Julio'
              break;
      case 7: mes = 'Agosto'
              break;
      case 8: mes = 'Septiembre'
              break;
      case 9: mes = 'Octubre'
              break;
      case 10: mes = 'Noviembre'
              break;
      case 11: mes = 'Diciembre'
              break;
    }

    this.fechaActual = `${fecha.getDate()} de ${mes} de ${fecha.getFullYear()}`
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
