import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { concatMap, delay, from } from 'rxjs';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent implements OnInit{  
  private mapa: any;
  private icono: L.Marker<any> | undefined;
  private apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjFiMjRhOGY1MzcxODRmYTY5M2FlZGNjZTk1Zjg3NTAwIiwiaCI6Im11cm11cjY0In0=";

  private http = inject(HttpClient);
  router = inject(Router);



  ngOnInit(): void {
    this.fixLeafletIconPaths();
    this.iniciarMapa();
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
  }

  private iniciarMapa(){

    this.mapa = L.map('map', {minZoom: 7, maxZoom: 10, maxBounds: [
    [-36, -67], // suroeste
    [-29, -61]  // noreste
    ],
    maxBoundsViscosity: 1.0}).setView([-31.4167, -64.1833], 7);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.mapa);


    // Marcador en el centro de Córdoba (Plaza San Martín)
    L.marker([-31.419429, -64.188938]).addTo(this.mapa)
    .bindPopup('Centro de Córdoba')
    .openPopup();

    L.marker([-31.420083, -64.499394]).addTo(this.mapa)
    .bindPopup('Villa Carlos Paz')
    .openPopup();

    L.marker([-32.407500, -63.240833]).addTo(this.mapa)
    .bindPopup('Villa María')
    .openPopup();

    L.marker([-33.130684, -64.349869]).addTo(this.mapa)
    .bindPopup('Río Cuarto')
    .openPopup();

    L.marker([-31.427960, -62.082308]).addTo(this.mapa)
    .bindPopup('San Francisco')
    .openPopup();

    L.marker([-30.420956, -64.350349]).addTo(this.mapa)
    .bindPopup('Deán Funes')
    .openPopup();

    // Otro punto dentro de la ciudad (Nueva Córdoba)
    // L.marker([-31.429475, -64.181796]).addTo(this.mapa)
    // .bindPopup('Otro punto en Córdoba (Nueva Córdoba)')
    // .openPopup();
  }

  private fixLeafletIconPaths() {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/assets/leaflet/marker-icon-2x.png',
      iconUrl: '/assets/leaflet/marker-icon.png',
      shadowUrl: '/assets/leaflet/marker-shadow.png',
    });
  }

  private delayCall(start: [number, number], end: [number, number], ms: number) {
  return from([null]).pipe(
    delay(ms),
    concatMap(() => {
      this.calcularRuta(start, end);
      return from([true]); // devolver algo para que concatMap funcione
    })
  );
}

  calcularRuta(start: [number, number], end: [number, number]): void {
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

    const headers = new HttpHeaders({
      'Authorization': this.apiKey,
      'Content-Type': 'application/json'
    });

    const body = {
      coordinates: [start, end],
    };

    this.http.post<any>(url, body, { headers }).subscribe({
      next: (response) => {
        console.log('Ruta ORS:', response);
        this.dibujarRuta(response);
      },
      error: (err) => {
        console.error('Error al obtener ruta:', err);
      }
    });
  }

  dibujarRuta(geojson: any): void {
  const ruta = L.geoJSON(geojson, {
    style: {
      color: 'green',
      weight: 4
    }
  }).addTo(this.mapa);

  this.mapa.fitBounds(ruta.getBounds());
  }
  
  irPostMapa(){
    this.router.navigate(["menu/viajes/post"]);
  }

  irListaViajes(){
    this.router.navigate(["menu/viajes/lista"]);
  }

}
