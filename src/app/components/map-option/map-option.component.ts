import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { NotificationService } from 'src/app/services/notification.service';


@Component({
  selector: 'app-map-option',
  templateUrl: './map-option.component.html',
  styleUrls: ['./map-option.component.css']
})
export class MapOptionComponent {
  @Output() optionClicked = new EventEmitter<{ option: string, name: string }>();
  files: string[] = [];

  constructor(private fileService: FileService,
              private notificationService: NotificationService,) {}

  ngOnInit(): void {
    this.loadFiles();
    this.fileService.filesUpdated$.subscribe(() => {
      this.loadFiles();
    });
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
  onDeleteClick(event: MouseEvent, file: string): void {
    event.stopPropagation(); // Prevent the click event from bubbling up to the parent li element
    this.fileService.deleteDataFromStorage(file);
    this.loadFiles();
  }

  onDownloadClick(event: MouseEvent, file: string): void {
    event.stopPropagation(); // Prevent the click event from bubbling up to the parent li element
    this.fileService.downloadGpxZipFile(file);
  }

}
