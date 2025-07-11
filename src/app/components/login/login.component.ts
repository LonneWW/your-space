import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserDataService } from '../../services/user-data.service';
import { UserData } from '../../interfaces/IUserData';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private authService: AuthService,
    private userDataService: UserDataService,
    private router: Router,
    private snackbar: MatSnackBar,
    private titleService: Title
  ) {
    this.titleService.setTitle('Your Space - Login');
  }

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(12),
    ]),
    role: new FormControl<string>('', [Validators.required]),
  });

  //login user function
  loginUser(): void {
    //takes the values from the form
    const form = this.loginForm.value;
    //calls the service to make the authentication
    this.authService
      .loginUser(form)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: {
          id: number;
          name: string;
          surname: string;
          therapist_id: number;
        }) => {
          //if the login is successfull, save the obtained data
          //in the session storage and in the user data service
          const data = r as UserData;
          data.role = form.role;
          let sessionData = {
            id: JSON.stringify(data.id),
            name: data.name,
            surname: data.surname,
            role: data.role as 'patient' | 'therapist',
            therapist_id: JSON.stringify(undefined),
          };
          if (form.role == 'patient') {
            sessionData.therapist_id = JSON.stringify(data.therapist_id);
          }
          this.userDataService.saveSessionUser(sessionData);
          this.userDataService.updateUserData(data);
          this.snackbar.open('Logged in successfully', 'Ok', {
            duration: 3000,
          });

          this.router.navigate(['/' + form.role]);
        },
        error: (e) => {
          //if the login results unsuccessfull, alert the user with the error message
          this.snackbar.open(
            e.error.message
              ? e.error.message
              : 'Serverside error: something went wrong with your request.',
            'Ok'
          );
          console.error(e);
          switch (e.error.status) {
            case 401:
              this.loginForm.controls['password'].patchValue('');
              this.loginForm.controls['password'].markAsUntouched();
              this.loginForm.controls['password'].markAsPristine();
              break;
            case 404:
              this.loginForm.controls['email'].patchValue('');
              this.loginForm.controls['email'].markAsUntouched();
              this.loginForm.controls['email'].markAsPristine();
              this.loginForm.controls['password'].patchValue('');
              this.loginForm.controls['password'].markAsUntouched();
              this.loginForm.controls['password'].markAsPristine();
              break;
            default:
              this.loginForm.reset();
              break;
          }
        },
      });
  }

  ngOnInit(): void {
    sessionStorage.clear();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
