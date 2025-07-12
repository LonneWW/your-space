import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { PatientMainPageComponent } from './patient-main-page.component';
import { UserDataService } from '../../../services/user-data.service';
import { PatientHttpService } from '../../../services/patient-http.service';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { NavbarComponent } from '../../utilities/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { UserData } from '../../../interfaces/IUserData';

describe('PatientMainPageComponent', () => {
  let component: PatientMainPageComponent;
  let fixture: ComponentFixture<PatientMainPageComponent>;
  let userDataSpy: jasmine.SpyObj<UserDataService>;
  let pHttpSpy: jasmine.SpyObj<PatientHttpService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const fakeSessionUser = {
    id: 1,
    name: 'Test',
    surname: 'User',
    role: 'patient',
    therapist_id: 2,
  };

  beforeEach(async () => {
    userDataSpy = jasmine.createSpyObj(
      'UserDataService',
      ['updateUserData', 'saveSessionUser'],
      {
        currentUserData: null,
        sessionStorageUser: fakeSessionUser,
      }
    );
    pHttpSpy = jasmine.createSpyObj('PatientHttpService', [
      'getPatient',
      'getNotifications',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PatientMainPageComponent],
      providers: [
        { provide: UserDataService, useValue: userDataSpy },
        { provide: PatientHttpService, useValue: pHttpSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  return null;
                },
              },
            },
          },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientMainPageComponent);
    component = fixture.componentInstance;

    // default stub per evitare subscribe su undefined
    pHttpSpy.getPatient.and.returnValue(of([]));
    pHttpSpy.getNotifications.and.returnValue(of([]));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPatient and update/save user on successful response', () => {
    const backendResponse = [
      {
        id: 1,
        name: 'Test',
        surname: 'User',
        role: 'patient',
        therapist_id: 2,
      } as UserData,
    ];
    pHttpSpy.getPatient.and.returnValue(of(backendResponse));

    fixture.detectChanges(); // ngOnInit()

    expect(pHttpSpy.getPatient).toHaveBeenCalledWith(1);
    expect(userDataSpy.updateUserData).toHaveBeenCalledWith(backendResponse[0]);
    expect(userDataSpy.saveSessionUser).toHaveBeenCalledWith(
      backendResponse[0] as any
    );
  });

  it('should clear sessionStorage and navigate to /login on error', () => {
    pHttpSpy.getPatient.and.returnValue(throwError(() => new Error('fail')));
    spyOn(sessionStorage, 'clear');

    fixture.detectChanges(); // ngOnInit()

    expect(sessionStorage.clear).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should render <app-navbar> and <router-outlet> in template', () => {
    // non serve ngOnInit qui
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-navbar')).toBeTruthy();
    expect(el.querySelector('router-outlet')).toBeTruthy();
  });
});
