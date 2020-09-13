import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MaterialInstance, MaterialService } from '../shared/services/material.service';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef;
  modal: MaterialInstance;
  isRoot: boolean;

  constructor(private router: Router,
              private order: OrderService) { }

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
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  openModal(): void {
    this.modal.open();
  }

  cancelModal(): void {
    this.modal.close();
  }

  onSubmit(): void {
    this.modal.close();
  }

}
