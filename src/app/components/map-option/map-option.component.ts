// Inside your component class (map-option.component.ts)
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { NotificationService } from 'src/app/services/notification.service';
import { FileResponse } from 'src/app/services/file.service'

@Component({
  selector: 'app-map-option',
  templateUrl: './map-option.html',
  styleUrls: ['./map-option.css']
})
export class MapOptionComponent {
  @Output() optionClicked = new EventEmitter<{ option: string, name: string }>();
  upload_files: { name: string, selected: boolean }[] = [];
  selectAllCheckbox: boolean = false; // Property to bind to the checkbox in the thead
  selectAll = false;
  files: FileResponse[] = [];

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
      // Log the entire response for debugging
      console.log('Response:', response);
  
      // Check if the response is an array
      if (Array.isArray(response)) {
        // Assign the response directly to files
        this.files = response;
  
        // If you want to display the file details on the frontend
        // Update the files array to include the vehicle type and inserted time
        // For example:
        this.files.forEach(file => {
          file.inserted_date = new Date(file.inserted_date).toLocaleString(); // Convert inserted_date to a formatted string
        });
      } else {
        console.error('Invalid response format. Expected an array.');
        // Handle the error or set files to an empty array
        this.files = [];
      }
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
        this.notificationService.showSuccessByKey('fileLoadedSuccess');
        this.fileService.notifyFilesUpdated();
        this.loadUploadFiles();
      },
      error => {
        this.notificationService.showErrorByKey('errorConvertingFiles');

      }
    );

  }
}
