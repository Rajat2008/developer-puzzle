import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit, OnDestroy{
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;
  public inpuchangeUnscubscription : Subject<void> = new Subject<void>();
  quotes$ = this.priceQuery.priceQueries$;

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
      period: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.onSearchQueryChanges();
  }

  public onSearchQueryChanges(): void {
    this.stockPickerForm.valueChanges.pipe(takeUntil(this.inpuchangeUnscubscription)).subscribe(val => {
      if(this.stockPickerForm.valid && this.stockPickerForm.value.symbol !== ''){ /*checking form validity and restricting API calls on empty inputs(e.g when the user enters empty spaces)*/
        const { symbol, period } = this.stockPickerForm.value;
        this.priceQuery.fetchQuote(symbol, period); 
      }
    });
  }


  ngOnDestroy(){
    this.inpuchangeUnscubscription.next();
    this.inpuchangeUnscubscription.complete();
  }

  
}
