import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AryaGridComponent } from './arya-grid.component';

describe('AryaGridComponent', () => {
  let component: AryaGridComponent;
  let fixture: ComponentFixture<AryaGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AryaGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AryaGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
