import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntil, Subject } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HttpService } from '../../../services/http.service';
@Component({
  selector: 'app-list-of-all-therapists',
  imports: [CommonModule, MatSnackBarModule, MatCardModule, MatButtonModule],
  templateUrl: './list-of-all-therapists.component.html',
  styleUrl: './list-of-all-therapists.component.scss',
})
export class ListOfAllTherapistsComponent implements OnInit {
  constructor(private http: HttpService, private snackbar: MatSnackBar) {}
  protected therapistsList: { id: number; name: string; surname: string }[] =
    [];
  private destroy$: Subject<void> = new Subject<void>();
  ngOnInit(): void {
    this.http
      .getAllTherapists()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r: any) => {
          console.log(r);
          this.therapistsList = r;
        },
        error: (e: any) => {
          this.snackbar.open(
            e.error.message ||
              "Something went wrong. Couldn't obtain list of therapists.",
            'Ok'
          );
        },
      });
  }
}
