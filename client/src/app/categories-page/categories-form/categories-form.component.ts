import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriesService } from '../../shared/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MaterialService } from '../../shared/services/material.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  isNew = true;
  form: FormGroup;

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params.id) {
              this.isNew = false;
              return this.categoriesService.getById(params.id);
            } else {
              return of(null);
            }
          }
        )
      )
      .subscribe(
        category => {
          if (category) {
            this.form.patchValue({
              name: category.name
            });
            MaterialService.updateTextInputs();
          }

          this.form.enable();
        },
        err => MaterialService.toast(err.error.message)
      );
  }

  onSubmit(): void {

  }

}
