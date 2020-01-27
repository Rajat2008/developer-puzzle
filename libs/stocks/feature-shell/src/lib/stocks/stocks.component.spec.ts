import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { StocksComponent } from './stocks.component';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { of } from 'rxjs';
import { MatFormFieldModule, MatSelectModule, MatInputModule, MatNativeDateModule, MatDatepickerModule } from '@angular/material';
import { SharedUiChartModule } from '@coding-challenge/shared/ui/chart';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('StocksComponent', () => {
  let component: StocksComponent;
  let fixture: ComponentFixture<StocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StocksComponent],
      providers: [
        {
          provide: PriceQueryFacade, useValue: {
            priceQueries$: of([]),
            fetchQuote: jest.fn()
          }
        }
      ],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        SharedUiChartModule,
        MatDatepickerModule,
        MatNativeDateModule,

      ],

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should create', () => {
      component.ngOnInit();
      expect(component).toBeTruthy();
    });
  });

  describe('detectChanges', () => {
    it('should not process  quotes if only symbol was provided', () => {
      component.stockPickerForm.patchValue({
        symbol: 'AAPL'
      }, {
        emitEvent: true
      });
      fixture.detectChanges();
      component.fetchQuote();
      const priceQueryFacade: PriceQueryFacade = TestBed.get(PriceQueryFacade);

      expect(priceQueryFacade.fetchQuote).not.toHaveBeenCalled();
    });

    it('should not process quotes if only date Range was provided', () => {
      component.stockPickerForm.patchValue({
        fromDate: new Date("2016-01-22"),
        toDate: new Date("2017-01-23")
      }, {
        emitEvent: true
      });
      fixture.detectChanges();
      component.fetchQuote();
      const priceQueryFacade: PriceQueryFacade = TestBed.get(PriceQueryFacade);

      expect(priceQueryFacade.fetchQuote).not.toHaveBeenCalled();
    });

    it('should request quotes and get response once form is filled and valid', () => {
      const fromDate = new Date("2016-01-22");
      const toDate = new Date("2017-01-23");
      component.stockPickerForm.patchValue({
        symbol: 'AAPL',
        fromDate: fromDate,
        toDate: toDate
      }, {
        emitEvent: true
      });
      fixture.detectChanges();
      component.fetchQuote();
      const priceQueryFacade: PriceQueryFacade = TestBed.get(PriceQueryFacade);
      expect(priceQueryFacade.fetchQuote).toHaveBeenCalledTimes(1);
      expect(priceQueryFacade.fetchQuote).toHaveBeenCalledWith('AAPL', fromDate, toDate);
    });

    it('from date and date should be set if valid values are provided.', () => {
      const fromDate = new Date("2016-01-22");
      const toDate = new Date("2017-01-23");
      component.stockPickerForm.controls['toDate'].setValue(toDate);
      component.stockPickerForm.controls['fromDate'].setValue(fromDate)
      component.fromDateChange(component.stockPickerForm.controls['fromDate']);
      expect(component.stockPickerForm.controls['toDate'].value.getDate()).toEqual(toDate.getDate())
      expect(component.stockPickerForm.controls['fromDate'].value.getDate()).toEqual(fromDate.getDate());
      expect(component.stockPickerForm.controls['toDate'].value.getMonth()).toEqual(toDate.getMonth())
      expect(component.stockPickerForm.controls['fromDate'].value.getMonth()).toEqual(fromDate.getMonth());
      expect(component.stockPickerForm.controls['toDate'].value.getFullYear()).toEqual(toDate.getFullYear())
      expect(component.stockPickerForm.controls['fromDate'].value.getFullYear()).toEqual(fromDate.getFullYear());
    });

    it('from date should be as set to date if invalid date provided.', () => {
      const toDate = new Date("2016-01-22");
      const fromDate = new Date("2017-01-23");
      component.stockPickerForm.controls['toDate'].setValue(toDate);
      component.stockPickerForm.controls['fromDate'].setValue(fromDate)
      component.fromDateChange(component.stockPickerForm.controls['fromDate']);
      expect(component.stockPickerForm.controls['fromDate'].value.getDate()).toEqual(toDate.getDate());
      expect(component.stockPickerForm.controls['fromDate'].value.getMonth()).toEqual(toDate.getMonth());
      expect(component.stockPickerForm.controls['fromDate'].value.getFullYear()).toEqual(toDate.getFullYear());
    });

    it('from date should be set if toDate is blank.', () => {
      const fromDate = new Date("2017-01-23");
      component.stockPickerForm.controls['toDate'].setValue(null);
      component.stockPickerForm.controls['fromDate'].setValue(fromDate)
      component.fromDateChange(component.stockPickerForm.controls['fromDate']);
      expect(component.stockPickerForm.controls['fromDate'].value.getDate()).toEqual(fromDate.getDate());
      expect(component.stockPickerForm.controls['fromDate'].value.getMonth()).toEqual(fromDate.getMonth());
      expect(component.stockPickerForm.controls['fromDate'].value.getFullYear()).toEqual(fromDate.getFullYear());
    });


    it('from date and date should be set if valid values are provided.', () => {
      const fromDate = new Date("2016-01-22");
      const toDate = new Date("2017-01-23");
      component.stockPickerForm.controls['toDate'].setValue(toDate);
      component.stockPickerForm.controls['fromDate'].setValue(fromDate)
      component.toDateChange(component.stockPickerForm.controls['fromDate']);
      expect(component.stockPickerForm.controls['toDate'].value.getDate()).toEqual(toDate.getDate())
      expect(component.stockPickerForm.controls['fromDate'].value.getDate()).toEqual(fromDate.getDate());
      expect(component.stockPickerForm.controls['toDate'].value.getMonth()).toEqual(toDate.getMonth())
      expect(component.stockPickerForm.controls['fromDate'].value.getMonth()).toEqual(fromDate.getMonth());
      expect(component.stockPickerForm.controls['toDate'].value.getFullYear()).toEqual(toDate.getFullYear())
      expect(component.stockPickerForm.controls['fromDate'].value.getFullYear()).toEqual(fromDate.getFullYear());
    });

    it('to date should be as set to from date if invalid date provided.', () => {
      const toDate = new Date("2016-01-22");
      const fromDate = new Date("2017-01-23");
      component.stockPickerForm.controls['toDate'].setValue(toDate);
      component.stockPickerForm.controls['fromDate'].setValue(fromDate)
      component.toDateChange(component.stockPickerForm.controls['toDate']);
      expect(component.stockPickerForm.controls['toDate'].value.getDate()).toEqual(fromDate.getDate());
      expect(component.stockPickerForm.controls['toDate'].value.getMonth()).toEqual(fromDate.getMonth());
      expect(component.stockPickerForm.controls['toDate'].value.getFullYear()).toEqual(fromDate.getFullYear());
    });

    it('to date should be set if from date is null.', () => {
      const toDate = new Date("2016-01-22");
      const fromDate = null;
      component.stockPickerForm.controls['toDate'].setValue(toDate);
      component.stockPickerForm.controls['fromDate'].setValue(fromDate)
      component.toDateChange(component.stockPickerForm.controls['toDate']);
      expect(component.stockPickerForm.controls['toDate'].value.getDate()).toEqual(toDate.getDate());
      expect(component.stockPickerForm.controls['toDate'].value.getMonth()).toEqual(toDate.getMonth());
      expect(component.stockPickerForm.controls['toDate'].value.getFullYear()).toEqual(toDate.getFullYear());
    });
  });
});
