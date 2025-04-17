import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FloatingTooltipDirective } from '../../directives/floating-tooltip.directive';
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
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
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
      ]),
      password: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(12),
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&#]).+$'
        ),
      ]),
      //CAPIAMO STO VALIDATORS PATTERN
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
}
