import {
  Component,
  Input,
  OnInit,
  OnDestroy 
} from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CHART_CONSTANTS } from './chart.const';

@Component({
  selector: 'coding-challenge-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {
  @Input() data$: Observable<any>;
  public chartData: []; /*changed 'any' type to Array*/
  public chartDataUnsubscribe: Subject<void> = new Subject<void>();
  public chart: Chart; /*spcified 'Chart' interface for chart configuration*/
  constructor() {}

  /*moved the chart configuration constants to a separate file*/
  ngOnInit() {
    this.chart = {
      title: '',
      type: CHART_CONSTANTS.CHART_TYPE,
      data: [],
      columnNames: [CHART_CONSTANTS.COLUMN_NAME_PERIOD, CHART_CONSTANTS.COLUMN_NAME_PERIOD],
      options: { title: CHART_CONSTANTS.CHART_OPTION_TITLE, width: CHART_CONSTANTS.CHART_OPTION_WIDTH, height: CHART_CONSTANTS.CHART_OPTION_HEIGHT }
    };

    this.data$.pipe(takeUntil(this.chartDataUnsubscribe)).subscribe(newData => (this.chartData = newData));
  }

  /**
* Added unscubscription to avoid memory leaks
*/
  ngOnDestroy() {
    this.chartDataUnsubscribe.next();
    this.chartDataUnsubscribe.complete();
  }
}

/**
* Interface for Chart configuration
*/

export interface Chart {
  title: string;
  type: string;
  data: [];
  columnNames: string[];
  options: ChartOptions;
}

/**
* Interface for Chart options
*/

export interface ChartOptions{
  title: string, 
  width: string, 
  height: string 
}