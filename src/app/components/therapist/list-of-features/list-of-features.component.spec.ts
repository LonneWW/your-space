import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListOfTherapistFeaturesComponent } from './list-of-features.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';

describe('ListOfTherapistFeaturesComponent', () => {
  let component: ListOfTherapistFeaturesComponent;
  let fixture: ComponentFixture<ListOfTherapistFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatIconModule,
        MatCardModule,
        ListOfTherapistFeaturesComponent,
      ],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ListOfTherapistFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a heading "Main page"', () => {
    const heading: HTMLElement =
      fixture.nativeElement.querySelector('h3.text-accent');
    expect(heading).toBeTruthy();
    expect(heading.textContent).toContain('Main page');
  });

  it('should render two feature cards with correct routerLinks', () => {
    const featureCards = fixture.debugElement.queryAll(
      By.css('mat-card[routerLink]')
    );
    expect(featureCards.length).toEqual(2);

    // Verifica il primo mat-card, relativo a "Diary"
    const diaryCard = featureCards[0];
    const diaryRouterLink =
      diaryCard.properties['routerLink'] ||
      diaryCard.attributes['ng-reflect-router-link'];
    expect(diaryRouterLink).toContain('diary');

    // Verifica il secondo mat-card, relativo alla "List of Patients"
    const patientsCard = featureCards[1];
    const patientsRouterLink =
      patientsCard.properties['routerLink'] ||
      patientsCard.attributes['ng-reflect-router-link'];
    expect(patientsRouterLink).toContain('patients-list');
  });

  it('should display the correct icons for each feature card', () => {
    // Recuperiamo l'icona all'interno del primo mat-card (Diary)
    const diaryIconDe = fixture.debugElement.query(
      By.css('mat-card[routerLink] .icon-container mat-icon')
    );
    expect(diaryIconDe).toBeTruthy();
    expect(
      diaryIconDe.nativeElement.getAttribute('ng-reflect-svg-icon')
    ).toContain('diary');

    // Recuperiamo l'icona del secondo mat-card (List of Patients)
    const patientsCardIcons = fixture.debugElement.queryAll(
      By.css('mat-card[routerLink] .icon-container mat-icon')
    );
    // nel caso dei due card, il secondo elemento corrisponde all'icona presente nel secondo mat-card
    const patientsIconDe = patientsCardIcons[1];
    expect(patientsIconDe).toBeTruthy();
    expect(
      patientsIconDe.nativeElement.getAttribute('ng-reflect-svg-icon')
    ).toContain('group');
  });
});
