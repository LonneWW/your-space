import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { TherapistMainPageComponent } from './components/therapist/therapist-main-page/therapist-main-page.component';
import { ListOfPatientsComponent } from './components/therapist/therapist-main-page/list-of-patients/list-of-patients.component';
import { PatientPersonalPageComponent } from './components/therapist/therapist-main-page/patient-personal-page/patient-personal-page.component';
import { PatientMainPageComponent } from './components/patient/patient-main-page/patient-main-page.component';
import { ListOfFeaturesComponent } from './components/patient/patient-main-page/list-of-features/list-of-features.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'therapist',
        component: TherapistMainPageComponent,
        children: [
          { path: '', component: ListOfPatientsComponent },
          { path: 'ppp', component: PatientPersonalPageComponent },
        ],
      },

      {
        path: 'patient',
        component: PatientMainPageComponent,
        children: [
          { path: '', component: ListOfFeaturesComponent },
          // {path: 'diary', component:}
          // {path: 'calendar', component:}
          // {path: 'daily-note', component:}
        ],
      },
    ],
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
];
