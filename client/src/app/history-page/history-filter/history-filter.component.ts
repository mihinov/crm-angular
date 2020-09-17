import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Filter } from '../../shared/interfaces';
import { MaterialService, MaterialDatepicker } from '../../shared/classes/material.service';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss'],
})
export class HistoryFilterComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() filter = new EventEmitter<Filter>();
  @ViewChild('start') startRef: ElementRef;
  @ViewChild('end') endRef: ElementRef;

  start: MaterialDatepicker;
  end: MaterialDatepicker;
  order: number;

  isValid = true;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.start.destroy();
    this.end.destroy();
  }

  ngAfterViewInit(): void {
    this.start = MaterialService.initDatepicker(this.startRef, this.validate.bind(this));
    this.end = MaterialService.initDatepicker(this.endRef, this.validate.bind(this));
  }

  validate(): void {
    if (!this.start.date || !this.end.date) {
      this.isValid = true;
      return;
    }
    this.isValid = this.start.date < this.end.date;
  }

  submitFilter(): void {
    const filter: Filter = {

    };

    if (this.order) {
      filter.order = this.order;
    }

    if (this.start.date) {
      filter.start = this.start.date;
    }

    if (this.end.date) {
      filter.end = this.end.date;
    }

    this.filter.emit(filter);
  }
}
