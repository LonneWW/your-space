import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
  Inject,
} from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    MatSnackBarModule,
    MatDialogModule,
    SearchBarComponent,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit, OnDestroy {
  constructor(
    private pHttp: PatientHttpService,
    private userData: UserDataService,
    private router: Router,
    private _snackbar: MatSnackBar,
    private dialog: MatDialog
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
          if (r.length < 1) {
            this._snackbar.open(
              'No results were obtained from the search.',
              'Ok',
              { duration: 2500 }
            );
            return;
          }
          this.notesList = new MatTableDataSource(r);
          this.notesList.sort = this.sort;
        },
        error: (e: any) => {
          console.log(e);
        },
      });
  }

  changeNoteVisibility(note: Note) {
    const dialogData: ConfirmDialogData = {
      message: 'Do you wish to change this note visibility?',
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // result sarà true se l'utente ha scelto "Accetta" oppure false se "Rifiuta"
      if (result) {
        const body = {
          note_id: note.id,
          patient_id: note.patient_id,
          shared: note.shared === 1 ? 0 : 1,
        };

        this.pHttp
          .changeNoteVisibility(body)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (r: any) => {
              console.log(r);
              note.shared = !note.shared;
              this._snackbar.open('Note visibility changed.', 'Ok', {
                duration: 2500,
              });
            },
            error: (e: any) => {
              console.log(e);
              this._snackbar.open(e.message, 'Ok');
            },
          });
      }
    });
  }

  openNote(note: Note): void {
    sessionStorage.setItem(`selectedNote_${note.id}`, JSON.stringify(note));
    this.router.navigate(['patient/note/' + note.id]);
  }

  deleteNote(note: Note) {
    const dialogData: ConfirmDialogData = {
      message:
        'Do you really wish to delete this note? This action is irreversible.',
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
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
              this._snackbar.open('Note deleted successfully.', 'Ok', {
                duration: 2500,
              });
            },
            error: (e: any) => {
              console.log(e);
              this._snackbar.open(e.message, 'Ok');
            },
          });
      }
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

export interface ConfirmDialogData {
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirm</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="mat-dialog-actions">
      <button mat-button (click)="onCancel()">Refuse</button>
      <button mat-button color="primary" (click)="onConfirm()">Accept</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void {
    // Chiusura del dialog restituendo "true"
    this.dialogRef.close(true);
  }

  onCancel(): void {
    // Chiusura del dialog restituendo "false"
    this.dialogRef.close(false);
  }
}
