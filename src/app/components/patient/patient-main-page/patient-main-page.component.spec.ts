import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMainPageComponent } from './patient-main-page.component';

describe('PatientMainPageComponent', () => {
  let component: PatientMainPageComponent;
  let fixture: ComponentFixture<PatientMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
