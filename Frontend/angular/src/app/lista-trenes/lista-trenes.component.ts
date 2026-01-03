import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tren } from '../../models/Entity/tren';
import { ServicioTrenesService } from '../../services/servicio-trenes.service';
import { forkJoin, Subscription } from 'rxjs';
declare var bootstrap: any;

@Component({
  selector: 'app-lista-trenes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './lista-trenes.component.html',
  styleUrl: './lista-trenes.component.css'
})
export class ListaTrenesComponent implements OnInit, OnDestroy{

  private subscripciones: Subscription[] = [];
  
  private tooltips: any[] = [];

  listaTrenes: Tren[] = [];
  listaFiltrada: Tren[] = [];

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
  }

  limpiarFiltro() {
    this.filtroCodigo = "";
    this.filtroModelo = "";
    this.filtroEstado = "";
    this.filtrar()
  }

  submit() {

  }

  ngOnDestroy(): void {
    this.subscripciones.forEach(sub => sub.unsubscribe());

    this.tooltips.forEach(t => t.dispose());
    this.tooltips = [];
  }
}
