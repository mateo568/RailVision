import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom, forkJoin, Subscription } from 'rxjs';
import { ServicioMapaService } from '../../services/servicio-mapa.service';
import { ServicioViajesService } from '../../services/servicio-viajes.service';
import { ServicioEstacionService } from '../../services/servicio-estacion.service';
import { ServicioRutasService } from '../../services/servicio-rutas.service';
import { Estacion } from '../../models/Entity/estacion';
import { DtoPostCargamento, DtoPostViaje } from '../../models/Dto/dto-viaje';
import { Ruta } from '../../models/Entity/ruta';
import { Tren } from '../../models/Entity/tren';
import { ServicioTrenesService } from '../../services/servicio-trenes.service';
import { DtoPostRuta } from '../../models/Dto/dto-ruta';
declare var bootstrap: any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-viaje',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-viaje.component.html',
  styleUrl: './form-viaje.component.css'
})
export class FormViajeComponent implements OnInit, OnDestroy{
  private subscripciones: Subscription[] = []
  
  private tooltips: any[] = [];

  listaRutas: Ruta[] = [];
  listaEstaciones: Estacion[] = [];
  listaTrenes: Tren[] = [];

  listaEstacionesOrigen: Estacion[] = []
  listaEstacionesDestino: Estacion[] = []
  rutaViaje: Ruta | undefined;
  rutaInexistente: boolean = false;

  private mapa: any;
  private icono: any;
  private cronometro: any;

  cargaMaxima: number = 0;
  cargaActual: number = 0;
  fechaMinima: string = "";

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
  }, {validators: [this.validarHoraSalida, this.validarCargaViaje.bind(this)] });

  get arrayCargas(){
    return this.nuevoViaje.get("cargas") as FormArray;
  }

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    
    setTimeout(() => { 
      this.mapa = this.servicioMapa.iniciarMapa(); 
      localStorage.setItem('nombrePantalla', 'Nuevo viaje')
      window.dispatchEvent(new Event('storage'));
    });

    this.cargarToggles();
    this.cargarDatos();

    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);

    // Formato YYYY-MM-DD requerido por input date
    this.fechaMinima = mañana.toISOString().split('T')[0];

    this.nuevoViaje.get("horarioSalida")?.valueChanges.subscribe(() => {
    if (this.rutaViaje) {
      this.calcularTiempoLlegada();
    }
    });
  }

  private cargarToggles() {
      const tooltipElements = this.el.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipElements.forEach((el: HTMLElement) => {
      const tooltip = new bootstrap.Tooltip(el, { container: 'body', trigger: 'hover' });
      this.tooltips.push(tooltip);
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
        this.listaEstacionesOrigen = this.listaEstaciones.filter(e => e.estado === true && e.bajaLogica === false);
        this.listaEstacionesDestino = this.listaEstaciones.filter(e => e.estado === true && e.bajaLogica === false);
        this.listaRutas = rutas;
        this.listaTrenes = trenes;
      })
    )
  }

  filtrarEstaciones() {
    this.listaEstacionesOrigen = this.listaEstaciones.filter(e => e.estado === true && e.bajaLogica === false);
    this.listaEstacionesDestino = this.listaEstaciones.filter(e => e.estado === true && e.bajaLogica === false);
    this.rutaInexistente = false;

    let estacionOrigen = this.nuevoViaje.get("estacionOrigen")?.value
    let estacionDestino = this.nuevoViaje.get("estacionDestino")?.value

    if (estacionOrigen) {
      this.listaEstacionesDestino = this.listaEstacionesDestino.filter(e => e.id !== Number(estacionOrigen))
    }

    if (estacionDestino) {
      this.listaEstacionesOrigen = this.listaEstacionesOrigen.filter(e => e.id !== Number(estacionDestino))
    }

    if (estacionOrigen && estacionDestino) {
      this.definirRuta(estacionOrigen, estacionDestino)
      if (this.nuevoViaje.get("horarioSalida")?.value) this.calcularTiempoLlegada();

      clearTimeout(this.cronometro)
      this.cronometro = setTimeout(() => { this.graficarRuta(Number(estacionOrigen),Number(estacionDestino)) }, 2000)
    }
  }

  definirRuta(estacionOrigen: number, estacionDestino: number) {
    this.rutaViaje = this.listaRutas.find( r => r.estacionOrigen === Number(estacionOrigen) && r.estacionDestino === Number(estacionDestino))
    console.log("Ruta: ", this.rutaViaje)
    console.log("Ruta no existente: ", this.rutaInexistente)

    if (!this.rutaViaje) {
      this.rutaViaje = this.listaRutas.find( r => r.estacionOrigen === Number(estacionDestino) && r.estacionDestino === Number(estacionOrigen))
      this.rutaInexistente = true;
      console.log("Ruta: ", this.rutaViaje)
      console.log("Ruta no existente: ", this.rutaInexistente)
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
    if (!this.rutaViaje) {
      setTimeout(() => { 
        this.rutaViaje = { id: 0, nombre: "", estacionOrigen: estacionOrigen, estacionDestino: estacionDestino, 
          distanciaKm: Number(this.servicioMapa.distanciaRuta.toFixed(2)), estado: "", fechaCreacion: "", 
          bajaLogica: false, fechaDestruccion: null }
        this.rutaInexistente = true;
        this.calcularTiempoLlegada();
        console.log("Ruta: ", this.rutaViaje)
        console.log("Ruta no existente: ", this.rutaInexistente)
       }, 2000)
    }
  }

  calcularPeso() {
    this.cargaActual = this.arrayCargas.value.reduce((total: number, c: { tipo: string; detalle: string; peso: number }) => total + c.peso,0);
    this.nuevoViaje.updateValueAndValidity();
  }

  definirLimitePeso() {
    const trenId = this.nuevoViaje.get("tren")?.value;
    if (trenId) { this.cargaMaxima = this.listaTrenes.find(tren => tren.tren_id === Number(trenId))?.capacidad_toneladas! }
    else {this.cargaMaxima = 0}
    this.nuevoViaje.updateValueAndValidity();
  }

  agregarCarga(){
    const nuevaCarga: FormGroup = new FormGroup({
      tipo: new FormControl('',[Validators.required]),
      detalle: new FormControl('',[Validators.required]),
      peso: new FormControl(0,[Validators.required, Validators.min(1), Validators.pattern(/^\d+(\.\d{0,2})?$/)]),
    })
    this.arrayCargas.push(nuevaCarga);
  }

  eliminarCarga(index: number){
    this.arrayCargas.removeAt(index);
    this.calcularPeso();
  }

  validarHoraSalida(formGroup: AbstractControl): ValidationErrors | null {
    const fecha = formGroup.get("fecha")?.value;
    const hora = formGroup.get("horarioSalida")?.value;

    if (!fecha || !hora) return null;

    const horarioSalida = new Date(`${fecha}T${hora}:00`)
    if (horarioSalida <= new Date()) return {horaInvalida: true}
    
    return null;
  }

  validarCargaViaje(formGroup: AbstractControl): ValidationErrors | null {
    if (this.cargaActual > this.cargaMaxima) return {sobrepeso: true}

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

  async submit(){
    if (!this.nuevoViaje.valid){
      return;
    }

    const form = this.nuevoViaje.value;
    
    const fechaSalida = `${form.fecha}T${form.horarioSalida}:00`;
    const fechaLlegada = this.ajustarFechas(form.fecha!);
    
    var dtoNuevaRuta = null;
    var rutaId: number | undefined = undefined;
    ///const rutaId = this.rutaViaje ? this.rutaViaje.id : 100
    
    let dtoBase: Omit<DtoPostViaje, "rutaId"> = {
      trenId: Number(form.tren!),
      usuarioId: 1,
      fechaSalida: fechaSalida,
      fechaLlegada: fechaLlegada,
      carga: this.cargaActual,
      listaCargamento: form.cargas ?? []
    }

    console.log(dtoBase);

    try {
      // CREAR RUTA - Si no exste la ruta crearla
      if (this.rutaInexistente) {
        dtoNuevaRuta = this.crearNuevaRuta(this.rutaViaje!) 

        const rutaCreada = await firstValueFrom(this.servicioRuta.postRuta(dtoNuevaRuta!));
        rutaId = rutaCreada.id;
        console.log("Ruta creada => ",rutaCreada);

      } else {
        rutaId = this.rutaViaje?.id
      }

      let dtoViaje: DtoPostViaje = {
        ...dtoBase,
        rutaId: rutaId!
      }
      
      console.log("Usando rutaId => ", rutaId);  
      const sub = await firstValueFrom(this.servicioViaje.postViaje(dtoViaje))
      
      Swal.fire('Listo', 'Se ha creado exitosamente el viaje', 'success');
      console.log(dtoViaje)
      this.irMenuViajes()
    } 
    catch {
      try {
        if (this.rutaInexistente && rutaId){
          const subDeleteRuta = await firstValueFrom(this.servicioRuta.deleteRuta(rutaId!))
          console.log("Ruta borrada")
        }
      } 
      catch {
        console.log("Fallo en borrar las rutas")
      }

      Swal.fire('Error', 'No se pudo crear el viaje', 'error');
    }
  }
  
  crearNuevaRuta(ruta: Ruta): DtoPostRuta {
    const estacionOrigen = this.listaEstaciones.find(estacion => estacion.id === ruta.estacionOrigen)?.nombre;
    const estacionDestino = this.listaEstaciones.find(estacion => estacion.id === ruta.estacionDestino)?.nombre;

    var nuevaRuta: DtoPostRuta = {
      nombre: "",
      estacionOrigen: 0,
      estacionDestino: 0,
      distanciaKm: 0,
    }
    
    if (ruta.id === 0) {
      nuevaRuta.nombre = `Ruta ${estacionOrigen} - ${estacionDestino}`;
      nuevaRuta.estacionOrigen = ruta.estacionOrigen;
      nuevaRuta.estacionDestino = ruta.estacionDestino;
      nuevaRuta.distanciaKm = ruta.distanciaKm;
    } 
    else {
      nuevaRuta.nombre = `Ruta ${estacionDestino} - ${estacionOrigen}`;
      nuevaRuta.estacionOrigen = ruta.estacionDestino;
      nuevaRuta.estacionDestino = ruta.estacionOrigen;
      nuevaRuta.distanciaKm = ruta.distanciaKm;
    }

    return nuevaRuta;
  }

  irMenuViajes(){
    this.router.navigate(["menu/viajes"]);
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
