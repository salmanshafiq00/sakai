import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FilterMatchMode, FilterMetadata } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { Subject, debounceTime, timer } from 'rxjs';
import { FieldType } from 'src/app/core/contants/FieldDataType';
import { DataFieldModel, DataFilterModel, GetRoleListQuery, RolesClient } from 'src/app/modules/generated-clients/api-service';
import { BackoffService } from 'src/app/shared/services/backoff.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { RoleDetailComponent } from '../role-detail/role-detail.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
  providers: [RolesClient]

})
export class RoleListComponent {
  detailComponent = RoleDetailComponent;
  getFuncName = 'getRoles';
  caption = 'Manage Roles'

  constructor(public entityClient: RolesClient) {
      
  }

}