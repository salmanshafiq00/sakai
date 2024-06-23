import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ToastComponent } from './components/toast/toast.component';
import { ToastModule } from 'primeng/toast';
import { DialogService } from 'primeng/dynamicdialog';
import { CustomDialogService } from './services/custom-dialog.service';
import { DataGridComponent } from './components/data-grid/data-grid.component';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';



@NgModule({
	declarations: [
		ConfirmDialogComponent,
		ToastComponent,
		DataGridComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		// PrimeNg Modules //
		ToastModule,
		ConfirmDialogModule,
		TableModule,
		ToolbarModule,
		FileUploadModule,
		DropdownModule,
		MultiSelectModule,
		TagModule,
		InputTextModule,
		TooltipModule
	],
	providers: [
		MessageService,
		ConfirmationService,
		DialogService,
		CustomDialogService
	],
	exports: [
		ConfirmDialogComponent,
		ToastComponent,
		DataGridComponent
	]
})
export class AppSharedModule { }
