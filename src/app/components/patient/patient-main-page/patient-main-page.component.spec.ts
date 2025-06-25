import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientMainPageComponent } from './patient-main-page.component';
import { UserDataService } from '../../../services/user-data.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
describe('PatientMainPageComponent', () => {
  let component: PatientMainPageComponent;
  let fixture: ComponentFixture<PatientMainPageComponent>;
  let userDataServiceSpy: jasmine.SpyObj<UserDataService>;

  beforeEach(async () => {
    // Creiamo uno spy per UserDataService.
    // Configuriamo le proprietà iniziali:
    // - currentUserData inizialmente nulla (per simulare il caso in cui non è stato impostato)
    // - sessionStorageUser restituisce un oggetto utente fittizio.
    const userDataSpy = jasmine.createSpyObj(
      'UserDataService',
      ['updateUserData'],
      {
        currentUserData: null,
        sessionStorageUser: {
          id: 1,
          name: 'Test',
          surname: 'User',
          role: 'patient',
          therapist_id: 2,
        },
      }
    );

    await TestBed.configureTestingModule({
      // Dal momento che il componente è standalone e ha gli import dichiarati in metadata,
      // possiamo importarlo direttamente.
      imports: [PatientMainPageComponent],
      providers: [
        { provide: UserDataService, useValue: userDataSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  // Qui puoi restituire valori specifici per i parametri se richiesto, oppure null
                  return null;
                },
              },
            },
          },
        },
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientMainPageComponent);
    component = fixture.componentInstance;
    userDataServiceSpy = TestBed.inject(
      UserDataService
    ) as jasmine.SpyObj<UserDataService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateUserData on init if currentUserData is null and sessionStorageUser exists', () => {
    // In questo scenario, currentUserData è null e sessionStorageUser restituisce un oggetto.
    fixture.detectChanges(); // Chiama ngOnInit()
    expect(userDataServiceSpy.updateUserData).toHaveBeenCalledWith(
      userDataServiceSpy.sessionStorageUser
    );
  });

  it('should not call updateUserData on init if currentUserData is already set', () => {
    // Simuliamo che currentUserData esista già.
    Object.defineProperty(userDataServiceSpy, 'currentUserData', {
      get: () => ({
        id: 2,
        name: 'Existing',
        surname: 'User',
        role: 'patient',
        therapist_id: 3,
      }),
    });

    // Azzeriamo eventuali chiamate pregresse
    userDataServiceSpy.updateUserData.calls.reset();
    fixture.detectChanges();
    expect(userDataServiceSpy.updateUserData).not.toHaveBeenCalled();
  });

  it('should render both app-navbar and router-outlet in the template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // Verifichiamo che l'elemento <app-navbar> sia presente.
    expect(compiled.querySelector('app-navbar')).toBeTruthy();
    // Verifichiamo che l'elemento <router-outlet> sia presente.
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
