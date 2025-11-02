import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import L, { marker } from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class ServicioMapaService {

  private mapa: any;
  private apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjFiMjRhOGY1MzcxODRmYTY5M2FlZGNjZTk1Zjg3NTAwIiwiaCI6Im11cm11cjY0In0=";

  private redIcon = new L.Icon({
    iconUrl: '/assets/leaflet/marker-icon-red.png',
    iconRetinaUrl: '/assets/leaflet/marker-icon-2x-red.png',
    shadowUrl: '/assets/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  constructor(private client: HttpClient) { }

  iniciarMapa(){
    this.mapa = L.map('map', {minZoom: 7, maxZoom: 10, 
      maxBounds: [ [-36, -67], [-29, -61] ], maxBoundsViscosity: 1.0}).setView([-31.4167, -64.1833], 7);
    
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.mapa);

    this.fixLeafletIconPaths();

    return this.mapa;
  }

  private fixLeafletIconPaths() {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/assets/leaflet/marker-icon-2x.png',
      iconUrl: '/assets/leaflet/marker-icon.png',
      shadowUrl: '/assets/leaflet/marker-shadow.png',
    });
  }

  cargarIcono(latitud: string, longitud: string, nombreEstacion: string){

    const latitudEstacion = Number(latitud);
    const longitudEstacion = Number(longitud);

    const marker = L.marker([latitudEstacion, longitudEstacion]).bindPopup(nombreEstacion)

    return marker;
  }

  cargarIconoEstado(latitud: string, longitud: string, nombreEstacion: string, estado: boolean) {
    
    const latitudEstacion = Number(latitud);
    const longitudEstacion = Number(longitud);

    const icono: L.MarkerOptions = {}; 
    if (!estado) { icono.icon = this.redIcon }

    return L.marker([latitudEstacion, longitudEstacion], icono ).bindPopup(nombreEstacion);
  }

  limpiarIconos(){
    this.mapa.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        this.mapa.removeLayer(layer);
      }
    });

    return this.mapa;
  }

  calcularRuta(start: [number, number], end: [number, number], mapa: L.Map): void {
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

    const headers = new HttpHeaders({
      'Authorization': this.apiKey,
      'Content-Type': 'application/json'
    });

    const body = {
      coordinates: [start, end],
    };

    this.client.post<any>(url, body, { headers }).subscribe({
      next: (response) => {
        console.log('Ruta ORS:', response);
        this.dibujarRuta(response, mapa);
      },
      error: (err) => {
        console.error('Error al obtener ruta:', err);
      }
    });
  }

  private dibujarRuta(geojson: any, mapa: L.Map): void {
    const ruta = L.geoJSON(geojson, {
      style: {
        color: 'green',
        weight: 4
      }
    }).addTo(mapa);

    mapa.fitBounds(ruta.getBounds());
  }
}
