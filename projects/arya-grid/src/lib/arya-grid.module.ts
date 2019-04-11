import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AryaGridComponent } from './arya-grid.component';
import { AryaGridRowComponent } from './grid-row/arya-grid-row.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AryaGridComponent,
    AryaGridRowComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    AryaGridComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class AryaGridModule { }
