import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../utilities/navbar/navbar.component';
import { UserDataService } from '../../../services/user-data.service';

@Component({
  selector: 'app-therapist-main-page',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './therapist-main-page.component.html',
  styleUrl: './therapist-main-page.component.scss',
})
export class TherapistMainPageComponent implements OnInit {
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
