import {
  Component,
  OnDestroy,
  ViewEncapsulation,
  ElementRef,
  NgZone,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { Observable, Observer, fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'arya-virtual-scroll',
  template: '<ng-content></ng-content>',
  styles: [`
    arya-virtual-scroll {
      display: block;
      position: relative;
      overflow: auto;
      contain: strict;
      will-change: scroll-position;
      -webkit-overflow-scrolling: touch;
      height: 100%;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class AryaVirtualScrollComponent implements OnDestroy {

  private _destroyed = new Subject();

  public elementScrolled: Observable<Event> = fromEvent(this.elementRef.nativeElement, 'scroll')
        .pipe(takeUntil(this._destroyed));

  @Input() itemHeight = 50;
  @Input() itemBuffer = 10;

  constructor(
    public elementRef: ElementRef<HTMLElement>,
    protected ngZone: NgZone,
    public _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
