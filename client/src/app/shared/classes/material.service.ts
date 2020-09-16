import { ElementRef } from '@angular/core';

declare var M;

export interface MaterialInstance {
  open?(): void;
  close?(): void;
  destroy?(): void;
}

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

  static initModal(ref: ElementRef): MaterialInstance {
    return M.Modal.init(ref.nativeElement);
  }

  static initTooltip(ref: ElementRef): MaterialInstance {
    return M.Tooltip.init(ref.nativeElement);
  }
}
