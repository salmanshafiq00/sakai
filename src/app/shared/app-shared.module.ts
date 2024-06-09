import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ToastComponent } from './components/toast/toast.component';
import { ToastModule } from 'primeng/toast';
import { DialogService } from 'primeng/dynamicdialog';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';



@NgModule({
  declarations: [
		ConfirmDialogComponent,
		ToastComponent,
		BreadcrumbComponent
  ],
  imports: [
    CommonModule,

		// PrimeNg Modules //
		ToastModule,
		ConfirmDialogModule,
		BreadcrumbModule
  ],
	providers: [
		MessageService,
		ConfirmationService,
		DialogService
	],
	exports: [
		ConfirmDialogComponent,
		ToastComponent,
		BreadcrumbComponent
  ]
})
export class AppSharedModule { }
