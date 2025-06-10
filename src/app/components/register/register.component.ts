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
import { UserDataService } from '../../services/user-data.service';
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
    private snackbar: MatSnackBar,
    private userDataService: UserDataService
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
          const data = r[0];
          data.role = form.role;
          this.userDataService.saveSessionUser(data);
          this.userDataService.updateUserData(data);
          this.snackbar.open('Registration has been successful', 'Ok', {
            duration: 3000,
          });

          this.router.navigate(['/' + form.role]);
        },
        error: (e) => {
          console.log(e);
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
