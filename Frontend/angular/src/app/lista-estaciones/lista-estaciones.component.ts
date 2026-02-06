import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ServicioMapaService } from '../../services/servicio-mapa.service';
import { firstValueFrom, forkJoin, Observable, Subscription } from 'rxjs';
import { Estacion } from '../../models/Entity/estacion';
import { ServicioEstacionService } from '../../services/servicio-estacion.service';
import { CommonModule } from '@angular/common';
import { Ciudad } from '../../models/Entity/ciudad';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { DtoPostEstacion, DtoPutEstacion } from '../../models/Dto/dto-estacion';
import { Ruta } from '../../models/Entity/ruta';
import { ServicioRutasService } from '../../services/servicio-rutas.service';
import { DtoDeleteRuta, DtoPutRuta } from '../../models/Dto/dto-ruta';
import { ServicioViajesService } from '../../services/servicio-viajes.service';
declare var bootstrap: any;
import Swal from 'sweetalert2';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-lista-estaciones',
  standalone: true,
  imports: [CommonModule, ɵInternalFormsSharedModule, ReactiveFormsModule, FormsModule, MatPaginatorModule],
  templateUrl: './lista-estaciones.component.html',
  styleUrl: './lista-estaciones.component.css'
})
export class ListaEstacionesComponent implements OnInit, OnDestroy{

  private mapa: any;
  private marcador: any;
  
  private subscripciones: Subscription[] = [];

  private tooltips: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator

  listaCiudades: Ciudad[] = [];
  listaEstaciones: Estacion[] = [];
  listaRutas: Ruta[] = [];
  listaFiltrada: Estacion[] = [];
  paginaActual: Estacion[] = [];
  pageSize = 10;

  modalEstacion: DtoPutEstacion = { id: 0, nombre: "", estado: true };
  nuevaEstacion = new FormGroup({
    nombre: new FormControl('',[Validators.required, Validators.minLength(7), Validators.maxLength(30)]),
    ciudad: new FormControl(0,[Validators.required])
  })
  
  filtroEstado: string = "";
  filtroNombre: string = "";

  servicioMapa = inject(ServicioMapaService)
  servicioEstacion = inject(ServicioEstacionService)
  servicioRuta = inject(ServicioRutasService)
  servicioViaje = inject(ServicioViajesService)

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    setTimeout(() => { 
      this.mapa = this.servicioMapa.iniciarMapa(); 
      localStorage.setItem('nombrePantalla', 'Estaciones')
      window.dispatchEvent(new Event('storage'));
    });

    this.cargarToggles();
    this.cargarDatos();
  }
  
  private cargarToggles() {
    const tooltipElements = this.el.nativeElement.querySelectorAll('[data-bs-title]');
  
    tooltipElements.forEach((el: HTMLElement) => {
      const tooltip = new bootstrap.Tooltip(el, {
        container: 'body', trigger: 'hover', fallbackPlacements: []    
      });

      this.tooltips.push(tooltip);
    });
  }

  cargarDatos(){
    this.subscripciones.push(
      forkJoin({
        rutas: this.servicioRuta.getRutas(),
        estaciones: this.servicioEstacion.getEstaciones(),
        ciudades: this.servicioEstacion.getCiudades()
      }).subscribe(({rutas, estaciones, ciudades}) => {
        this.listaRutas = rutas;
        this.listaCiudades = ciudades;
        this.listaEstaciones = estaciones;
        this.listaFiltrada = this.listaEstaciones.filter(estacion => estacion.bajaLogica === false);
        this.filtrarCiudadesDisponibles();
        this.filtrarDatos();
      }))

  }

  filtrarCiudadesDisponibles() {
    this.listaCiudades = this.listaCiudades.filter(ciudad =>{
      const estacionActiva = this.listaEstaciones.find(estacion => estacion.ciudad.id === ciudad.id 
        && estacion.bajaLogica === false);

      return !estacionActiva;
    });
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

  nombrarEstado(): string{
    return this.modalEstacion.estado ? "Activa" : "Inactiva"
  }

  filtrarDatos() {
    this.mapa = this.servicioMapa.limpiarIconos();
    this.listaFiltrada = this.listaEstaciones.filter(estacion => estacion.bajaLogica === false);

    if(this.filtroNombre && this.filtroNombre.length >= 3) {
      this.listaFiltrada = this.listaFiltrada.filter( estacion => {
        return estacion.nombre.toUpperCase().includes(this.filtroNombre.toUpperCase())
      })
    }

    if (this.filtroEstado !== null && this.filtroEstado !== ""){
      const valor = this.filtroEstado === "true";
      this.listaFiltrada = this.listaFiltrada.filter( estacion => {
        return estacion.estado == valor; 
      });
    }

    this.paginator.firstPage()
    this.actualizarPaginado()
    this.cargarIconosEstacion();
  }

  limpiarFiltros() {
    this.filtroNombre = "";
    this.filtroEstado = "";
    this.filtrarDatos(); 
  }

  actualizarPaginado() {
    if (!this.paginator) {
      this.paginaActual = this.listaFiltrada.slice(0, this.pageSize);
      return;
    }

    const inicio = this.paginator.pageIndex * this.paginator.pageSize;
    const fin = inicio + this.paginator.pageSize;

    this.paginaActual = this.listaFiltrada.slice(inicio, fin);
    console.log("Estaciones: " + this.paginaActual.length)
  }

  crearEstacion(){
    if (this.nuevaEstacion.valid) { 
      const form = this.nuevaEstacion.value ;
    
      const estacion: DtoPostEstacion = {
        nombre: form.nombre!,
        ciudad: form.ciudad!
      }

      console.log("Datos correctos: " + estacion.nombre + ", " + estacion.ciudad)

      const sub = this.servicioEstacion.postEstacion(estacion).subscribe(() =>{
        this.mapa = this.servicioMapa.limpiarIconos();
        this.filtroNombre = "";
        this.filtroEstado = "";
        Swal.fire('Listo', 'Se ha creado la nueva estación', 'success');
        this.cerrarModal('ModalPostEstacion')
        this.cargarDatos();
      })
  
      this.subscripciones.push(sub);
    } else { console.log("falta completar") }
  }

  modificarEstacion(){
    if (this.modalEstacion.nombre && this.modalEstacion.nombre?.trim().length >= 7) {
      const sub = this.servicioEstacion.putEstacion(this.modalEstacion).subscribe(() =>{
        this.mapa = this.servicioMapa.limpiarIconos();
        this.filtroNombre = "";
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
      Swal.fire('Listo', 'Se ha modificado exitosamente la estación', 'success');
      this.cargarDatos();
    })

    this.subscripciones.push(sub);
  }

  async eliminarEstacion() {
    // Se buscan las rutas relacionadas a la estacion
    const idRutas = this.listaRutas.filter(ruta => ruta.estacionOrigen === this.modalEstacion.id 
    || ruta.estacionDestino === this.modalEstacion.id).map(r => r.id)

    var dtoRutas: DtoDeleteRuta = {rutasId: idRutas, estado: true }
    var dtoRollback: DtoDeleteRuta = {rutasId: idRutas, estado: false }

    try {

      // Si existen rutas consultar si existen viajes programados o en curso
      if ( idRutas.length > 0) {

        // Si existen viajes relacionados a la estacion cancelar la eliminacion
        const viajesExistentes = await firstValueFrom(this.servicioViaje.getViajesExistentes(idRutas))
        if (viajesExistentes) {
          Swal.fire('Error', 'Esta estacion tiene viajes programados o en curso. No se puede eliminar', 'error');
          return;
        }

        // "Eliminar" rutas relacionadas a la estacion
        await firstValueFrom(this.servicioRuta.deleteRutas(dtoRutas));
      } 

      // Se elimina la estacion y se vuelve a cargar la pagina con las estaciones actualizadas
      await firstValueFrom(this.servicioEstacion.deleteEstacion(this.modalEstacion.id));
      Swal.fire('Listo', 'Se ha borrado exitosamente la estación', 'success');
     
      this.cerrarModal('ModalDeleteEstacion');
      this.mapa = this.servicioMapa.limpiarIconos();
      this.filtroNombre = "";
      this.filtroEstado = "";      
      this.cargarDatos();
    } 
    catch (error) {
      if (idRutas.length > 0) {
        await firstValueFrom(this.servicioRuta.deleteRutas(dtoRollback));
      }
      Swal.fire('Error', 'No se pudo borrar la estacion', 'error');
      console.log(error)
    }
  }

  cerrarModal(nombre: string){
    const modalElement = document.getElementById(nombre);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }

  }

  ngOnDestroy(): void {
    this.subscripciones.forEach(sub => sub.unsubscribe());
    this.mapa = this.servicioMapa.eliminarMapa(this.mapa);

    this.tooltips.forEach(t => t.dispose());
    this.tooltips = [];
  }
}
