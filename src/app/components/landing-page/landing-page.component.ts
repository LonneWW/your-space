import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-landing-page',
  imports: [
    FormsModule,
    RouterModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatButtonModule,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  constructor(
    private clipboard: Clipboard,
    private _snackBar: MatSnackBar,
    private titleService: Title
  ) {
    this.titleService.setTitle('Your Space - Landing Page');
  }

  //patient-demo account credentials
  public patientDemoAccount = {
    email: 'patient-demo@mail.it',
    password: 'PatientZero1!',
  };

  //therapist-demo account credentials
  public therapistDemoAccount = {
    email: 'therapist-demo@mail.it',
    password: 'TherapistZero1!',
  };

  //coping the credential field on the clipboard
  copyText(text: string): void {
    this.clipboard.copy(text);
    this._snackBar.open(`"${text}" has been copied on your clipboard.`, 'Ok', {
      duration: 2500,
    });
  }

  ngOnInit(): void {
    sessionStorage.clear();
  }
}
