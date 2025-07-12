import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { ListOfPatientFeaturesComponent } from './list-of-features.component';
import { TherapistHttpService } from '../../../services/therapist-http.service';
import { UserDataService } from '../../../services/user-data.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListOfPatientFeaturesComponent', () => {
  let component: ListOfPatientFeaturesComponent;
  let fixture: ComponentFixture<ListOfPatientFeaturesComponent>;

  const dummyFeatures = [
    { id: 1, title: 'Feature 1', description: 'Descrizione 1' },
    { id: 2, title: 'Feature 2', description: 'Descrizione 2' },
    { id: 3, title: 'Feature 3', description: 'Descrizione 3' },
  ];

  beforeEach(async () => {
    const tHttpSpyObj = jasmine.createSpyObj('TherapistHttpService', [
      'getPatients',
    ]);
    const userDataSpyObj = jasmine.createSpyObj('UserDataService', [], {
      currentUserData: { id: 10, role: 'therapist' },
    });
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    routerSpyObj.events = of(new NavigationEnd(0, '/', '/'));
    const snackbarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ListOfPatientFeaturesComponent,
        RouterTestingModule.withRoutes([]),
        MatCardModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: TherapistHttpService, useValue: tHttpSpyObj },
        { provide: UserDataService, useValue: userDataSpyObj },
        { provide: Router, useValue: routerSpyObj },
        { provide: MatSnackBar, useValue: snackbarSpyObj },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfPatientFeaturesComponent);
    component = fixture.componentInstance;

    // Impostiamo le feature simulate
    (component as any).features = dummyFeatures;

    fixture.detectChanges();
  });

  it('should render three feature cards', fakeAsync(() => {
    tick();
    const cards = fixture.debugElement.queryAll(
      By.css('mat-card.feature-card')
    );
    expect(cards.length).toEqual(3);
    flush();
  }));
});
