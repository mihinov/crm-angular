import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from 'rxjs';
import { Order } from '../shared/interfaces';

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tooltip') tooltipRef: ElementRef;
  tooltip: MaterialInstance;
  oSub: Subscription;
  isFilterVisible = false;
  orders: Order[] = [];

  offset = 0;
  limit = STEP;

  constructor(private ordersSerice: OrdersService) { }

  ngOnInit(): void {
    this.fetch();
  }

  ngOnDestroy(): void {
    this.tooltip.destroy();
    this.oSub.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  private fetch(): void {
    const params = {
      offset: this.offset,
      limit: this.limit
    };
    this.oSub = this.ordersSerice.fetch(params).subscribe(orders => {
      this.orders = orders;
    });
  }

}
