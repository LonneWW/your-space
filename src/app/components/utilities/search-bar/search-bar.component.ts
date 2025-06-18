import { Component, Output, EventEmitter } from '@angular/core';
import { JsonPipe, DatePipe } from '@angular/common';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
@Component({
  selector: 'app-search-bar',
  providers: [provideNativeDateAdapter(), DatePipe],
  imports: [
    JsonPipe,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatDatepickerModule,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  constructor(private datePipe: DatePipe) {}

  @Output() filterSearch = new EventEmitter();

  protected searchForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    tag: new FormControl(''),
    dateRange: new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    }),
  });

  makeFilteredSearch(field: string) {
    switch (field) {
      case 'title':
        const title = this.searchForm.controls['title'].value;
        if (!title) break;
        this.filterSearch.emit({ title: title });
        break;
      case 'tag':
        const tag = this.searchForm.controls['tag'].value;
        if (!tag) break;
        this.filterSearch.emit({ tag: tag });
        break;
      case 'date':
        const startDateValue = this.searchForm.get('dateRange.start')!.value;
        const endDateValue = this.searchForm.get('dateRange.end')!.value;
        const startDate = this.datePipe.transform(
          startDateValue,
          'yyyy-MM-ddTHH:mm:ss.SSS'
        );
        const endDate = this.datePipe.transform(
          endDateValue,
          'yyyy-MM-ddTHH:mm:ss.SSS'
        );
        console.log(startDate);
        console.log(endDate);
        if (!startDate) break;
        if (!endDate) break;
        this.filterSearch.emit({
          dateFrom: startDate,
          dateTo: endDate,
        });
        break;
      default:
        return;
    }
  }

  resetFilterSearch() {
    this.filterSearch.emit({});
  }
}
