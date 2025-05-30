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
@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
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
export class RegisterComponent implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}
  public registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl<string>('Test', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      surname: new FormControl<string>('Testone', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      email: new FormControl<string>('pr@va.com', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl<string>('IoSonoLaPasswordDiProva11!', [
        Validators.required,
        Validators.minLength(12),
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&#]).+$'
        ),
      ]),
      //CAPIAMO STO VALIDATORS PATTERN
      confirmPassword: new FormControl<string>('IoSonoLaPasswordDiProva11!', [
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

  registerUser() {
    const form = this.registerForm.value;
    this.authService
      .registerUser(form)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          console.log(r);
          sessionStorage.setItem('id', r[0].id);
          sessionStorage.setItem('name', r[0].name);
          sessionStorage.setItem('surname', r[0].surname);
          sessionStorage.setItem('therapist_id', 'null');
          sessionStorage.setItem('role', form.role);
          this.snackbar.open('Registration has been successful', 'Ok', {
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
          this.registerForm.reset();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
