import { TestBed } from '@angular/core/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr'; // Importujeme ToastrModule pre injektovanie ToastrService
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let toastrService: ToastrService; // Deklarujeme premennú toastrService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot()] // Importujeme ToastrModule pre injektovanie ToastrService
    });
    service = TestBed.inject(NotificationService);
    toastrService = TestBed.inject(ToastrService); // Injektujeme ToastrService
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show success message', () => {
    spyOn(toastrService, 'success'); // Spýtať sa ToastrService na volanie metódy success
    service.showSuccessByKey('operationCompleted'); // Volanie metódy NotificationService
    expect(toastrService.success).toHaveBeenCalled(); // Overenie, či bola volaná metóda success
  });

  it('should show error message', () => {
    spyOn(toastrService, 'error');
    service.showErrorByKey('serverError');
    expect(toastrService.error).toHaveBeenCalled();
  });

  it('should show info message', () => {
    spyOn(toastrService, 'info');
    service.showInfoByKey('welcomeMessage');
    expect(toastrService.info).toHaveBeenCalled();
  });

  it('should show warning message', () => {
    spyOn(toastrService, 'warning');
    service.showWarningByKey('unsavedChanges');
    expect(toastrService.warning).toHaveBeenCalled();
  });
});
