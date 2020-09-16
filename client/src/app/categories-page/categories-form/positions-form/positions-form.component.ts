import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { PositionsService } from '../../../shared/services/positions.service';
import { Position } from '../../../shared/interfaces';
import { MaterialService, MaterialInstance } from '../../../shared/classes/material.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  positionId = null;
  modal: MaterialInstance;
  form: FormGroup;

  constructor(private positionsService: PositionsService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1)])
    });

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

  onSelectPosition(position: Position): void {
    this.positionId = position._id;
    this.form.reset({
      name: position.name,
      cost: position.cost
    });
    MaterialService.updateTextInputs();
    this.modal.open();
  }

  onAddPosition(): void {
    this.positionId = null;
    this.form.reset();
    MaterialService.updateTextInputs();
    this.modal.open();
  }

  onDeletePosition(event: Event, position: Position): void {
    event.stopPropagation();
    const decision = window.confirm(`Удалить позицию ${position.name}?`);

    if (decision) {
      this.positionsService.delete(position)
        .subscribe(
          response => {
            const idx = this.positions.findIndex(p => p._id === position._id);
            this.positions.splice(idx, 1);
            MaterialService.toast(response.message);
          },
          err => MaterialService.toast(err.error.message)
        );
    }
  }

  onCancel(): void {
    this.modal.close();
  }

  onSubmit(): void {
    this.form.disable();
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };

    const completed = () => {
      this.modal.close();
      this.form.reset();
      this.form.enable();
    };

    if (this.positionId) { // если позиция есть, то удалить
      newPosition._id = this.positionId;
      this.positionsService.update(newPosition)
        .subscribe(
          position => {
            const idx = this.positions.findIndex(p => p._id === position._id);
            this.positions[idx] = position;
            MaterialService.toast('Позиция изменена');
          },
          err => MaterialService.toast(err.error.message),
          completed
        );
    } else { // если позиции нету, то создаём
      this.positionsService.create(newPosition)
        .subscribe(
          position => {
            MaterialService.toast('Позиция создана');
            this.positions.push(position);
          },
          err => MaterialService.toast(err.error.message),
          completed
        );
    }

  }

}
