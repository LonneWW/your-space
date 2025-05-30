import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfFeaturesComponent } from './list-of-features.component';

describe('ListOfFeaturesComponent', () => {
  let component: ListOfFeaturesComponent;
  let fixture: ComponentFixture<ListOfFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfFeaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
