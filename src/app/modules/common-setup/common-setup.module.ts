import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonSetupRoutingComponents, CommonSetupRoutingModule } from './common-setup-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { environment } from 'src/environments/environment';
import { API_BASE_URL } from '../generated-clients/api-service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { CalendarModule } from 'primeng/calendar';



@NgModule({
  declarations: [
    ...CommonSetupRoutingComponents
  ],
  imports: [
    CommonModule,
    CommonSetupRoutingModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    InputSwitchModule,
    TagModule,
    MultiSelectModule,
    TooltipModule,
    DynamicDialogModule,
    ReactiveFormsModule,
    CalendarModule 
  ],
  providers: [
   {provide: API_BASE_URL, useValue: environment.API_BASE_URL}
  ]
})
export class CommonSetupModule { }
