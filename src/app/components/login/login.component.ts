import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
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
export class LoginComponent implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl<string>('pr@va.com', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string>('IoSonoLaPasswordDiProva11!', [
      Validators.required,
      Validators.minLength(12),
    ]),
    role: new FormControl<string>('', [Validators.required]),
  });

  loginUser() {
    const form = this.loginForm.value;
    console.log(form);
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
          console.log(r);
          sessionStorage.setItem('id', `${r.id}`);
          sessionStorage.setItem('name', r.name);
          sessionStorage.setItem('surname', r.surname);
          sessionStorage.setItem('role', form.role);
          sessionStorage.setItem('therapist_id', `${r.therapist_id}`);
          this.snackbar.open('Logged in successfully', 'Ok', {
            duration: 3000,
          });

          this.router.navigate(['/' + form.role]);
        },
        error: (e) => {
          this.snackbar.open(
            e.error.message ||
              'Something went wrong while browsing the application',
            'Ok'
          );
          this.loginForm.reset();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
