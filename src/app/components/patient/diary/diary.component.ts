import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntil, Subject } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserDataService } from '../../../services/user-data.service';
import { UserData } from '../../../interfaces/IUserData';
import { PatientHttpService } from '../../../services/patient-http.service';
import { NoteViewerComponent } from '../../utilities/note-viewer/note-viewer.component';
import { Note } from '../../../interfaces/INote';

@Component({
  selector: 'app-diary',
  imports: [CommonModule, MatProgressSpinnerModule, NoteViewerComponent],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss',
})
export class DiaryComponent implements OnInit, OnDestroy {
  constructor(
    private userData: UserDataService,
    private pHttp: PatientHttpService
  ) {}
  protected user!: UserData | null;
  protected note!: Note;

  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.user = this.userData.currentUserData;
    this.pHttp
      .getNotes(this.user!.id, { note_id: 1 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          console.log(r);
          this.note = r[0];
        },
        error: (e: any) => {
          console.log(e);
        },
      });
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('note');
    this.destroy$.next();
    this.destroy$.complete();
  }
}
