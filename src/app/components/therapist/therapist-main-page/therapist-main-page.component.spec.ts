import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TherapistMainPageComponent } from './therapist-main-page.component';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../utilities/navbar/navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserDataService } from '../../../services/user-data.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TherapistMainPageComponent', () => {
  let component: TherapistMainPageComponent;
  let fixture: ComponentFixture<TherapistMainPageComponent>;
  let userDataServiceSpy: jasmine.SpyObj<UserDataService>;

  beforeEach(async () => {
    // Creiamo lo spy per UserDataService con currentUserData inizialmente nullo
    const userDataSpy = jasmine.createSpyObj(
      'UserDataService',
      ['updateUserData'],
      {
        currentUserData: null,
        sessionStorageUser: {
          id: 2,
          name: 'Alice',
          surname: 'Smith',
          role: 'therapist',
        },
      }
    );

    await TestBed.configureTestingModule({
      imports: [TherapistMainPageComponent, RouterTestingModule],
      providers: [
        { provide: UserDataService, useValue: userDataSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TherapistMainPageComponent);
    component = fixture.componentInstance;
    userDataServiceSpy = TestBed.inject(
      UserDataService
    ) as jasmine.SpyObj<UserDataService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateUserData in ngOnInit if currentUserData is null and sessionStorageUser exists', () => {
    fixture.detectChanges();
    expect(userDataServiceSpy.updateUserData).toHaveBeenCalledWith(
      userDataServiceSpy.sessionStorageUser
    );
  });

  it('should not call updateUserData in ngOnInit if currentUserData is already set', () => {
    // Simuliamo che currentUserData sia già valorizzato
    Object.defineProperty(userDataServiceSpy, 'currentUserData', {
      get: () => ({
        id: 2,
        name: 'Alice',
        surname: 'Smith',
        role: 'therapist',
      }),
    });
    userDataServiceSpy.updateUserData.calls.reset();
    fixture.detectChanges();
    expect(userDataServiceSpy.updateUserData).not.toHaveBeenCalled();
  });

  it('should render both app-navbar and router-outlet in the template', () => {
    fixture.detectChanges();
    const navbarElem = fixture.debugElement.query(By.css('app-navbar'));
    const outletElem = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(navbarElem).toBeTruthy();
    expect(outletElem).toBeTruthy();
  });
});
