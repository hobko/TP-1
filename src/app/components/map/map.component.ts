// map.component.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, MapStyle, config, GeoJSONSource, LngLatBoundsLike, NavigationControl } from '@maptiler/sdk';
import toGeoJSON from 'togeojson';
import * as xml2js from 'xml-js';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrls: ['./map.css']
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
    // Load the original GPX file
    this.fileService.getGpxFile(fileName).subscribe(
      (originalRouteData) => {
        // Load the matched GPX file
        const matchedFileName = fileName.replace('.gpx', '_matched.gpx');
        this.fileService.getGpxMatchedFile(matchedFileName).subscribe(
          (matchedRouteData) => {
            // Display the original route
            this.displayRoute(originalRouteData, 'original-route-layer', '#FF0000');

            // Display the matched route
            this.displayRoute(matchedRouteData, 'matched-route-layer', '#007BFF');
          },
          (error) => {
            console.error('Error loading matched GeoJSON data:', error);
          }
        );
      },
      (error) => {
        console.error('Error loading original GeoJSON data:', error);
      }
    );
  }

  displayRoute(routeData: any, layerId: string, lineColor: string): void {
    // Ensure the map is initialized
    if (!this.map) {
      console.error('Map not initialized');
      return;
    }

    const sourceId = `${layerId}-source`;

    if (!this.map.getSource(sourceId)) {
      this.map.addSource(sourceId, {
        type: 'geojson',
        data: routeData
      });
    } else {
      const source = this.map.getSource(sourceId) as GeoJSONSource;
      source.setData(routeData);
    }

    if (!this.map.getLayer(layerId)) {
      this.map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': lineColor,
          'line-width': 2
        }
      });
    }

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