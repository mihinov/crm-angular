import { Injectable } from '@angular/core';
import { Position } from '../shared/interfaces';

@Injectable()
export class OrderService {

  public list = [];
  public price = 0;

  add(position: Position) {}

  remove() {}

  clear() {}
}
