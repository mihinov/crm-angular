import { ElementRef } from '@angular/core';

declare var M;

export class MaterialService {
  static toast(message: string): void {
    M.toast({html: message});
  }

  static initializeFloatingButton(ref: ElementRef): void {
    M.FloatingActionButton.init(ref.nativeElement);
  }

  static updateTextInputs(): void {
    M.updateTextFields();
  }
}
