import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FloatingTooltipDirective } from '../../directives/floating-tooltip.directive';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserDataService } from '../../services/user-data.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-register',
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
    FloatingTooltipDirective,
    MatSnackBarModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy, OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
    private userDataService: UserDataService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Your Space - Register');
  }
  public registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      surname: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
      ]),
      password: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(50),
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&#]).+$'
        ),
      ]),
      confirmPassword: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(12),
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&#]).+$'
        ),
      ]),
      role: new FormControl<string>('', [Validators.required]),
    },
    { validators: passwordMatchValidator }
  );

  //register user
  registerUser() {
    //takes the values from the form
    const form = this.registerForm.value;
    //make the request
    this.authService
      .registerUser(form)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          //if successfull, save the data locally and navigate to the main page (based on role)
          const data = r;
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
          this.snackbar.open('Registration has been successful', 'Ok', {
            duration: 3000,
          });
          this.router.navigate(['/' + form.role]);
        },
        error: (e) => {
          console.error(e);
          this.snackbar.open(
            e.error.message
              ? e.error.message
              : 'Serverside error: something went wrong with your request.',
            'Ok'
          );
          this.registerForm.reset();
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
