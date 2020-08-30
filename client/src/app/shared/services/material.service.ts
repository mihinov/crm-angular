declare var M: { toast: (arg0: { html: string; }) => void; };

export class MaterialService {
  static toast(message: string): void {
    M.toast({html: message});
  }
}
