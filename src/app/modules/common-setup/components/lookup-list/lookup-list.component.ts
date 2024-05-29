import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FilterMetadata, LazyLoadEvent, MessageService } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { Subject, debounceTime } from 'rxjs';
import { DataFieldModel, DataFilterModel, GetLookupListQuery, LookupResponse, LookupsClient, SelectListsClient } from 'src/app/modules/generated-clients/api-service';

@Component({
  selector: 'app-lookup-list',
  templateUrl: './lookup-list.component.html',
  styleUrl: './lookup-list.component.scss',
  providers: [MessageService, LookupsClient, SelectListsClient]
})
export class LookupListComponent implements OnInit {

  // Table Settings //
  responsiveLayout = 'scroll';
  cols: any[] = []; // eta input diye anbo
  dataFields: DataFieldModel[] = [];

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
  globalFilterFields: string[] = ['code', 'name', 'parentName', 'status']; // eta input diye anbo



  // Row Selection
  selectionMode: "single" | "multiple" = "multiple";

  // Row Styles 
  rowHover: boolean = true;

  // Others
  dataKey: string = 'id';
  caption: string = 'Manage Lookup';

  statuses: any[] = [];

  // Dialog
  itemDialog: boolean = false;
  submitted: boolean = false;
  dialogWidth: number = 650;

  item: any = {};

  // LOOKUP
  items: any[] = [];
  selectedItems: any[] = [];


  //loading
  loading: boolean = false;


  // Dropdown
  parentList: any[] = [];
  statusList: any[] = [];

  selectedValue: any;


  @ViewChild('dt') table: Table;
  @ViewChild('globalSearchInput') globalSearchInput: ElementRef;
  debounceTimeout: number = 500;
  private searchSubject: Subject<string> = new Subject();

  constructor(
    private messageService: MessageService,
    private lookupsClient: LookupsClient,
    private selectListClient: SelectListsClient) {

    this.searchSubject.pipe(
      debounceTime(this.debounceTimeout)
    ).subscribe((searchText) => {
      this.onGlobalFilter(searchText);
    })
  }

  ngOnInit() {

    // this.loadData({first: 1, rows: this.rows})


    // this.getParentSelectList();
    this.statusList = this.getStatusSelectList();

  }

  get hasDropdownOrDateType(): boolean{
    return this.dataFields.some(col => col.dataType === 'dropdown');
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
    lookupQuery.filters = this.mapToDataFilterModel(event.filters);

    console.log(lookupQuery)

    this.lookupsClient.getLookups(lookupQuery).subscribe({
      next: (res) => {
        this.items = res.items;
        this.totalRecords = res.totalCount;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalCount;
        this.pageNumber = res.pageNumber;
        this.dataFields = res.dataFields;
        this.globalFilterFields = res.dataFields
          .filter(x => x.isGlobalFilterable)
          .map(x => x.dbField);

        this.currentPageReportTemplate = `Showing {first} to {last} of ${this.totalRecords} entries`;

        this.loading = false;
      },
      error: (error) => {
        console.error(error, 'Error while fetching lookups')
      }
    });
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
      return event.globalFilter;
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


  mapToDataFilterModel(filters: FilterDictionary): DataFilterModel[] {
    const dataFilterList: DataFilterModel[] = [];

    for (const field in filters) {

      if(field === 'global') continue;

      if (Object.prototype.hasOwnProperty.call(filters, field)) {
        const filterMetadata = filters[field];
        if (Array.isArray(filterMetadata)) {
          for (const filter of filterMetadata) {
            const dataFilter = new DataFilterModel();
            dataFilter.field = field;
            dataFilter.value = filter.value !== null ? filter.value.toString() : '';
            dataFilter.matchMode = filter.matchMode || '';
            dataFilter.operator = filter.operator || '';

            dataFilterList.push(dataFilter);
          }
        } else {
          const dataFilter = new DataFilterModel();
          dataFilter.field = field;
          dataFilter.value = filterMetadata.value !== null ? filterMetadata.value.toString() : '';
          dataFilter.matchMode = filterMetadata.matchMode || '';
          dataFilter.operator = filterMetadata.operator || '';
          dataFilterList.push(dataFilter);
        }
      }
    }
    return dataFilterList;
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


    ///  --------------------------------


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