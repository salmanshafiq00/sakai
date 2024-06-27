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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextComponent } from './components/input-text/input-text.component';
import { ValidatorMsgComponent } from './components/validator-msg/validator-msg.component';
import { InputTextAreaComponent } from './components/input-text-area/input-text-area.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberComponent } from './components/input-number/input-number.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputCurrencyComponent } from './components/input-currency/input-currency.component';
import { InputDecimalComponent } from './components/input-decimal/input-decimal.component';



@NgModule({
	declarations: [
		ConfirmDialogComponent,
		ToastComponent,
		DataGridComponent,
		InputTextComponent,
		ValidatorMsgComponent,
		InputTextAreaComponent,
		InputNumberComponent,
		InputCurrencyComponent,
		InputDecimalComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
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
		InputTextareaModule,
		InputNumberModule,
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
		DataGridComponent,
		InputTextComponent,
		ValidatorMsgComponent,
		InputTextAreaComponent,
		InputNumberComponent,
		InputCurrencyComponent,
		InputDecimalComponent
	]
})
export class AppSharedModule { }
