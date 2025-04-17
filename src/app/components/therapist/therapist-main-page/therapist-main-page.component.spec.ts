import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistMainPageComponent } from './therapist-main-page.component';

describe('TherapistMainPageComponent', () => {
  let component: TherapistMainPageComponent;
  let fixture: ComponentFixture<TherapistMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapistMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapistMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
