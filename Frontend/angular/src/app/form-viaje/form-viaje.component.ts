import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { forkJoin, Subscription } from 'rxjs';
import { ServicioMapaService } from '../../services/servicio-mapa.service';
import { ServicioViajesService } from '../../services/servicio-viajes.service';
import { ServicioEstacionService } from '../../services/servicio-estacion.service';
import { ServicioRutasService } from '../../services/servicio-rutas.service';
import { Estacion } from '../../models/Entity/estacion';
import { DtoPostCargamento, DtoPostViaje } from '../../models/Dto/dto-viaje';
import { Ruta } from '../../models/Entity/ruta';
import { Tren } from '../../models/Entity/tren';
import { ServicioTrenesService } from '../../services/servicio-trenes.service';

@Component({
  selector: 'app-form-viaje',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-viaje.component.html',
  styleUrl: './form-viaje.component.css'
})
export class FormViajeComponent implements OnInit, OnDestroy{
  private subscripciones: Subscription[] = []
  
  listaRutas: Ruta[] = [];
  listaEstaciones: Estacion[] = [];
  listaTrenes: Tren[] = [];

  listaEstacionesOrigen: Estacion[] = []
  listaEstacionesDestino: Estacion[] = []
  rutaViaje: Ruta | undefined;

  private mapa: any;
  private icono: any;
  private cronometro: any;


  private servicioMapa = inject(ServicioMapaService)
  private servicioViaje = inject(ServicioViajesService)
  private servicioEstacion = inject(ServicioEstacionService)
  private servicioRuta = inject(ServicioRutasService)
  private servicioTren = inject(ServicioTrenesService)
  private router = inject(Router)

  nuevoViaje = new FormGroup({
    estacionOrigen: new FormControl(0,[Validators.required]),
    estacionDestino: new FormControl(0,[Validators.required]),
    tren: new FormControl('',[Validators.required]),
    fecha: new FormControl('',[Validators.required]),
    horarioSalida: new FormControl('',[Validators.required]),
    horarioLlegada: new FormControl('',[Validators.required]),
    cargas: new FormArray([])
  }, {validators: this.validarHoraSalida });

  get arrayCargas(){
    return this.nuevoViaje.get("cargas") as FormArray;
  }

  ngOnInit(): void {
    setTimeout(() => { this.mapa = this.servicioMapa.iniciarMapa(); });
    this.cargarDatos();

    this.nuevoViaje.get("horarioSalida")?.valueChanges.subscribe(() => {
    if (this.rutaViaje) {
      this.calcularTiempoLlegada();
    }
    });
  }

  cargarDatos() {
    this.subscripciones.push(
      forkJoin({
        estaciones: this.servicioEstacion.getEstaciones(),
        rutas: this.servicioRuta.getRutas(),
        trenes: this.servicioTren.getTrenes()
      }).subscribe(({estaciones, rutas, trenes}) =>{
        this.listaEstaciones = estaciones
        this.listaEstacionesOrigen = this.listaEstaciones.filter(e => e.estado === true);
        this.listaEstacionesDestino = this.listaEstaciones.filter(e => e.estado === true);
        this.listaRutas = rutas;
        this.listaTrenes = trenes;
      })
    )
  }

  filtrarEstaciones() {
    this.listaEstacionesOrigen = this.listaEstaciones;
    this.listaEstacionesDestino = this.listaEstaciones;

    let estacionOrigen = this.nuevoViaje.get("estacionOrigen")?.value
    let estacionDestino = this.nuevoViaje.get("estacionDestino")?.value

    if (estacionOrigen) {
      this.listaEstacionesDestino = this.listaEstacionesDestino.filter(e => e.id !== Number(estacionOrigen))
    }

    if (estacionDestino) {
      this.listaEstacionesOrigen = this.listaEstacionesOrigen.filter(e => e.id !== Number(estacionDestino))
    }

    if (estacionOrigen && estacionDestino) {
      this.rutaViaje = this.listaRutas.find( r => r.estacionOrigen === Number(estacionOrigen) && r.estacionDestino === Number(estacionDestino))
      if (this.nuevoViaje.get("horarioSalida")?.value) this.calcularTiempoLlegada();

      clearTimeout(this.cronometro)
      this.cronometro = setTimeout(() => { this.graficarRuta(Number(estacionOrigen),Number(estacionDestino)) }, 2000)
    }
  }

  graficarRuta(estacionOrigen: number, estacionDestino: number) {
    this.mapa = this.servicioMapa.limpiarIconos();
    this.servicioMapa.borrarRuta(this.mapa);

    var iconoOrigen = this.listaEstaciones.find(e => e.id === estacionOrigen)
    var iconoDestino = this.listaEstaciones.find(e => e.id === estacionDestino)
    
    this.icono = this.servicioMapa.cargarIcono(iconoOrigen?.ciudad.latitud!, iconoOrigen?.ciudad.longitud!, iconoOrigen?.nombre!)
    this.icono.addTo(this.mapa);

    this.icono = this.servicioMapa.cargarIcono(iconoDestino?.ciudad.latitud!, iconoDestino?.ciudad.longitud!, iconoDestino?.nombre!)
    this.icono.addTo(this.mapa);

    const latitudOrigen = Number(iconoOrigen?.ciudad.latitud);
    const longitudOrigen = Number(iconoOrigen?.ciudad.longitud);
    const latitudDestino = Number(iconoDestino?.ciudad.latitud);
    const longitudDestino = Number(iconoDestino?.ciudad.longitud);

    this.servicioMapa.calcularRuta([longitudOrigen,latitudOrigen],[longitudDestino,latitudDestino],this.mapa);
  }

  agregarCarga(){
    const nuevaCarga: FormGroup = new FormGroup({
      tipo: new FormControl('',[Validators.required]),
      detalle: new FormControl('',[Validators.required]),
      peso: new FormControl(0,[Validators.required]),
    })
    this.arrayCargas.push(nuevaCarga);
  }

  eliminarCarga(index: number){
    this.arrayCargas.removeAt(index);
  }

  validarHoraSalida(formGroup: AbstractControl): ValidationErrors | null {
    const fecha = formGroup.get("fecha")?.value;
    const hora = formGroup.get("horarioSalida")?.value;

    if (!fecha || !hora) return null;

    const horarioSalida = new Date(`${fecha}T${hora}:00`)
    if (horarioSalida <= new Date()) return {horaInvalida: true}
    
    return null;
  }

  calcularTiempoLlegada() {
    if (this.rutaViaje){
      const tiempoRecorrido = this.rutaViaje?.distanciaKm! / 60;
      const horarioSalida = this.nuevoViaje.get("horarioSalida")?.value;
  
      const horasRecorridas = Math.floor(tiempoRecorrido);
      const minutosRecorridos = Math.round((tiempoRecorrido - horasRecorridas) * 60);
  
      const [horas, minutos] = horarioSalida!.split(':').map(Number);
      const hora = { horas, minutos };
  
      let horaLlegada = hora.horas + horasRecorridas;
      let minutosLlegada = hora.minutos + minutosRecorridos;
  
      if (minutosLlegada >= 60) {
        minutosLlegada -= 60;
        horaLlegada += 1;
      }
      if (horaLlegada >= 24) { horaLlegada -= 24; }
  
      this.nuevoViaje.get("horarioLlegada")?.setValue(`${horaLlegada.toString().padStart(2,'0')}:${minutosLlegada.toString().padStart(2,'0')}`)
    }
  }

  ajustarFechas(valorFecha: string): string {
    const horarioSalida = this.nuevoViaje.get("horarioSalida")?.value;
    const horarioLlegada = this.nuevoViaje.get("horarioLlegada")?.value;

    const fechaSalida = new Date(`${valorFecha}T${horarioSalida}:00`);
    const fechaLlegada = new Date(`${valorFecha}T${horarioLlegada}:00`);

    if (fechaLlegada <= fechaSalida) {
      fechaLlegada.setDate(fechaLlegada.getDate() + 1);
    }

    const año = fechaLlegada.getFullYear();
    const mes = String(fechaLlegada.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaLlegada.getDate()).padStart(2, '0');
    const hora = String(fechaLlegada.getHours()).padStart(2, '0');
    const minutos = String(fechaLlegada.getMinutes()).padStart(2, '0');
    const segundos = String(fechaLlegada.getSeconds()).padStart(2, '0');

    return `${año}-${mes}-${dia}T${hora}:${minutos}:${segundos}`;
  }

  submit(){
    if (this.nuevoViaje.valid){
      const form = this.nuevoViaje.value;
      
      const fechaSalida = `${form.fecha}T${form.horarioSalida}:00`;
      const fechaLlegada = this.ajustarFechas(form.fecha!);
      
      const carga = this.arrayCargas.value.reduce((total: number, c: { tipo: string; detalle: string; peso: number }) => total + c.peso,0);
      
      const rutaId = this.rutaViaje ? this.rutaViaje.id : 100

      // BUSCAR RUTA - Servicio ruta
      // Si no exste la ruta crearla
      // Usar el id de la ruta

      let dtoViaje: DtoPostViaje = {
        trenId: Number(form.tren!),
        rutaId: rutaId,
        usuarioId: 1,
        fechaSalida: fechaSalida,
        fechaLlegada: fechaLlegada,
        carga: carga,
        listaCargamento: form.cargas ?? []
      }

      
      const sub = this.servicioViaje.postViaje(dtoViaje).subscribe(() => {
        alert("Viaje creado")
        console.log(dtoViaje)
      })

      this.subscripciones.push(sub);

    } else { alert("Datos invalidos"); }

  }
  
  irMenuViajes(){
    this.router.navigate(["menu/viajes"]);
  }
  
  ngOnDestroy(): void {
    this.subscripciones.forEach(sub => sub.unsubscribe());
    this.mapa = this.servicioMapa.eliminarMapa(this.mapa);
  }
}
