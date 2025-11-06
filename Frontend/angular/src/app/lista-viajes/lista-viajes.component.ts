import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Viaje } from '../../models/Entity/viaje';
import { ServicioViajesService } from '../../services/servicio-viajes.service';
import { Ruta } from '../../models/Entity/ruta';
import { ServicioRutasService } from '../../services/servicio-rutas.service';
import { DtoListaViaje } from '../../models/Dto/dto-viaje';

@Component({
  selector: 'app-lista-viajes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-viajes.component.html',
  styleUrl: './lista-viajes.component.css'
})
export class ListaViajesComponent implements OnInit, OnDestroy{
  private subscripciones: Subscription[] = [];

  listaViajes: Viaje[] = [];
  listaRutas: Ruta[] = [];

  listadoViajes: DtoListaViaje[] = [];

  servicioViaje = inject(ServicioViajesService)
  servicioRuta = inject(ServicioRutasService)
  router = inject(Router);

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {

    this.subscripciones.push(
      forkJoin({
        rutas: this.servicioRuta.getRutas(),
        viajes: this.servicioViaje.getViajes()
      }).subscribe(({rutas, viajes}) =>{
        this.listaRutas = rutas;
        this.listaViajes = viajes;
        this.cargarListado();
      })
    )
  }

  cargarListado() {
    const estados = ["en curso", "programado", "finalizado", "cancelado"];
    this.listadoViajes = [];

    this.listaViajes.forEach( viaje => {
      const Ruta = this.listaRutas.find(ruta => ruta.id === viaje.rutaId)?.nombre! 

      var item: DtoListaViaje = {
        id: viaje.id,
        trenId: viaje.trenId,
        ruta: Ruta.replace(/^Ruta\s*/i, ""),
        usuarioId: viaje.usuarioId,
        fechaSalida: viaje.fechaSalida,
        fechaLlegada: viaje.fechaLlegada,
        carga: viaje.carga,
        estado: viaje.estado,
        fechaCreacion: viaje.fechaCreacion,
      }

      this.listadoViajes.push(item)
    });

    this.listadoViajes.sort((a,b) => estados.indexOf(a.estado) - estados.indexOf(b.estado))
  }

  cancelarViaje(id: number) {
    const sub = this.servicioViaje.deleteViaje(id).subscribe(() =>{
      alert("Viaje cancelado")
      this.cargarDatos()
    })
  }

  irMenuViajes() {
    this.router.navigate(["menu/viajes"]);
  }

  ngOnDestroy(): void {
    this.subscripciones.forEach(sub => sub.unsubscribe());
  }
}
