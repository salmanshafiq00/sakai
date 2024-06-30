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
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberComponent } from './components/input-number/input-number.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputCurrencyComponent } from './components/input-currency/input-currency.component';
import { InputDecimalComponent } from './components/input-decimal/input-decimal.component';
import { CalendarModule } from 'primeng/calendar';
import { InputDateComponent } from './components/input-date/input-date.component';
import { InputTimeComponent } from './components/input-time/input-time.component';
import { InputYearComponent } from './components/input-year/input-year.component';
import { InputTextAreaComponent } from './components/input-text-area/input-textarea.component';
import { InputSwitchComponent } from './components/input-switch/input-switch.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { InputCheckboxComponent } from './components/input-checkbox/input-checkbox.component';
import { InputSelectComponent } from './components/input-select/input-select.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputRadioComponent } from './components/input-radio/input-radio.component';
import { InputMultiselectComponent } from './components/input-multiselect/input-multiselect.component';



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
		InputDecimalComponent,
		InputDateComponent,
		InputTimeComponent,
		InputYearComponent,
		InputSwitchComponent,
		InputCheckboxComponent,
		InputSelectComponent,
		InputRadioComponent,
		InputMultiselectComponent
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
		InputSwitchModule, 
		TooltipModule,
		CalendarModule,
		CheckboxModule ,
		RadioButtonModule 
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
		InputDecimalComponent,
		InputDateComponent,
		InputTimeComponent,
		InputYearComponent,
		InputSwitchComponent,
		InputCheckboxComponent,
		InputSelectComponent,
		InputRadioComponent,
		InputMultiselectComponent
	]
})
export class AppSharedModule { }
