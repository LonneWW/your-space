import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { takeUntil, Subject } from 'rxjs';
import { SearchBarComponent } from '../../utilities/search-bar/search-bar.component';
import { PatientHttpService } from '../../../services/patient-http.service';
import { UserDataService } from '../../../services/user-data.service';
import { Note } from '../../../interfaces/INote';
import { UserData } from '../../../interfaces/IUserData';

@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    SearchBarComponent,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit, OnDestroy {
  constructor(
    private pHttp: PatientHttpService,
    private userData: UserDataService,
    private router: Router
  ) {}
  displayedColumns: string[] = [
    'title',
    'tags',
    'date',
    'shared',
    'view',
    'delete',
  ];
  protected user!: UserData;
  protected notesList: any;
  private destroy$: Subject<void> = new Subject<void>();

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    const id = this.userData.currentUserData?.id;
    if (id) {
      this.getNotesDecorator(id);
    }
  }

  filterSearch(event: any) {
    const id = this.userData.currentUserData?.id;
    if (id) {
      this.getNotesDecorator(id, event);
    }
  }

  getNotesDecorator(
    id: number,
    filters: {
      note_id?: number;
      title?: string;
      tag?: string;
      dateFrom?: number;
      dateTo?: number;
    } = {}
  ) {
    this.pHttp
      .getNotes(id, filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: Note[]) => {
          console.log(r);
          if (r.length < 1) return;
          this.notesList = new MatTableDataSource(r);
          this.notesList.sort = this.sort;
        },
        error: (e: any) => {
          console.log(e);
        },
      });
  }

  changeNoteVisibility(note: Note) {
    const pass = confirm('Do you wish to change this note visibility?');
    if (!pass) return;
    const body = {
      note_id: note.id,
      patient_id: note.patient_id,
      shared: note.shared == 1 ? 0 : 1,
    };
    this.pHttp
      .changeNoteVisibility(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          console.log(r);
          note.shared = !note.shared;
          alert('Note visibility changed.');
        },
        error: (e: any) => {
          console.log(e);
        },
      });
  }

  openNote(note: Note): void {
    sessionStorage.setItem(`selectedNote_${note.id}`, JSON.stringify(note));
    this.router.navigate(['patient/note/' + note.id]);
  }

  deleteNote(note: Note) {
    this.pHttp
      .deleteNote(note.id, note.patient_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          console.log(r);
          this.notesList.data = this.notesList.data.filter(
            (n: Note) => n.id !== note.id
          );
          note.shared = !note.shared;
          alert('Note deleted successfully.');
        },
        error: (e: any) => {
          console.log(e);
        },
      });
  }

  ngAfterViewInit() {
    // this.notesList.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
