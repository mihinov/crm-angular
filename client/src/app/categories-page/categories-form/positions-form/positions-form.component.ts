import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { PositionsService } from '../../../shared/services/position.service';
import { Position } from '../../../shared/interfaces';
import { MaterialService, MaterialInstance } from '../../../shared/services/material.service';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;

  positions: Position[] = [];
  loading = false;
  modal: MaterialInstance;

  constructor(private positionsService: PositionsService) {}

  ngOnInit(): void {
    this.loading = true;
    this.positionsService.fetch(this.categoryId)
      .subscribe(
        positions => {
          this.positions = positions;
          this.loading = false;
        }
      );
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  onSelectPosition(): void {
    this.modal.open();
  }

  onAddPosition(): void {
    this.modal.open();
  }

  onCancel(): void {
    this.modal.close();
  }

}
