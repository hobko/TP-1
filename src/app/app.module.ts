import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ExampleComponent } from './components/example/example.component';
import {RouterOutlet} from "@angular/router";
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { HelloComponent } from './components/hello/hello.component';
import { FileUploadModule } from 'ng2-file-upload';
import { MapComponent } from './components/map/map.component';
import { MapOptionComponent } from './components/map-option/map-option.component';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    ExampleComponent,
    HeaderComponent,
    FooterComponent,
    HelloComponent,
    MapComponent,
    MapOptionComponent,
    

  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    HttpClientModule,
    FileUploadModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
