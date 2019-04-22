import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AryaGridComponent } from './arya-grid.component';
import { AryaGridRowComponent } from './grid-row/arya-grid-row.component';
import { AryaVirtualScrollComponent } from './arya-virtual-scroll.component';

@NgModule({
  declarations: [
    AryaGridComponent,
    AryaGridRowComponent,
    AryaVirtualScrollComponent,
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
