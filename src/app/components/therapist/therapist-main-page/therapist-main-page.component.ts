import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from '../../utilities/navbar/navbar.component';
import { UserDataService } from '../../../services/user-data.service';
import { TherapistHttpService } from '../../../services/therapist-http.service';

@Component({
  selector: 'app-therapist-main-page',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './therapist-main-page.component.html',
  styleUrl: './therapist-main-page.component.scss',
})
export class TherapistMainPageComponent implements OnInit {
  constructor(
    private userDataService: UserDataService,
    private tHttp: TherapistHttpService,
    private router: Router
  ) {}
  ngOnInit(): void {
    const serviceUser = this.userDataService.currentUserData;
    const sessionUser = this.userDataService.sessionStorageUser;
    if (serviceUser?.id || sessionUser?.id) {
      const id = serviceUser?.id ? serviceUser.id : sessionUser.id;
      this.tHttp.getTherapist(id).subscribe({
        next: (r: any) => {
          const data = r[0];
          data.role = 'therapist';
          this.userDataService.updateUserData(data);
          this.userDataService.saveSessionUser(data);
        },
        error: (e: any) => {
          sessionStorage.clear;
          this.router.navigate(['/login']);
        },
      });
    }
  }
}
