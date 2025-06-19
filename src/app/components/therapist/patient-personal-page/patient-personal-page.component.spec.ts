import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPersonalPageComponent } from './patient-personal-page.component';

describe('PatientPersonalPageComponent', () => {
  let component: PatientPersonalPageComponent;
  let fixture: ComponentFixture<PatientPersonalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientPersonalPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientPersonalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
