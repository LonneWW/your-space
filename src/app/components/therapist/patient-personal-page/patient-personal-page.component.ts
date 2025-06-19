import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { TherapistHttpService } from '../../../services/therapist-http.service';
import { UserDataService } from '../../../services/user-data.service';
import { Note } from '../../../interfaces/INote';
@Component({
  selector: 'app-patient-personal-page',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
  ],
  templateUrl: './patient-personal-page.component.html',
  styleUrl: './patient-personal-page.component.scss',
})
export class PatientPersonalPageComponent implements OnInit, OnDestroy {
  displayedColumns: any[] = ['title', 'tags', 'date', 'view'];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private tHttp: TherapistHttpService,
    private userData: UserDataService
  ) {}

  protected user: any;
  protected patient: any = {};
  protected patientNotes!: any;
  protected destroy$: Subject<void> = new Subject();

  ngOnInit(): void {
    this.patient = history.state.data;
    this.user = this.userData.currentUserData;
    this.tHttp
      .getPatientNotes(this.user.id, this.patient.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          console.log(r);
          this.patientNotes = new MatTableDataSource(r);
          this.patientNotes.sort = this.sort;
        },
        error: (e: any) => {
          console.log(e);
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
