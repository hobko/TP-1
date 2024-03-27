// Inside your component class (map-option.component.ts)
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-map-option',
  templateUrl: './map-option.html',
  styleUrls: ['./map-option.css']
})
export class MapOptionComponent {
  @Output() optionClicked = new EventEmitter<{ option: string, name: string }>();
  files: string[] = [];
  upload_files: { name: string, selected: boolean }[] = [];
  selectAllCheckbox: boolean = false; // Property to bind to the checkbox in the thead
  selectAll = false;

  constructor(private fileService: FileService,
              private notificationService: NotificationService,) {}

  ngOnInit(): void {
    this.loadFiles();
    this.loadUploadFiles();
    this.fileService.filesUpdated$.subscribe(() => {
      this.loadFiles();
    });
  }

  loadUploadFiles(): void {
    this.fileService.getUploadsFiles().subscribe(response => {
      if (response && response.files) {
        this.upload_files = response.files.map(file => ({ name: file, selected: false }));
      } else {
        this.upload_files = []; 
      }
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

  toggleSelectAll(): void {
    // Set the selected property of each upload_file object based on the value of selectAllCheckbox
    this.upload_files.forEach(file => file.selected = this.selectAllCheckbox);
  }

  deleteSelectedFiles(): void {
    const selectedFiles = this.upload_files.filter(file => file.selected).map(file => file.name);
    this.fileService.deleteFilesFromUploads(selectedFiles).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.error('Error:', error); 
      }
    );
  }

  convertSelectedFiles(): void{
    const selectedFiles = this.upload_files.filter(file => file.selected).map(file => file.name);
    this.fileService.convertFilesFromUploads(selectedFiles).subscribe(
      response => {
        this.notificationService.showSuccess("Súbory sa nahrali úspešne","Hotovo");
        this.fileService.notifyFilesUpdated();
        this.loadUploadFiles();
      },
      error => {
        this.notificationService.showError("Nastala chyba","Chyba");

      }
    );

  }
}
