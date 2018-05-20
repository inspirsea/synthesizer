import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoiseComponent } from './noise.component';

describe('NoiseComponent', () => {
  let component: NoiseComponent;
  let fixture: ComponentFixture<NoiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
