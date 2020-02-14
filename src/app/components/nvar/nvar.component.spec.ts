import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NvarComponent } from './nvar.component';

describe('NvarComponent', () => {
  let component: NvarComponent;
  let fixture: ComponentFixture<NvarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NvarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NvarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
