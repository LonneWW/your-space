import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-list-of-patients',
  imports: [MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './list-of-patients.component.html',
  styleUrl: './list-of-patients.component.scss',
})
export class ListOfPatientsComponent {}
