import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyNoteComponent } from './daily-note.component';

describe('DailyNoteComponent', () => {
  let component: DailyNoteComponent;
  let fixture: ComponentFixture<DailyNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyNoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
