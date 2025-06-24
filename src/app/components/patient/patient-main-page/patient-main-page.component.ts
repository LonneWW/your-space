import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../utilities/navbar/navbar.component';
import { UserDataService } from '../../../services/user-data.service';

@Component({
  selector: 'app-patient-main-page',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './patient-main-page.component.html',
  styleUrl: './patient-main-page.component.scss',
})
export class PatientMainPageComponent implements OnInit {
  constructor(private userDataService: UserDataService) {}
  ngOnInit(): void {
    if (!this.userDataService.currentUserData) {
      const data = this.userDataService.sessionStorageUser;
      if (data) {
        this.userDataService.updateUserData(data);
      }
    }
  }
}
