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
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, NavigationEnd } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ListOfPatientFeaturesComponent', () => {
  let component: ListOfPatientFeaturesComponent;
  let fixture: ComponentFixture<ListOfPatientFeaturesComponent>;

  let tHttpSpy: jasmine.SpyObj<TherapistHttpService>;
  let userDataSpy: jasmine.SpyObj<UserDataService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackbarSpy: jasmine.SpyObj<MatSnackBar>;

  // Supponiamo ad esempio che il componente usi una proprietà "features" per renderizzare le feature cards.
  // Prepara tre oggetti dummy per simulare tre feature cards.
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
    // Creiamo uno spy per il Router con il metodo "navigate"
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    // **Importante:** aggiungiamo la proprietà events allo spy per evitare l'errore (simulate ad esempio un evento NavigationEnd).
    routerSpyObj.events = of(new NavigationEnd(0, '/', '/'));

    const snackbarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [ListOfPatientFeaturesComponent, RouterTestingModule],
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

    // Se il componente usa dati ricevuti tramite getPatients o simili, assicurati di settarli o stubbarli.
    // Se il template renderizza le feature cards a partire da una proprietà 'features'
    // impostiamo questa proprietà ad una lista fittizia con tre elementi.
    (component as any).features = dummyFeatures;

    fixture.detectChanges();

    tHttpSpy = TestBed.inject(
      TherapistHttpService
    ) as jasmine.SpyObj<TherapistHttpService>;
    userDataSpy = TestBed.inject(
      UserDataService
    ) as jasmine.SpyObj<UserDataService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackbarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should render three feature cards', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    // Presumendo che le feature cards abbiano un selettore CSS, ad esempio 'mat-card.feature-card'
    const cards = fixture.debugElement.queryAll(
      By.css('mat-card.feature-card')
    );
    expect(cards.length).toEqual(3);
    flush();
  }));
});
