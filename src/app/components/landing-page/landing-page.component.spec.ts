import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingPageComponent } from './landing-page.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let clipboardSpy: jasmine.SpyObj<Clipboard>;

  beforeEach(async () => {
    // Creiamo gli spy per i servizi
    const clipboardSpyObj = jasmine.createSpyObj('Clipboard', ['copy']);
    // Usa TestBed.overrideTemplate per sovrascrivere il template del componente
    TestBed.overrideTemplate(
      LandingPageComponent,
      `
        <div>
          <div id="therapist-email-field" (click)="copyText(therapistDemoAccount.email)">
            {{ therapistDemoAccount.email }}
          </div>
        </div>
      `
    );

    await TestBed.configureTestingModule({
      imports: [LandingPageComponent, RouterTestingModule],
      providers: [{ provide: Clipboard, useValue: clipboardSpyObj }],
      // Utilizza NO_ERRORS_SCHEMA per ignorare direttive o componenti non rilevanti
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    clipboardSpy = TestBed.inject(Clipboard) as jasmine.SpyObj<Clipboard>;
  });

  it('should copy therapist email when therapist email field is clicked', () => {
    const emailField = fixture.debugElement.query(
      By.css('#therapist-email-field')
    );
    expect(emailField).toBeTruthy('Elemento email non trovato nel template');

    // Simula il click
    emailField.triggerEventHandler('click', null);

    // Verifica che il metodo clipboard.copy venga chiamato col valore atteso
    expect(clipboardSpy.copy).toHaveBeenCalledWith(
      component.therapistDemoAccount.email
    );
  });
});
