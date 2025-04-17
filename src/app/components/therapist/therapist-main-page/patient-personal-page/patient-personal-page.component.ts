const ELEMENT_DATA: any = [
  {
    title: 'Argomenti sedute',
    date: '08-04-2025',
    tags: ['none'],
    link: 'link.com',
  },
  { title: 'Aneddoto 1', date: '06-04-2025', tags: ['x'], link: 'link.it' },
  { title: 'Giornata X', date: '25-03-2025', tags: ['x,xy'], link: 'link.org' },
  { title: 'Pensieri', date: '22-03-2025', tags: ['xy, z'], link: 'link.wow' },
];

import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTable, MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-patient-personal-page',
  imports: [MatIconModule, MatButtonModule, MatCardModule, MatTableModule],
  templateUrl: './patient-personal-page.component.html',
  styleUrl: './patient-personal-page.component.scss',
})
export class PatientPersonalPageComponent {
  displayedColumns: any[] = ['title', 'date', 'tags', 'link'];
  dataSource = [...ELEMENT_DATA];

  @ViewChild(MatTable) table!: MatTable<any>;
}
