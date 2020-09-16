import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PositionsService } from '../../shared/services/positions.service';
import { Observable } from 'rxjs';
import { Position } from '../../shared/interfaces';
import { map, switchMap } from 'rxjs/operators';
import { OrderService } from '../order.service';
import { MaterialService } from '../../shared/classes/material.service';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.scss']
})
export class OrderPositionsComponent implements OnInit {

  positions$: Observable<Position[]>;

  constructor(private route: ActivatedRoute,
              private positionsService: PositionsService,
              public order: OrderService) { }

  ngOnInit(): void {
    this.positions$ = this.route.params
      .pipe(
        switchMap((params: Params) => this.positionsService.fetch(params.id)),
        map((positions: Position[]) => positions.map(position => {
          position.quantity = 1;
          return position;
        }))
      );
  }

  addToOrder(position: Position): void {
    MaterialService.toast(`Добавлено: ${position.quantity} ${position.name}`);
    this.order.add(position);
  }

}
