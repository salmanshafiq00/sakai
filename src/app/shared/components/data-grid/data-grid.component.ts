import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FilterMatchMode, FilterMetadata, FilterService } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { timer } from 'rxjs';
import { FieldType } from 'src/app/core/contants/FieldDataType';
import { DataFieldModel, DataFilterModel } from 'src/app/modules/generated-clients/api-service';
import { BackoffService } from '../../services/backoff.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { CustomDialogService } from '../../services/custom-dialog.service';
import { AppDataGridModel } from '../../models/app-data-grid.model';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.scss',
  providers: [ToastService, BackoffService, ConfirmDialogService, DatePipe]
})
export class DataGridComponent implements OnInit, OnDestroy {

  FieldType = FieldType;
  FilterMatchModes = FilterMatchMode;
  emptyGuid = '00000000-0000-0000-0000-000000000000';

  // Table Settings //
  isInitialLoaded: boolean = false;
  responsiveLayout = 'scroll';
  cols: any[] = [];
  dataFields: DataFieldModel[] = [];
  filters: DataFilterModel[] = [];
  lazyLoading: boolean = true;
  selectionMode: "single" | "multiple" = "multiple";
  rowHover: boolean = true;
  loading: boolean = false;
  dataKey: string = 'id';

  // Pagination
  paginator: boolean = true;
  rowsPerPageOptions: number[] = [5, 10, 20, 30, 50]
  showCurrentPageReport: boolean = true;
  totalRecords: number = 0;
  totalPages: number = 0;
  pageNumber: number = 1;
  first: number = 0;
  rows: number = 10;
  currentPageReportTemplate: string = `Showing {first} to {last} of ${this.totalRecords} entries`;

  // Filtering Global
  globalFilterFields: string[] = [];
  globalFilterFieldNames: string[] = [];

  // Global filters
  @ViewChild('dt') table: Table;
  @ViewChild('globalSearchInput') globalSearchInput: ElementRef;
  debounceTimeout: number = 500;


  optionDataSources = {};

  items: any[] = [];
  selectedItems: any[] = [];

  // Dropdwon Selected value
  selectedParent: any;
  selectedStatus: any;
   // Centralized storage for dynamic dropdown values
   dynamicDropdownValues: { [key: string]: any } = {};


  // 
  @Input() entityClient: any;
  @Input() detailComponent: any;
  @Input() dialogSize: any = '900px';
  @Input() getFuncName = '';
  @Input() caption: string = 'Entity Service';
  @Input() listComponent: any;
  @Input() dialogTitle: string = 'Entity Detail';

  // Dialog ---------------------

  private backoffService = inject(BackoffService);
  private toast = inject(ToastService);
  private confirmDialogService = inject(ConfirmDialogService);
  private datePipe = inject(DatePipe);
  private customDialogService = inject(CustomDialogService);
  ngOnInit() {
    this.loadData({ first: this.first, rows: this.rows }, true)
  }

  ngOnDestroy() {
    // this.searchSubject.unsubscribe();
  }

  get hasSelectOrDateType(): boolean {
    return this.dataFields.some(col => col.fieldType === FieldType.select || col.fieldType === FieldType.multiSelect);
  }

  // Function to generate unique keys for dropdowns
  generateDropdownKey(field: string, type: 'select' | 'multiSelect'): string {
    return `${field}_${type}`;
}

  loadData(event: TableLazyLoadEvent, allowCache?: boolean) {

    this.loading = true;

    this.first = event.first;
    this.rows = event.rows;

    const query = new AppDataGridModel();
    query.offset = this.first;
    query.pageSize = this.rows;
    query.allowCache = !!allowCache;
    query.sortField = this.getSortedField(event);
    query.sortOrder = event.sortOrder;
    query.globalFilterValue = this.getGlobalFilterValue(event);
    query.isInitialLoaded = this.isInitialLoaded;

    this.mapAndSetToDataFilterModel(event.filters);
    query.filters = this.filters;

    if (query.sortField
      || query.globalFilterValue
      || query.filters.length !== 0) {
      query.allowCache = false;
    }

    console.log(query)
    console.log(new Date())
    this.entityClient?.[this.getFuncName](query)?.subscribe({
      next: (res) => {
        this.items = res.items;
        this.pageNumber = res.pageNumber;
        this.totalRecords = res.totalCount;
        this.totalPages = res.totalPages;
        this.dataFields = res.dataFields;
        this.filters = res.filters;
        this.globalFilterFields = res.dataFields
          .filter(x => x.isGlobalFilterable)
          .map(x => x.field);
        this.globalFilterFieldNames = res.dataFields
          .filter(x => x.isGlobalFilterable)
          .map(x => x.header);

        this.currentPageReportTemplate = `Showing {first} to {last} of ${this.totalRecords} entries`;

        // option datasource only assign initially not second time
        if (!this.isInitialLoaded) {
          this.optionDataSources = res.optionDataSources;
          this.isInitialLoaded = true;
        }
      },
      error: (error) => {
        console.error(error, 'Error while fetching data')
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  get globalfiltersTooltip(): string {
    return this.globalFilterFieldNames?.join(', ');
  }

  refreshGrid() {
    this.loading = true;

    const delay = this.backoffService.getDelay();
    console.log(`Applying delay: ${delay}ms`);
    timer(delay).subscribe(() => {
      this.clear();
      this.loadData({ first: this.first, rows: this.rows }, false);
      // this.backoffService.resetDelay();
    });

  }

  getFilterValue(field: string) {
    const filter = this.filters.find(f => f.field === field);
    return filter ? filter.value : null;
  }


  onSearchInput(event: Event): void {
    const searchText = (event.target as HTMLInputElement).value;
    this.onGlobalFilter(searchText);
  }

  onSearchEnter(event: any): void {
    if (event.key === 'Enter') {
      const searchText = (event.target as HTMLInputElement).value;
      this.table.filterDelay = 0;
      this.onGlobalFilter(searchText);
    }
  }

  private onGlobalFilter(searchText: string, matchMode: string = 'contains'): void {
    this.table.filterGlobal(searchText, matchMode);
    this.table.filterDelay = this.debounceTimeout;
  }

  clear() {
    this.table.clear();
    this.globalSearchInput.nativeElement.value = '';
  }
  

  edit(item: any) {
    console.log(item);
    this.openDialog(item.id);
  }

  delete(item: any) {

    this.confirmDialogService.confirm(`Do you want to delete this?`).subscribe((confirmed) => {
      if (confirmed) {
        this.deleteItem(item.id);
        this.toast.created()
      }
    });
  }

  private getGlobalFilterValue(event: TableLazyLoadEvent): string {
    if (typeof event.globalFilter === 'string') {
      // If event.globalFilter is already a string, directly assign it to query.globalFilterValue
      return event.globalFilter.trim();
    } else if (Array.isArray(event.globalFilter)) {
      // If event.globalFilter is an array of strings, join the array elements into a single string
      return event.globalFilter.join(', '); // or any other delimiter you prefer
    }

    // Default return value if event.globalFilter is neither string nor array
    return '';
  }

  private getSortedField(event: TableLazyLoadEvent): string {
    if (typeof event.sortField === 'string') {
      return event.sortField;
    } else if (Array.isArray(event.sortField)) {
      return event.sortField.join(', '); // or any other delimiter you prefer
    }
    return '';
  }

  private mapAndSetToDataFilterModel(filters: FilterDictionary) {
    for (const field in filters) {

      if (field === 'global') continue;

      // to ensure that properties are not being accessed from the prototype chain unintentionally
      if (Object.prototype.hasOwnProperty.call(filters, field)) {

        // existingFilter is exist
        const existingFilter = this.filters.find(x => x.field === field);

        if (!existingFilter) continue;

        const filterMetadata = filters[field];

        if (Array.isArray(filterMetadata)) {
          let isFirstFilterMetaData = true;
          for (const filter of filterMetadata) {

            if (existingFilter && existingFilter.fieldType == FieldType.date) {
              if (isFirstFilterMetaData) {
                existingFilter.value = this.getTranformValue(existingFilter, filter);
                existingFilter.matchMode = filter.matchMode || '';
                existingFilter.operator = filter.operator || '';
                isFirstFilterMetaData = false;
              } else {
                const newFilter = new DataFilterModel();
                newFilter.field = field;
                newFilter.fieldType = existingFilter.fieldType;
                newFilter.value = this.getTranformValue(existingFilter, filter);
                newFilter.matchMode = filter.matchMode || '';
                newFilter.operator = filter.operator || '';
                newFilter.dsName = existingFilter.dsName;
                newFilter.dataSource = existingFilter.dataSource;
                this.filters.push(newFilter);
              }
            }
            else if (existingFilter) {
              existingFilter.value = this.getTranformValue(existingFilter, filter);
              existingFilter.matchMode = filter.matchMode || '';
              existingFilter.operator = filter.operator || '';
            }
          }
        } else if (typeof filterMetadata === 'object' && filterMetadata !== null && !Array.isArray(filterMetadata)) {
          if (existingFilter) {
            existingFilter.value = this.getTranformValue(filterMetadata.value, filterMetadata);
            existingFilter.matchMode = filterMetadata.matchMode || '';
            existingFilter.operator = filterMetadata.operator || '';
          }
        }
      }
    }
  }

  private getTranformValue(filter: DataFilterModel, filterMetadata: FilterMetadata): string {
    if (Array.isArray(filterMetadata.value)) {
      return filterMetadata.value.map(item => `'${item.id}'`).join(', ');
    }
    else if (filter.fieldType == FieldType.string) {
      return filterMetadata.value !== null ? filterMetadata.value.toString() : '';
    }
    else if (filter.fieldType == FieldType.select) {
      return filterMetadata.value !== null ? filterMetadata.value.toString() : '';
    }
    else if (filter.fieldType == FieldType.date) {
      return filterMetadata.value ? this.datePipe.transform(filterMetadata.value, 'yyyy/MM/dd') : '';
    }
    else {
      return '';
    }
  }

  private deleteItem(id: string) {
    this.entityClient.deleteLookup(id).subscribe({
      next: () => {
        this.toast.deleted();
        this.loadData({ first: this.first, rows: this.rows }, false)
      },
      error: (error) => {
        this.toast.showError('Fail to delete.')
      }
    });
  }


  deleteSelectedItems() {

  }

  ///  -------------  Dialog -------------------

  openDialog(data: any) {
    this.customDialogService.open<string>(
      this.detailComponent,
      data,
      this.dialogTitle
    )
      .subscribe((isSucceed: boolean) => {
        if (isSucceed) {
          this.loadData({ first: this.first, rows: this.rows })
        }
      });
  }




}

export interface FilterDictionary {
  [s: string]: FilterMetadata | FilterMetadata[];
}