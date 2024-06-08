import { Injectable, inject } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { Observable, Subject } from "rxjs";

@Injectable()
export class ConfirmDialogService{

  private confirmSubject = new Subject<boolean>();
  private confirmService: ConfirmationService = inject(ConfirmationService);

  confirm(message: string, header: string = 'Confirm', icon: string = 'pi pi-question'): Observable<boolean>{
    this.confirmService.confirm({
      message: message,
      header: header,
      icon: icon,
      accept: () => {
        this.confirmSubject.next(true);
      },
      reject: () => {
        this.confirmSubject.next(false);
      }
    });

    return this.confirmSubject.asObservable();
  }
}