import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfAllTherapistsComponent } from './list-of-all-therapists.component';

describe('ListOfAllTherapistsComponent', () => {
  let component: ListOfAllTherapistsComponent;
  let fixture: ComponentFixture<ListOfAllTherapistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfAllTherapistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfAllTherapistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
