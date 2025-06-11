import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { TherapistMainPageComponent } from './components/therapist/therapist-main-page/therapist-main-page.component';
import { ListOfPatientsComponent } from './components/therapist/therapist-main-page/list-of-patients/list-of-patients.component';
import { PatientPersonalPageComponent } from './components/therapist/therapist-main-page/patient-personal-page/patient-personal-page.component';
import { PatientMainPageComponent } from './components/patient/patient-main-page/patient-main-page.component';
import { ListOfFeaturesComponent } from './components/patient/list-of-features/list-of-features.component';
import { ListOfAllTherapistsComponent } from '../app/components/patient/list-of-all-therapists/list-of-all-therapists.component';
import { DiaryComponent } from './components/patient/diary/diary.component';
import { QuillTextEditorComponent } from './components/utilities/quill-text-editor/quill-text-editor.component';
import { isAuthenticatedGuard } from './guards/is-authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'therapist',
        canActivate: [isAuthenticatedGuard],
        component: TherapistMainPageComponent,
        children: [
          { path: '', component: ListOfPatientsComponent },
          { path: 'ppp', component: PatientPersonalPageComponent },
        ],
      },

      {
        path: 'patient',
        canActivate: [isAuthenticatedGuard],
        component: PatientMainPageComponent,
        children: [
          { path: '', component: ListOfFeaturesComponent },
          { path: 'list', component: ListOfAllTherapistsComponent },
          { path: 'diary', component: DiaryComponent },
          // {path: 'calendar', component:}
          // {path: 'daily-note', component:}
        ],
      },
      {
        path: 'editor',
        canActivate: [isAuthenticatedGuard],
        component: QuillTextEditorComponent,
      },
    ],
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
];
