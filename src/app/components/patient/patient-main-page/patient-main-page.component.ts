import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { OverlayContainerComponent } from '../../utilities/overlay-container/overlay-container.component'; //DA ELIMINARE!
import { UserDataService } from '../../../services/user-data.service';

@Component({
  selector: 'app-patient-main-page',
  imports: [RouterOutlet, OverlayContainerComponent],
  templateUrl: './patient-main-page.component.html',
  styleUrl: './patient-main-page.component.scss',
})
export class PatientMainPageComponent implements OnInit {
  constructor(private userDataService: UserDataService) {}
  ngOnInit(): void {
    if (!this.userDataService.currentUserData) {
      const data = this.userDataService.sessionStorageUser;
      console.log(data);
      if (data) {
        console.log('entrato patient');
        this.userDataService.updateUserData(data);
      }
    }
  }
}
