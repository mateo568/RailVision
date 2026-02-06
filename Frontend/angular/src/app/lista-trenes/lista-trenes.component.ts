import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tren } from '../../models/Entity/tren';
import { ServicioTrenesService } from '../../services/servicio-trenes.service';
import { forkJoin, Subscription } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-lista-trenes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatPaginatorModule],
  templateUrl: './lista-trenes.component.html',
  styleUrl: './lista-trenes.component.css'
})
export class ListaTrenesComponent implements OnInit, OnDestroy{

  private subscripciones: Subscription[] = [];
  
  private tooltips: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator

  listaTrenes: Tren[] = [];
  listaFiltrada: Tren[] = [];
  paginaActual: Tren[] = [];
  pageSize = 10;

  filtroCodigo: string = "";
  filtroModelo: string = "";
  filtroEstado: string = "";

  private servicioTren = inject(ServicioTrenesService);

  nuevoTren = new FormGroup({
      modelo: new FormControl('',[Validators.required]),
      capacidad: new FormControl(0,[Validators.required]),
      //cantVagones: new FormControl('',[Validators.required]),
  })

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.cargarToggles();
    this.cargarDatos(); 

    setTimeout(() => {
      localStorage.setItem('nombrePantalla', 'Trenes')
      window.dispatchEvent(new Event('storage'));
    });
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

  cargarDatos() {
    this.subscripciones.push(
      forkJoin({
        trenes: this.servicioTren.getTrenes()
      }).subscribe(({trenes}) =>{
        this.listaTrenes = trenes;
        this.filtrar()
      })
    )
  }

  filtrar() {
    this.listaFiltrada = this.listaTrenes;
    console.log(this.filtroCodigo)

    if (this.filtroCodigo && this.filtroCodigo.length >= 3){
      this.listaFiltrada = this.listaFiltrada.filter( tren => {
        return tren.codigo.toUpperCase().includes(this.filtroCodigo.toUpperCase());
      })
    }

    if (this.filtroModelo && this.filtroModelo.length >= 3) {
      this.listaFiltrada = this.listaFiltrada.filter( tren => {
        return tren.modelo.toUpperCase().includes(this.filtroModelo.toUpperCase());
      })
    }

    if(this.filtroEstado) {
      this.listaFiltrada = this.listaFiltrada.filter( tren => {
        return tren.estado === this.filtroEstado;
      })
    }

    this.paginator.firstPage()
    this.actualizarPaginado()
  }

  limpiarFiltro() {
    this.filtroCodigo = "";
    this.filtroModelo = "";
    this.filtroEstado = "";
    this.filtrar()
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

  submit() {
    if (this.nuevoTren.invalid) return;

    const tren = {
      codigo: `TREN-${Date.now()}`,
      modelo: this.nuevoTren.value.modelo!,
      capacidad_toneladas: this.nuevoTren.value.capacidad!,
      estado: 'activo'
    };

    this.servicioTren.addTren(tren).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Tren creado',
          text: 'El tren fue registrado correctamente',
          timer: 1500,
          showConfirmButton: false
        });

        this.cargarDatos();     // refresca la tabla
        this.nuevoTren.reset();
      },
      error: (err: any) => {
        Swal.fire('Error', 'No se pudo crear el tren', 'error');
        console.error(err);
      }
    });
  }

  ponerEnMantenimiento(trenId: number) {
    this.servicioTren.updateEstadoTren(trenId, 'mantenimiento')
      .subscribe({
        next: () => {
          Swal.fire('Actualizado', 'Tren en mantenimiento', 'success');
          this.cargarDatos();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
        }
      });
  }

  activarTren(trenId: number) {
    this.servicioTren.updateEstadoTren(trenId, 'activo')
      .subscribe({
        next: () => {
          Swal.fire('Actualizado', 'Tren activado', 'success');
          this.cargarDatos();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
        }
      });
  }

  ngOnDestroy(): void {
    this.subscripciones.forEach(sub => sub.unsubscribe());

    this.tooltips.forEach(t => t.dispose());
    this.tooltips = [];
  }
}
