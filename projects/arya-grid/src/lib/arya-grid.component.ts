import {
  Component, OnInit, OnDestroy, Input, SimpleChanges,
  OnChanges, ChangeDetectionStrategy, ViewEncapsulation,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import * as cloneDeep from 'lodash.clonedeep';

interface Column {
  key: string; // key of the field in the given data object
  label: string; // label to be displayed in header
  width: number; // width of the column
  type: 'string' | 'number' | 'date'; // type of the data
  alignment: 'left' | 'right'; // alignment of the data
}

interface Row {
  cellConfig: any;
}

@Component({
  selector: 'arya-grid',
  templateUrl: './arya-grid.component.html',
  styleUrls: ['./arya-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AryaGridComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() columns: Array<Column>;
  @Input() data: Array<{ [key: string]: any }>;

  gridStyles: any = {};
  psOptions = { suppressScrollX: false };
  defaultMinWidth = 6; // considered as rem unit

  rowHieght = 40;

  // map variant of the given columns for faster access by key
  columnsMap: { [key: string]: Column } = {};

  showErrorMessage = false;
  errorMessage = 'No Results';

  preRowHeight = 0;
  postRowHeight = 0;

  private startRenderableIndex = 0;
  private endRenderableIndex = 100;
  public itemBuffer = 20;

  _renderableData = [];
  get renderableData() {
    return this._renderableData;
  }
  set renderableData(value) {
    this._renderableData = value;
    // this.setPrePostRowHeights();
  }

  _filteredData = [];
  get filteredData() {
    return this._filteredData;
  }
  set filteredData(value) {
    this._filteredData = value;
    this.renderableData = this._filteredData.slice(this.startRenderableIndex, this.endRenderableIndex);
  }

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.columns) {
      // on column change resetting the search row flag
      this.columns = this.preProcessColumns(changes.columns.currentValue);
      this.gridStyles = { 'min-width': this.calcMinWidth() + 'rem' };
    }
    if (changes.data) {
      this.data = cloneDeep(changes.data.currentValue);
      this.filteredData = this.data as Array<Row>;
    }
  }

  ngOnDestroy() {}

  private updateColumnWidths(columns) {
    // considering only visible columns
    const cols = columns.filter(c => !c.hide);

    let totalWidth = 0;
    cols.forEach(column => totalWidth += column.width);
    cols.forEach(column => {
      // computing the width percentage for each column
      column.widthPercent = 100 * (column.width / totalWidth) + '%';
    });
  }

  private preProcessColumns(columns) {
    // computing the width percentage for visible columns
    this.updateColumnWidths(columns);
    return columns;
  }

  processColumnsMap() {
    this.columns.forEach(e => {
      // building the columns map
      this.columnsMap[e.key] = e;
    });
    return this.columnsMap;
  }

  calcMinWidth() {
    return this.columns.reduce((result, value) => {
      result += this.defaultMinWidth;
      return result;
    }, 0);
  }

  onScroll(event) {
    //
  }
}
