import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Viaje } from '../../models/Entity/viaje';
import { ServicioViajesService } from '../../services/servicio-viajes.service';
import { Ruta } from '../../models/Entity/ruta';
import { ServicioRutasService } from '../../services/servicio-rutas.service';
import { DtoListaViaje, DtoPutCargamento, DtoPutViaje } from '../../models/Dto/dto-viaje';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicioTrenesService } from '../../services/servicio-trenes.service';
import { Tren } from '../../models/Entity/tren';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
declare var bootstrap: any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-viajes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatPaginatorModule],
  templateUrl: './lista-viajes.component.html',
  styleUrl: './lista-viajes.component.css'
})
export class ListaViajesComponent implements OnInit, OnDestroy{
  private subscripciones: Subscription[] = [];

  private tooltips: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator

  listaViajes: Viaje[] = [];
  listaRutas: Ruta[] = [];
  listaTrenes: Tren[] = [];

  listadoViajes: DtoListaViaje[] = [];
  listaFiltrada: DtoListaViaje[] = [];
  paginaActual: DtoListaViaje[] = [];
  pageSize = 10;

  filtroRuta: string = "";
  filtroTren: string = "";
  filtroEstado: string = "";
  loading = false;


  detallesViaje: DtoListaViaje = { id: 0, tren: undefined, ruta: '', usuarioId: 0, fechaSalida: null, fechaLlegada: null,
                                  carga: 0, estado: '', fechaCreacion: null, detalleCarga: [] };
  viajeModificable: boolean = false;
  modificar: boolean = false;
  fechaSalidaActualizada: string = "";
  fehcaLlegadaActualizada: string = "";

  formViaje = new FormGroup({
    fecha: new FormControl("",[Validators.required]),
    horarioSalida: new FormControl("",[Validators.required]),
    horarioLlegada: new FormControl("",[Validators.required]),
    cargasActuales: new FormArray([]),
    cargasNuevas: new FormArray([])
  })
  duracionViaje: number = 0;

  get arrayCargasActuales(){
    return this.formViaje.get("cargasActuales") as FormArray;
  }

  get arrayCargasNuevas(){
    return this.formViaje.get("cargasNuevas") as FormArray;
  }

  servicioViaje = inject(ServicioViajesService)
  servicioRuta = inject(ServicioRutasService)
  servicioTrenes = inject(ServicioTrenesService)
  router = inject(Router);

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    setTimeout(() => {
      localStorage.setItem('nombrePantalla', 'Lista viajes')
      window.dispatchEvent(new Event('storage'));
    });

    this.cargarToggles();
    this.cargarDatos();
  }

  private cargarToggles() {
      const tooltipElements = this.el.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipElements.forEach((el: HTMLElement) => {
      const tooltip = new bootstrap.Tooltip(el, { container: 'body', trigger: 'hover' });
      this.tooltips.push(tooltip);
    });
  }

  cargarDatos() {
    this.loading = true;

    this.subscripciones.push(
      forkJoin({
        rutas: this.servicioRuta.getRutas(),
        viajes: this.servicioViaje.getViajes(),
        trenes: this.servicioTrenes.getTrenes()
      }).subscribe({
        next: ({ rutas, viajes, trenes }) => {
          this.listaRutas = rutas;
          this.listaViajes = viajes.map(v => ({
            ...v,
            fechaSalida: this.parsearFechas(v.fechaSalida),
            fechaLlegada: this.parsearFechas(v.fechaLlegada),
            fechaCreacion: this.parsearFechas(v.fechaCreacion)
          }));
          this.listaTrenes = trenes;

          this.cargarListado();

          // ⭐ APAGAR LOADING ACÁ
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      })
    );
  }

  cargarListado() {
    const estados = ["en curso", "programado", "finalizado", "cancelado"];
    this.listadoViajes = [];

    this.listaViajes.forEach( viaje => {
      const Ruta = this.listaRutas.find(ruta => ruta.id === viaje.rutaId)?.nombre!
      const Tren = this.listaTrenes.find(tren => tren.tren_id === viaje.trenId)

      var item: DtoListaViaje = {
        id: viaje.id,
        tren: Tren,
        ruta: Ruta.replace(/^Ruta\s*/i, ""),
        usuarioId: viaje.usuarioId,
        fechaSalida: viaje.fechaSalida,
        fechaLlegada: viaje.fechaLlegada,
        carga: viaje.carga,
        estado: viaje.estado,
        fechaCreacion: viaje.fechaCreacion,
        detalleCarga: viaje.cargamentos
      }

      this.listadoViajes.push(item)
    });

    this.listadoViajes.sort((a,b) => 
      estados.indexOf(a.estado) - estados.indexOf(b.estado) || (a.fechaSalida?.getTime() || 0) - (b.fechaSalida?.getTime() || 0)
    )
    this.filtrar()
  }

  private parsearFechas(fecha: any): Date | null {
    if (!fecha) return null;

    if (Array.isArray(fecha)) {
      const [y, m, d, h = 0, min = 0, s = 0] = fecha;
      return new Date(y, m - 1, d, h, min, s);
    }

    return new Date(fecha);
  }

  filtroNombresRuta(nombre: string): string {
    return nombre.replace(/^Ruta\s*/i, "")
  }

  filtrar() {
    this.listaFiltrada = this.listadoViajes;

    if (this.filtroRuta) {
      this.listaFiltrada = this.listaFiltrada.filter(v => v.ruta === this.filtroRuta);
    }

    if (this.filtroTren) {
      this.listaFiltrada = this.listaFiltrada.filter(v =>
        v.tren?.tren_id.toString() === this.filtroTren
      );
    }

    if (this.filtroEstado) {
      this.listaFiltrada = this.listaFiltrada.filter(v =>
        v.estado === this.filtroEstado
      );
    }

  if (this.paginator) {
    this.paginator.firstPage();
  }

    this.actualizarPaginado();
  }

  limpiarFiltro() {
    this.filtroRuta = "";
    this.filtroTren = "";
    this.filtroEstado = "";
    this.filtrar();
  }

  actualizarPaginado() {
    if (!this.paginator) {
      this.paginaActual = this.listaFiltrada.slice(0, this.pageSize);
      return;
    }

    const inicio = this.paginator.pageIndex * this.paginator.pageSize;
    const fin = inicio + this.paginator.pageSize;

    this.paginaActual = this.listaFiltrada.slice(inicio, fin);
  }

  cargarDetallesViaje(viaje: DtoListaViaje) {
    this.detallesViaje = viaje;

    if (this.detallesViaje.estado == "programado") { this.viajeModificable = true }
    else { this.viajeModificable = false }

    this.modificar = false;
    
    this.formViaje.get("fecha")?.setValue(this.formatearFechaSalida(this.detallesViaje.fechaSalida));    
    this.formViaje.get("horarioSalida")?.setValue(this.detallesViaje.fechaSalida ? this.detallesViaje.fechaSalida.toTimeString().slice(0, 5) : '');
    this.formViaje.get("horarioLlegada")?.setValue(this.detallesViaje.fechaLlegada ? this.detallesViaje.fechaLlegada.toTimeString().slice(0, 5) : '');
    this.cargarDuracionViaje();

    this.arrayCargasActuales.clear();
    this.arrayCargasNuevas.clear();
    this.detallesViaje.detalleCarga.forEach( carga => {
      const cargaActual: FormGroup = new FormGroup({
        id: new FormControl(carga.id),
        detalle: new FormControl(carga.detalle,[Validators.required]),
        tipo: new FormControl(carga.tipo,[Validators.required]),
        peso: new FormControl(carga.peso,[Validators.required]),
        estado: new FormControl(carga.estado)
      })

      this.arrayCargasActuales.push(cargaActual);
    });
  }

  cargarDuracionViaje() {
    const [horaS, minutoS] = (this.formViaje.get("horarioSalida")?.value ?? "00:00").split(':').map(Number);
    const [horaL, minutoL] = (this.formViaje.get("horarioLlegada")?.value ?? "00:00").split(':').map(Number);

    let tiempoSalida = horaS * 60 + minutoS;
    let tiempoLlegada = horaL * 60 + minutoL;

    if (tiempoSalida > tiempoLlegada) { tiempoLlegada += 60 * 24; }

    this.duracionViaje = tiempoLlegada - tiempoSalida;
  }

  private formatearFechaSalida(date: any): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  habilitarModificacion() {
    this.modificar = !this.modificar;
  }

  cambiarEstadoCarga(index: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.arrayCargasActuales.at(index).get('estado')!.setValue( checked ? 'activo' : 'inactivo' );
  }

  agregarCargaNueva() {
    const nuevaCarga: FormGroup = new FormGroup({
      detalle: new FormControl('',[Validators.required]),
      tipo: new FormControl('',[Validators.required]),
      peso: new FormControl(0,[Validators.required]),
      estado: new FormControl("activo")
    })

    this.arrayCargasNuevas.push(nuevaCarga);
  }

  eliminarCargaNueva(index: number) {
    this.arrayCargasNuevas.removeAt(index);
  }

  modificarHorario() {
    const [horaS, minutoS] = (this.formViaje.get("horarioSalida")?.value ?? "00:00").split(':').map(Number);

    const minutosSalida = horaS * 60 + minutoS; 
    let minutosLlegada = minutosSalida + this.duracionViaje;

    minutosLlegada = minutosLlegada % 1440

    this.formViaje.get("horarioLlegada")?.
    setValue(Math.floor(minutosLlegada / 60).toString().padStart(2, '0')+":"+(minutosLlegada % 60).toString().padStart(2, '0'))
  }

  submit() {
    if (this.formViaje.valid){
      this.actualizarFechas();
  
      const form = this.formViaje.value;
      let listaCargamentos: DtoPutCargamento[] = [];
      let cargaTotal: number = 0;
      
      this.arrayCargasActuales.controls.forEach(carga => {
        const cargamento: DtoPutCargamento = {
          id: carga.get("id")?.value!,
          detalle: carga.get("detalle")?.value!,
          tipo: carga.get("tipo")?.value!,
          peso: carga.get("peso")?.value!,
          estado: carga.get("estado")?.value!,
        }
        listaCargamentos.push(cargamento);
        cargaTotal += carga.get("peso")?.value!
      });
      
      this.arrayCargasNuevas.controls.forEach(carga => {
        const cargamento: DtoPutCargamento = {
          id: 0,
          detalle: carga.get("detalle")?.value!,
          tipo: carga.get("tipo")?.value!,
          peso: carga.get("peso")?.value!,
          estado: carga.get("estado")?.value!,
        }
        listaCargamentos.push(cargamento);
        cargaTotal += carga.get("peso")?.value!
      })
      
      let dtoViaje: DtoPutViaje = {
        viajeId: this.detallesViaje.id,
        fechaSalida: this.fechaSalidaActualizada,
        fechaLlegada: this.fehcaLlegadaActualizada,
        carga: cargaTotal,
        listaCargamento: listaCargamentos ?? []
      }
      
      const sub = this.servicioViaje.putViaje(dtoViaje).subscribe(() => {
        Swal.fire('Listo', 'Se ha modificado exitosamente el viaje', 'success');
        console.log(dtoViaje);
        this.cerrarModal();
        this.filtroRuta = "";
        this.filtroTren = "";
        this.filtroEstado = "";
        this.cargarDatos();
      })

    }
  }

  actualizarFechas() {
    const fecha = this.formViaje.get("fecha")?.value;
    const horaSalida = this.formViaje.get("horarioSalida")?.value!;
    
    this.fechaSalidaActualizada = `${fecha}T${horaSalida}:00`;

    const [h, m] = horaSalida.split(":").map(Number);
    let minutosTotales = h * 60 + m + this.duracionViaje;

    const diaExtra = Math.floor(minutosTotales / 1440);
    minutosTotales = minutosTotales % 1440;

    const horaL = Math.floor(minutosTotales / 60).toString().padStart(2, "0");
    const minL = (minutosTotales % 60).toString().padStart(2, "0");

    let fechaLlegada = fecha;

    if (diaExtra > 0) {
      const f = new Date(`${fecha}T00:00:00`);
      f.setDate(f.getDate() + diaExtra);
      fechaLlegada = f.toISOString().substring(0, 10);
    }

    this.fehcaLlegadaActualizada = `${fechaLlegada}T${horaL}:${minL}:00`;
  }

  cerrarModal(){
     const modalElement = document.getElementById('ModalDetalleViaje');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
  }
  
  cancelarViaje(id: number) {
    const sub = this.servicioViaje.deleteViaje(id).subscribe(() =>{
      Swal.fire('Listo', 'Se ha cancelado exitosamente el viaje', 'success');

      this.cargarDatos()
    })
  }

  irMenuViajes() {
    this.router.navigate(["menu/viajes"]);
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
