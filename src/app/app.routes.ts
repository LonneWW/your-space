import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { TherapistMainPageComponent } from './components/therapist/therapist-main-page/therapist-main-page.component';
import { ListOfPatientsComponent } from './components/therapist/list-of-patients/list-of-patients.component';
import { PatientPersonalPageComponent } from './components/therapist/patient-personal-page/patient-personal-page.component';
import { PatientMainPageComponent } from './components/patient/patient-main-page/patient-main-page.component';
import { ListOfPatientFeaturesComponent } from './components/patient/list-of-features/list-of-features.component';
import { ListOfAllTherapistsComponent } from '../app/components/patient/list-of-all-therapists/list-of-all-therapists.component';
import { DiaryComponent } from './components/patient/diary/diary.component';
import { CalendarComponent } from './components/patient/calendar/calendar.component';
import { DailyNoteComponent } from './components/patient/daily-note/daily-note.component';
import { NoteViewerComponent } from './components/utilities/note-viewer/note-viewer.component';
import { ListOfTherapistFeaturesComponent } from './components/therapist/list-of-features/list-of-features.component';
// import { confirmChangePageGuard } from './guards/confirm-change-page.guard';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { isAuthenticatedGuard } from './guards/is-authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing-page',
    pathMatch: 'full',
  },
  {
    path: 'landing-page',
    component: LandingPageComponent,
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'therapist',
    canActivate: [isAuthenticatedGuard],
    // canDeactivate: [confirmChangePageGuard],
    component: TherapistMainPageComponent,
    children: [
      { path: '', component: ListOfTherapistFeaturesComponent },
      { path: 'personal-notes', component: DiaryComponent },
      { path: 'patients-list', component: ListOfPatientsComponent },
      { path: 'patient/:id', component: PatientPersonalPageComponent },
    ],
  },
  {
    path: 'patient',
    canActivate: [isAuthenticatedGuard],
    // canDeactivate: [confirmChangePageGuard],
    component: PatientMainPageComponent,
    children: [
      { path: '', component: ListOfPatientFeaturesComponent },
      { path: 'list', component: ListOfAllTherapistsComponent },
      { path: 'personal-notes', component: DiaryComponent },
      { path: 'calendar', component: CalendarComponent },
      {
        path: 'daily-note',
        component: DailyNoteComponent,
        // canDeactivate: [confirmChangePageGuard],
      },
      { path: 'note/:id', component: NoteViewerComponent },
    ],
  },
];
