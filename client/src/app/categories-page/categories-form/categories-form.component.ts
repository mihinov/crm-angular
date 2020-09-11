import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriesService } from '../../shared/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { MaterialService } from '../../shared/services/material.service';
import { Category } from '../../shared/interfaces';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef: ElementRef;

  isNew = true;
  image: File;
  imagePreview: string | ArrayBuffer = '';
  form: FormGroup;
  category: Category;

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router) { }

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
        (category: Category) => {
          if (category) {
            this.category = category;
            this.form.patchValue({
              name: category.name
            });
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInputs();
          }

          this.form.enable();
        },
        err => MaterialService.toast(err.error.message)
      );
  }

  triggerClick(): void {
    this.inputRef.nativeElement.click();
  }

  deleteCategory(): void {
    const decision = window.confirm(`Вы уверены, что хотите удалить категорию ${this.category.name}`);

    if (decision) {
      this.categoriesService.delete(this.category._id)
        .subscribe(
          response => MaterialService.toast(response.message),
          err => MaterialService.toast(err.error.message),
          () => this.router.navigate(['/categories'])
        );
    }

  }

  onFileUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files[0];
    this.image = file;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.addEventListener('load', () => {
      this.imagePreview = reader.result;
    });
  }

  onSubmit(): void {
    let obs$: Observable<Category>;
    this.form.disable();

    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image);
    } else {
      console.log(1);
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image);
    }

    obs$.subscribe(
      (category: Category) => {
        this.category = category;
        MaterialService.toast('Изменения сохранения');
        this.form.enable();
      },
      err => {
        MaterialService.toast(err.error.message);
        this.form.enable();
      }
    );
  }

}
