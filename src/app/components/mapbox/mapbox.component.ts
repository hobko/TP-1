import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, NavigationControl, Marker } from 'maplibre-gl';
import { DataService } from '../../services/data.service'; // Import your DataService

@Component({
  selector: 'app-map',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.css']
})
export class MapboxComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  constructor(private dataService: DataService) { } // Inject DataService here

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const initialState = { lng: 17.068841044330043, lat: 48.15767725453514, zoom: 12 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=5BSfbOYMOHwlRta9S3OC`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    this.map.addControl(new NavigationControl(), 'top-right');

    // Fetch data from the DataService
    this.dataService.getData().subscribe(data => {
      // Loop through the data and add markers
      data.forEach(item => {
        console.log(data);
        new Marker({ color: "#FF0000" })

          .setLngLat([item.FIELD3, item.FIELD2])
          .addTo(<Map>this.map ?? undefined);
      });
    });
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
