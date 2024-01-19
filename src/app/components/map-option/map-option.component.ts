import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';


@Component({
  selector: 'app-map-option',
  templateUrl: './map-option.component.html',
  styleUrls: ['./map-option.component.css']
})
export class MapOptionComponent {
  @Output() optionClicked = new EventEmitter<{ option: string, name: string }>();
  files: string[] = [];

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    this.fileService.getFiles().subscribe(response => {
      this.files = response.files;
    });
  }

  onOptionClick(option: string): void {
    console.log('Clicked on option:', option);
    const name = option.split(' - ')[0]; // Extracting the name from the option
    this.optionClicked.emit({ option, name });
  }

}
