import {
  Component, OnInit, OnDestroy, Input, HostListener, SimpleChanges,
  OnChanges, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, ViewChild,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import * as cloneDeep from 'lodash.clonedeep';
import { debounceTime } from 'rxjs/operators';
import { AryaVirtualScrollComponent } from './arya-virtual-scroll.component';

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
    this.setPrePostRowHeights();
  }

  _filteredData = [];
  get filteredData() {
    return this._filteredData;
  }
  set filteredData(value) {
    this._filteredData = value;
    this.setRenderableIndexes(this.getRenderableIndexes(
      this.vScroll.elementRef.nativeElement,
      this._filteredData.length
    ));
    this.renderableData = this._filteredData.slice(this.startRenderableIndex, this.endRenderableIndex);
    this.setContainerHeight();
  }

  @ViewChild(AryaVirtualScrollComponent) vScroll: AryaVirtualScrollComponent;
  @ViewChild('virtualContainer') virtualContainer: ElementRef;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.vScroll.elementScrolled
      .pipe(debounceTime(50))
      .subscribe(e => this.onVirtualScroll(e));
  }

  ngAfterViewInit() {
    this.onVirtualScroll({ target: this.vScroll.elementRef.nativeElement });
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

  onVirtualScroll(e) {
    const target: any = e.target;
    const { startRenderableIndex, endRenderableIndex } = this.getRenderableIndexes(target, this.filteredData.length);

    if (
      startRenderableIndex === this.startRenderableIndex &&
      endRenderableIndex === this.endRenderableIndex
    ) {
      // change detection not required
      return;
    }

    // setRenderableIndexes
    this.setRenderableIndexes({ startRenderableIndex, endRenderableIndex});
    this.renderableData = this.filteredData.slice(startRenderableIndex, endRenderableIndex);
  }

  setContainerHeight() {
    if (!this.virtualContainer) {
      return;
    }
    const height = this.filteredData.length * this.vScroll.itemHeight;
    this.virtualContainer.nativeElement.style.height = height;
  }

  setPrePostRowHeights() {
    if (!this.vScroll) {
      return;
    }
    this.preRowHeight = this.vScroll.itemHeight * this.startRenderableIndex;
    this.postRowHeight = this.vScroll.itemHeight * (this.filteredData.length - this.endRenderableIndex);
    setTimeout(() => {
      this.ref.markForCheck();
    }, 0);
  }

  setRenderableIndexes({ startRenderableIndex, endRenderableIndex}) {
    this.startRenderableIndex = startRenderableIndex;
    this.endRenderableIndex = endRenderableIndex;
  }

  getRenderableIndexes(target, limit = 0) {
    const scrollTop = target.scrollTop;
    const height = target.clientHeight;
    const scrollBottom = scrollTop + height;

    const itemHeight = this.vScroll.itemHeight;
    const itemBuffer = this.vScroll.itemBuffer;

    let startIndex = parseInt('' + scrollTop / itemHeight, 10) - itemBuffer;
    // return even index to preserve grid striping
    startIndex = startIndex % 2 === 0 ? startIndex : startIndex - 1;
    const endIndex = itemBuffer + parseInt('' + scrollBottom / itemHeight, 10);

    return {
      startRenderableIndex: Math.max(0, startIndex),
      endRenderableIndex: Math.min(limit, endIndex),
    };
  }
}
