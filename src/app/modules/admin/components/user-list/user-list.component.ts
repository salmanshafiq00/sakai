import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FilterMatchMode, FilterMetadata } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { Subject, debounceTime, timer } from 'rxjs';
import { FieldType } from 'src/app/core/contants/FieldDataType';
import { DataFieldModel, DataFilterModel, GetAppUserListQuery, UsersClient } from 'src/app/modules/generated-clients/api-service';
import { BackoffService } from 'src/app/shared/services/backoff.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserDetailComponent } from '../user-detail/user-detail.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  providers: [ToastService, BackoffService, ConfirmDialogService, UsersClient, DatePipe]
})
export class UserListComponent implements OnInit {

  FieldType = FieldType;
  FilterMatchModes = FilterMatchMode;
  isInitialLoaded: boolean = false;
  optionDataSources = {};
  // Table Settings //
  responsiveLayout = 'scroll';
  cols: any[] = []; // eta input diye anbo
  dataFields: DataFieldModel[] = [];
  filters: DataFilterModel[] = [];

  // Lazy Loading
  lazyLoading: boolean = true;

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

  dateFilterMatchModesOptions = [
    { label: 'Date is', value: FilterMatchMode.DATE_IS },
    { label: 'Date is not', value: FilterMatchMode.DATE_IS_NOT },
    { label: 'Date is before', value: FilterMatchMode.DATE_BEFORE },
    { label: 'Date is after', value: FilterMatchMode.DATE_AFTER },
    { label: 'Date is or before', value: FilterMatchMode.DATE_IS_OR_BEFORE },
    { label: 'Date is or after', value: FilterMatchMode.DATE_IS_OR_AFTER }
  ];


  // Global filters
  @ViewChild('dt') table: Table;
  @ViewChild('globalSearchInput') globalSearchInput: ElementRef;
  debounceTimeout: number = 500;
  private searchSubject: Subject<string> = new Subject();


  // Row Selection
  selectionMode: "single" | "multiple" = "multiple";

  // Row Styles 
  rowHover: boolean = true;

  // Others
  dataKey: string = 'id';

  statusList = [];

  // Dropdwon Selected value
  selectedParent: any;
  selectedStatus: any;

  caption: string = 'Manage User';
  optionsDataSources: any;

  //loading
  loading: boolean = false;
  refreshLoading: boolean = false;

  items: any[] = [];
  selectedItems: any[] = [];


  // Dialog ---------------------

  private backoffService: BackoffService = inject(BackoffService);
  private toast: ToastService = inject(ToastService);
  private confirmDialogService: ConfirmDialogService = inject(ConfirmDialogService);
  private datePipe: DatePipe = inject(DatePipe);
  private customDialogService: CustomDialogService = inject(CustomDialogService);
  private entityClient: UsersClient = inject(UsersClient);


  constructor() {

    this.searchSubject.pipe(
      debounceTime(this.debounceTimeout)
    ).subscribe((searchText) => {
      this.onGlobalFilter(searchText);
    })

  }

  ngOnInit() {
    this.loadData({ first: this.first, rows: this.rows }, true)
  }

  get hasSelectOrDateType(): boolean {
    return this.dataFields.some(col => col.fieldType === FieldType.select || col.fieldType === FieldType.multiSelect);
  }

  loadData(event: TableLazyLoadEvent, allowCache?: boolean) {

    console.log(event)
    this.loading = true;

    this.first = event.first;
    this.rows = event.rows;

    const query = new GetAppUserListQuery();
    query.offset = this.first;
    query.pageSize = this.rows;
    query.allowCache = !!allowCache;
    query.sortField = this.getSortedField(event);
    query.sortOrder = event.sortOrder;
    query.globalFilterValue = this.getGlobalFilterValue(event);
    query.isInitialLoaded = this.isInitialLoaded;
    // query.filters = this.mapToDataFilterModel(event.filters);

    this.mapAndSetToDataFilterModel(event.filters);
    query.filters = this.filters;

    if (query.sortField
      || query.globalFilterValue
      || query.filters.length !== 0) {
      query.allowCache = false;
    }

    console.log(query)

    this.entityClient.getUsers(query).subscribe({
      next: (res) => {
        console.log(res)
        this.items = res.items;
        this.pageNumber = res.pageNumber;
        this.totalRecords = res.totalCount;
        this.totalPages = res.totalPages;
        this.dataFields = res.dataFields;
        this.filters = res.filters;
        this.optionsDataSources = res.optionsDataSources;
        this.globalFilterFields = res.dataFields
          .filter(x => x.isGlobalFilterable)
          .map(x => x.field);
        this.globalFilterFieldNames = res.dataFields
          .filter(x => x.isGlobalFilterable)
          .map(x => x.header);

        this.currentPageReportTemplate = `Showing {first} to {last} of ${this.totalRecords} entries`;

        // option datasource
        if (!this.isInitialLoaded) {
          this.optionDataSources = res.optionsDataSources;
          this.isInitialLoaded = true;
        }
      },
      error: (error) => {
        this.loading = false;
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
    this.refreshLoading = true;
    const delay = this.backoffService.getDelay();
    console.log(`Applying delay: ${delay}ms`);
    timer(delay).subscribe(() => {
      this.loadData({ first: this.first, rows: this.rows }, false);
      // this.backoffService.resetDelay();
      this.refreshLoading = false;
    });

  }

  getFilterValue(field: string) {
    const filter = this.filters.find(f => f.field === field);
    return filter ? filter.value : null;
  }


  onSearchInput(event: Event): void {
    const searchText = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchText);
  }

  onGlobalFilter(searchText: string, matchMode: string = 'contains'): void {
    this.table.filterGlobal(searchText, matchMode);
  }

  clear(table: Table) {
    table.clear();
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
    // this.usersClient.deleteLookup(id).subscribe({
    //   next: () => {
    //     this.toast.deleted();
    //     this.loadData({ first: this.first, rows: this.rows }, false)
    //   },
    //   error: (error) => {
    //     this.toast.showError('Fail to delete.')
    //   }
    // });
  }





  ///  -------------  Dialog -------------------



  openDialog(data: any) {
    this.customDialogService.open<string>(
      UserDetailComponent,
      data,
      'Create or Edit'
    )
      .subscribe((isSucceed: boolean) => {
        if (isSucceed) {
          this.loadData({ first: this.first, rows: this.rows })
        }
      });
  }

  deleteSelectedItems() {

  }


}

export interface FilterDictionary {
  [s: string]: FilterMetadata | FilterMetadata[];
}