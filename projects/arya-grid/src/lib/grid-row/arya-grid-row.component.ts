import { Component, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'arya-grid-row',
  templateUrl: './arya-grid-row.component.html',
  styleUrls: ['./arya-grid-row.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AryaGridRowComponent {

  @Input() row;
  @Input() columns;
  @Output() onRowSelect: EventEmitter<any> = new EventEmitter<any>();

  rowSelect($event, row) {
    $event.stopPropagation();
    this.onRowSelect.emit({ row: row, originalEvent: $event });
  }
}
