import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tren } from '../../models/Entity/tren';
import { ServicioTrenesService } from '../../services/servicio-trenes.service';
import { forkJoin, Subscription } from 'rxjs';
declare var bootstrap: any;

@Component({
  selector: 'app-lista-trenes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-trenes.component.html',
  styleUrl: './lista-trenes.component.css'
})
export class ListaTrenesComponent implements OnInit, OnDestroy{

  private subscripciones: Subscription[] = [];
  
  private tooltips: any[] = [];

  listaTrenes: Tren[] = [];

  private servicioTren = inject(ServicioTrenesService);

  nuevoTren = new FormGroup({
      tipo: new FormControl('',[Validators.required]),
      capacidad: new FormControl(0,[Validators.required]),
      //cantVagones: new FormControl('',[Validators.required]),
  })

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
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

  cargarDatos() {
    this.subscripciones.push(
      forkJoin({
        trenes: this.servicioTren.getTrenes()
      }).subscribe(({trenes}) =>{
        this.listaTrenes = trenes;
      })
    )
  }

  ngOnDestroy(): void {
    this.subscripciones.forEach(sub => sub.unsubscribe());

    this.tooltips.forEach(t => t.dispose());
    this.tooltips = [];
  }
}
