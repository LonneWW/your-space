import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfPatientsComponent } from './list-of-patients.component';

describe('ListOfPatientsComponent', () => {
  let component: ListOfPatientsComponent;
  let fixture: ComponentFixture<ListOfPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfPatientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
