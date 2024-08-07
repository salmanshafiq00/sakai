import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { AdminRoutingModule, adminRoutingComponents } from './admin-routing.module';
import { AppSharedModule } from 'src/app/shared/app-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { API_BASE_URL } from '../generated-clients/api-service';
import { environment } from 'src/environments/environment';
import { DragDropModule } from 'primeng/dragdrop';


@NgModule({
  declarations: [
    ...adminRoutingComponents
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AppSharedModule,
    DropdownModule,
    DragDropModule  
  ],
  providers: [
    { provide: API_BASE_URL, useValue: environment.API_BASE_URL },
  ]
})
export class AdminModule { }
