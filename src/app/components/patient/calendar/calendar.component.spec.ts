import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { PatientHttpService } from '../../../services/patient-http.service';
import { UserDataService } from '../../../services/user-data.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Interfaccia Note
export interface Note {
  id: number;
  patient_id: number;
  title: string;
  content: JSON | string;
  tags: any; // In questo esempio, tags è un array di oggetti
  date: number;
  shared?: number | boolean;
  therapist_id?: number | null | string | undefined;
}

// Esempio di array di Note: le tag sono fornite come array di oggetti
const sampleNotes: Note[] = [
  {
    id: 2,
    patient_id: 1,
    title: 'Sample Note',
    content: 'This is sample content',
    tags: [{ name: 'TestTag' }],
    date: Date.now(),
    shared: 0,
    therapist_id: '2',
  },
  {
    id: 3,
    patient_id: 1,
    title: 'Another Note',
    content: 'Another content',
    tags: [{ name: 'OtherTag' }],
    date: Date.now(),
    shared: 1,
    therapist_id: null,
  },
];

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let pHttpSpy: jasmine.SpyObj<PatientHttpService>;
  let userDataSpy: jasmine.SpyObj<UserDataService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const pHttpMock = jasmine.createSpyObj('PatientHttpService', ['getNotes']);
    const userDataMock = jasmine.createSpyObj('UserDataService', [], {
      currentUserData: { id: 1 },
    });
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
      providers: [
        { provide: PatientHttpService, useValue: pHttpMock },
        { provide: UserDataService, useValue: userDataMock },
        { provide: Router, useValue: routerMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      // Utilizziamo NO_ERRORS_SCHEMA per ignorare componenti figlio (ad esempio quelli legati a dialog o snackbar)
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    // Inizializziamo MatSort e notesList per evitare errori di binding
    component.sort = {} as MatSort;
    component.notesList = new MatTableDataSource(sampleNotes);

    pHttpSpy = TestBed.inject(
      PatientHttpService
    ) as jasmine.SpyObj<PatientHttpService>;
    userDataSpy = TestBed.inject(
      UserDataService
    ) as jasmine.SpyObj<UserDataService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Stub per getNotes: restituisce sampleNotes
    pHttpSpy.getNotes.and.returnValue(of(sampleNotes));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit and getNotesDecorator', () => {
    it('should request notes on init if user id exists', fakeAsync(() => {
      pHttpSpy.getNotes.and.returnValue(of(sampleNotes));
      component.ngOnInit();
      tick();
      expect(component.notesList).toBeDefined();
      expect((component.notesList as MatTableDataSource<Note>).data).toEqual(
        sampleNotes
      );
      expect(pHttpSpy.getNotes).toHaveBeenCalledWith(1, {});
      flush();
    }));

    it('should trigger getNotesDecorator on filterSearch event', fakeAsync(() => {
      const dummyFilters = { title: 'Test' };
      pHttpSpy.getNotes.and.returnValue(of(sampleNotes));
      component.filterSearch(dummyFilters);
      tick();
      expect(pHttpSpy.getNotes).toHaveBeenCalledWith(1, dummyFilters);
      flush();
    }));
  });
});
