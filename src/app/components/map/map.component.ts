// map.component.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, MapStyle, config, GeoJSONSource, LngLatBoundsLike } from '@maptiler/sdk';
import toGeoJSON from 'togeojson';
import * as xml2js from 'xml-js';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;
  selectedFile: string | null = null;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    config.apiKey = '5BSfbOYMOHwlRta9S3OC';
  }

  ngAfterViewInit() {
    const initialState = { lng: 17.06326932017216, lat: 48.15877371830401, zoom: 14 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  handleOptionClick(optionAndName: { option: string, name: string }): void {
    this.selectedFile = optionAndName.option;

    // Load and display the selected file's route onto the map
    this.loadRouteFromFile(this.selectedFile);
  }

  loadRouteFromFile(fileName: string): void {
    this.fileService.getGeoJsonFile(fileName).subscribe(
      (geoJsonData) => {
        // Display the route
        this.displayRoute(geoJsonData);
      },
      (error) => {
        console.error('Error loading GeoJSON data:', error);
      }
    );
  }

  displayRoute(routeData: any): void {
    // Ensure the map is initialized
    if (!this.map) {
      console.error('Map not initialized');
      return;
    }
    console.log('Route Data:', routeData); // Log routeData

    const sourceId = 'route-source';

    // Add or update the GeoJSON source
    if (!this.map.getSource(sourceId)) {
      this.map.addSource(sourceId, {
        type: 'geojson',
        data: routeData
      });
    } else {
      const source = this.map.getSource(sourceId) as GeoJSONSource;
      source.setData(routeData);
    }

    // Add or update the line layer
    if (!this.map.getLayer('route-layer')) {
      this.map.addLayer({
        id: 'route-layer',
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#007BFF',
          'line-width': 2
        }
      });
    }

    // Optionally, zoom to fit the route
    const bounds = this.calculateBounds(routeData);
    this.map.fitBounds(bounds, { padding: 20 });
  }

  private calculateBounds(routeData: any): LngLatBoundsLike {
    const coordinates = routeData.features.reduce(
      (acc: number[][], feature: any) => acc.concat(feature.geometry.coordinates),
      []
    );

    if (coordinates.length === 0) {
      console.error('GeoJSON data does not contain any coordinates.');
      return [[0, 0], [0, 0]]; // Provide a default empty bounds
    }

    return [
      [Math.min(...coordinates.map((coord) => coord[0])), Math.min(...coordinates.map((coord) => coord[1]))],
      [Math.max(...coordinates.map((coord) => coord[0])), Math.max(...coordinates.map((coord) => coord[1]))]
    ];
  }
}