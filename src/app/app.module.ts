import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ExampleComponent } from './components/example/example.component';
import {RouterOutlet} from "@angular/router";

@NgModule({
  declarations: [
    AppComponent,
    ExampleComponent
  ],
  imports: [
    BrowserModule,
    RouterOutlet
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
