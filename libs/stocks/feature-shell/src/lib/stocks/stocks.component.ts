import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { MatFormFieldControl } from '@angular/material';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  maxDate: Date = new Date();

  public quotes$ = this.priceQuery.priceQueries$;

  timePeriods = [
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Five years', value: '5y' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' }
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
  }

  ngOnInit() { }

  /*if from date is after to date, make it the same as to date*/
  public fromDateChange(date): void {
    const { toDate } = (this.stockPickerForm.get('toDate').valid) ? this.stockPickerForm.value : '';
    if (toDate) {
      if (date.value.getTime() > toDate.getTime()) {
        this.stockPickerForm.controls.fromDate.setValue(toDate)
      };
    }
  }

  /*if to date is after from date, make it the same as from date*/
  public toDateChange(date): void {
    const { fromDate } = (this.stockPickerForm.get('fromDate').valid) ? this.stockPickerForm.value : '';
    if (fromDate) {
      if (date.value.getTime() < fromDate.getTime()) {
        this.stockPickerForm.controls.toDate.setValue(fromDate)
      }
    }
  }

  public fetchQuote(): void {
    if (this.stockPickerForm.valid) {
      const { symbol, fromDate, toDate } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, fromDate, toDate);
    }
  }
}
