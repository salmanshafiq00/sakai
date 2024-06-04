import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FilterMatchMode, FilterMetadata, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { Subject, debounceTime } from 'rxjs';
import { FieldType } from 'src/app/core/contants/FieldDataType';
import { DataFieldModel, DataFilterModel, GetLookupListQuery, LookupResponse, LookupsClient, SelectListsClient } from 'src/app/modules/generated-clients/api-service';
import { LookupDetailComponent } from '../lookup-detail/lookup-detail.component';

@Component({
  selector: 'app-lookup-list',
  templateUrl: './lookup-list.component.html',
  styleUrl: './lookup-list.component.scss',
  providers: [MessageService, LookupsClient, SelectListsClient, DatePipe, DialogService]
})
export class LookupListComponent implements OnInit {

  FieldType = FieldType;
  FilterMatchMode = FilterMatchMode;

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
  rows: number = 10;
  currentPageReportTemplate: string = `Showing {first} to {last} of ${this.totalRecords} entries`;

  // Filtering Global
  globalFilterFields: string[] = [];
  globalFilterFieldNames: string[] = [];

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
 
  // Dropdown DataSources
  parentList: any[] = [];
  statusList: any[] = [];

  // Dropdwon Selected value
  selectedParent: any;
  selectedStatus: any;

  caption: string = 'Manage Lookup';
  optionsDataSources: any;

  //loading
  loading: boolean = false;


    // Dialog ---------------------
    itemDialog: boolean = false;
    submitted: boolean = false;
    dialogWidth: number = 650;
  
    item: any = {};
  
    // LOOKUP
    items: any[] = [];
    selectedItems: any[] = [];
  

    ref: DynamicDialogRef | undefined;


  constructor(
    private messageService: MessageService,
    private lookupsClient: LookupsClient,
    private selectListClient: SelectListsClient,
    private datePipe: DatePipe,
    public dialogService: DialogService) {

    this.searchSubject.pipe(
      debounceTime(this.debounceTimeout)
    ).subscribe((searchText) => {
      this.onGlobalFilter(searchText);
    })
  }

  ngOnInit() {

    // this.loadData({first: 1, rows: this.rows})


    this.getParentSelectList();
    this.statusList = this.getStatusSelectList();

  }

  get hasSelectOrDateType(): boolean {
    return this.dataFields.some(col => col.fieldType === FieldType.select || col.fieldType === FieldType.multiSelect);
  }

  loadData(event: TableLazyLoadEvent) {

    this.loading = true;

    console.log(event)

    // 
    const lookupQuery = new GetLookupListQuery();
    lookupQuery.offset = event.first;
    lookupQuery.pageSize = event.rows;
    lookupQuery.allowCache = false;
    lookupQuery.sortField = this.getSortedField(event);
    lookupQuery.sortOrder = event.sortOrder;
    lookupQuery.globalFilterValue = this.getGlobalFilterValue(event);
    // lookupQuery.filters = this.mapToDataFilterModel(event.filters);

    this.mapAndSetToDataFilterModel(event.filters);
    lookupQuery.filters = this.filters;
    console.log(this.filters);

    console.log(lookupQuery)

    this.lookupsClient.getLookups(lookupQuery).subscribe({
      next: (res) => {
        console.log(res);
        this.items = res.items;
        this.totalRecords = res.totalCount;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalCount;
        this.pageNumber = res.pageNumber;
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

        this.loading = false;
      },
      error: (error) => {
        console.error(error, 'Error while fetching lookups')
      }
    });
  }

  get globalfiltersTooltip(): string {
    return this.globalFilterFieldNames?.join(', ');
  }

  // private setDataSources(filters: DataFilterModel[], optionsDataSource: any): DataFilterModel[] {
  //   filters.filter(x => x.dsName).forEach(filter => {
  //     const matchingDataSource = optionsDataSource[filter.dsName];
  //     if (matchingDataSource) {
  //       filter.dataSource = matchingDataSource;
  //     }
  //   });
  //   return filters;
  // }

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

  private getGlobalFilterValue(event: TableLazyLoadEvent): string {
    if (typeof event.globalFilter === 'string') {
      // If event.globalFilter is already a string, directly assign it to lookupQuery.globalFilterValue
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

  mapAndSetToDataFilterModel(filters: FilterDictionary) {
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
    else if (filter.fieldType == FieldType.date) {
      return filterMetadata.value ? this.datePipe.transform(filterMetadata.value, 'yyyy/MM/dd') : '';
    }
    else {
      return '';
    }
  }

  private getParentSelectList() {
    this.selectListClient.getLookupSelectList(true).subscribe({
      next: (res) => {
        this.parentList = res;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Parent Dropdown not found', life: 3000 })
      }
    });
  }

  private getStatusSelectList() {
    const statusSelectList = [];
    statusSelectList.push({
      id: 1,
      name: 'Active',
      severity: 'success'
    })
    statusSelectList.push({
      id: 0,
      name: 'Inactive',
      serverity: 'danger'
    })

    return statusSelectList;
  }


  ///  -------------  Dialog -------------------

  show(){
    this.item = new LookupResponse();
    this.item.status = true;
    this.ref = this.dialogService.open(LookupDetailComponent, {
      data: this.item,
      header: 'Create or Edit',
      width: '50vw',
      modal: true,
      resizable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    })
  }


  openNew() {
    this.item = new LookupResponse();
    this.item.status = true;
    this.itemDialog = true;
  }

  saveitem() {
    this.submitted = true;

    const createLookupCommand = { ...this.item }
    this.lookupsClient.createLookup(createLookupCommand).subscribe({
      next: (res) => {
        console.log(res + 'res from create')
        if (res) {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Lookup Created', life: 3000 });
          this.itemDialog = false;

        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Lookup Created Failed', life: 3000 });

        }
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Lookup Created Failed', life: 3000 });
      }
    });
    console.log(this.item)

  }

  deleteSelectedItems() {

  }

  // other commmon
  hideDialog() {

  }


}

export interface FilterDictionary {
  [s: string]: FilterMetadata | FilterMetadata[];
}