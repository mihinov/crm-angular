import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MaterialInstance, MaterialService } from '../shared/services/material.service';
import { OrderService } from './order.service';
import { OrderPosition, Order } from '../shared/interfaces';
import { OrdersService } from '../shared/services/order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef;
  modal: MaterialInstance;
  oSub$: Subscription;
  isRoot: boolean;
  pending = false;

  constructor(private router: Router,
              public order: OrderService,
              private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order';
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe(event => {
      // console.log('Navigation End');
      this.isRoot = this.router.url === '/order';
    });
  }

  ngOnDestroy(): void {
    this.modal.destroy();
    if (this.oSub$) {
      this.oSub$.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  removePosition(orderPosition: OrderPosition): void {
    this.order.remove(orderPosition);
  }

  openModal(): void {
    this.modal.open();
  }

  cancelModal(): void {
    this.modal.close();
  }

  onSubmit(): void {
    this.pending = true;

    const order: Order = {
      list: this.order.list.map(item => {
        const newItem = Object.assign({}, item);
        delete newItem._id;
        return newItem;
      })
    };

    this.oSub$ = this.ordersService.create(order).subscribe(
      newOrder => {
        MaterialService.toast(`Заказ №${newOrder.order} был добавлен`);
        this.order.clear();
      },
      err => MaterialService.toast(err.error.message),
      () => {
        this.modal.close();
        this.pending = false;
      }
    );
  }

}
