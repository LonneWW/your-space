import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from '../../utilities/navbar/navbar.component';
import { UserDataService } from '../../../services/user-data.service';
import { PatientHttpService } from '../../../services/patient-http.service';

@Component({
  selector: 'app-patient-main-page',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './patient-main-page.component.html',
  styleUrl: './patient-main-page.component.scss',
})
export class PatientMainPageComponent implements OnInit {
  constructor(
    private userDataService: UserDataService,
    private pHttp: PatientHttpService,
    private router: Router
  ) {}
  ngOnInit(): void {
    const serviceUser = this.userDataService.currentUserData;
    const sessionUser = this.userDataService.sessionStorageUser;
    if (serviceUser?.id || sessionUser?.id) {
      const id = serviceUser?.id ? serviceUser.id : sessionUser.id;
      this.pHttp.getPatient(id).subscribe({
        next: (r: any) => {
          const data = r[0];
          data.role = 'patient';
          this.userDataService.updateUserData(data);
          this.userDataService.saveSessionUser(data);
        },
        error: (e: any) => {
          sessionStorage.clear();
          this.router.navigate(['/login']);
        },
      });
    }
  }
}
