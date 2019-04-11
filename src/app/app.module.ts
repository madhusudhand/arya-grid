import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AryaGridModule } from '../../projects/arya-grid/src/public_api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AryaGridModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
