import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsrComponent } from './adsr.component';

describe('AdsrComponent', () => {
  let component: AdsrComponent;
  let fixture: ComponentFixture<AdsrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
