import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonConstants } from 'src/app/core/contants/common';
import { CommonValidationMessage } from 'src/app/core/contants/forms-validaiton-msg';
import { AppPagesClient, AppPageModel, CreateAppPageCommand, UpdateAppPageCommand } from 'src/app/modules/generated-clients/api-service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { PrimengIcon } from 'src/app/shared/services/primeng-icon';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-app-page-detail',
  templateUrl: './app-page-detail.component.html',
  styleUrl: './app-page-detail.component.scss',
  providers: [ToastService, AppPagesClient]
})
export class AppPageDetailComponent implements OnInit {
  VMsg = CommonValidationMessage;
  comConst = CommonConstants;
  optionDataSources = {};
  form: FormGroup;
  id: string = '';

  item: AppPageModel = new AppPageModel();

  pageLayout: any = {
    'appPageActions': [],
    'appPageFields': [],
    'showRowActionCol': true,
    'rowActionType': 'button',
    'rowActions': []
  };

  primengIcons = PrimengIcon.primeIcons;

  get f() {
    return this.form?.controls;
  }

  public customDialogService: CustomDialogService = inject(CustomDialogService);
  private toast: ToastService = inject(ToastService);
  private fb: FormBuilder = inject(FormBuilder);

  private entityClient: AppPagesClient = inject(AppPagesClient);

  ngOnInit() {
    this.id = this.customDialogService.getConfigData();
    this.initializeFormGroup();
    this.getById(this.id);
  }

  cancel() {
    this.customDialogService.close(false);
  }

  onSubmit() {
    if (!this.id || this.id === this.comConst.EmptyGuid) {
      console.log(this.form.value)
      this.save();
    } else {
      this.update();
    }
  }

  private save() {
    let createCommand = new CreateAppPageCommand();
    createCommand = { ...this.form.value }
    this.pageLayout.appPageFields = this.form.get('appPageFields').value;
    this.pageLayout.appPageActions = this.form.get('appPageActions').value;
    this.pageLayout.showRowActionCol = this.form.get('showRowActionCol').value;
    this.pageLayout.rowActionType = this.form.get('rowActionType').value;
    this.pageLayout.rowActions = this.form.get('rowActions').value;

    this.pageLayout.appPageFields.forEach(value => value.showProperties = false);
    this.pageLayout.appPageActions.forEach(value => value.showProperties = false);
    this.pageLayout.rowActions.forEach(value => value.showProperties = false);
    this.pageLayout.appPageFields = this.pageLayout.appPageFields.sort((a, b) => (a.sortOrder < b.sortOrder) ? -1 : 1);
    this.pageLayout.appPageActions = this.pageLayout.appPageActions.sort((a, b) => (a.sortOrder < b.sortOrder) ? -1 : 1);
    this.pageLayout.rowActions = this.pageLayout.rowActions.sort((a, b) => (a.sortOrder < b.sortOrder) ? -1 : 1);

    createCommand.appPageLayout = JSON.stringify(this.pageLayout);
    console.log(createCommand);

    this.entityClient.createAppPage(createCommand).subscribe({
      next: () => {
        this.toast.created()
        this.customDialogService.close(true);
      },
      error: (error) => {
        this.toast.showError(error.errors[0]?.description)
        console.log(error);
      }
    });
  }

  private update() {
    let command = new UpdateAppPageCommand();
    command = { ...this.form.value }
    this.pageLayout.appPageFields = this.form.get('appPageFields').value;
    this.pageLayout.appPageActions = this.form.get('appPageActions').value;
    this.pageLayout.showRowActionCol = this.form.get('showRowActionCol').value;
    this.pageLayout.rowActionType = this.form.get('rowActionType').value;
    this.pageLayout.rowActions = this.form.get('rowActions').value;

    this.pageLayout.appPageFields.forEach(value => value.showProperties = false);
    this.pageLayout.appPageActions.forEach(value => value.showProperties = false);
    this.pageLayout.rowActions.forEach(value => value.showProperties = false);
    this.pageLayout.appPageFields = this.pageLayout.appPageFields.sort((a, b) => (a.sortOrder < b.sortOrder) ? -1 : 1);
    this.pageLayout.appPageActions = this.pageLayout.appPageActions.sort((a, b) => (a.sortOrder < b.sortOrder) ? -1 : 1);
    this.pageLayout.rowActions = this.pageLayout.rowActions.sort((a, b) => (a.sortOrder < b.sortOrder) ? -1 : 1);

    command.appPageLayout = JSON.stringify(this.pageLayout);
    console.log(command);

    this.entityClient.updateAppPage(command).subscribe({
      next: () => {
        this.toast.created()
        this.customDialogService.close(true);
      },
      error: (error) => {
        this.toast.showError(error.errors[0]?.description)
        console.log(error);
      }
    });
  }

  private getById(id: any) {
    this.entityClient.getAppPage(id).subscribe({
      next: (res: AppPageModel) => {
        if (id && id !== CommonConstants.EmptyGuid) {
          this.pageLayout = JSON.parse(res.appPageLayout)
          this.item = res;
          this.item.appPageFields = this.pageLayout.appPageFields || [];
          this.item.appPageActions = this.pageLayout.appPageActions || [];
          this.item.rowActions = this.pageLayout.rowActions || [];
          this.item.appPageFields?.forEach(() => {
            this.addAppPageField();
          });
          this.item.appPageActions?.forEach(() => {
            this.addAppPageAction();
          });
          this.item.rowActions?.forEach(() => {
            this.addRowAction();
          })
          console.log(this.item)
          this.form.patchValue(this.item);
        } else {
          console.log('new create')
          this.item.id = this.id;
          this.defaultAppPageAction();
          this.form.patchValue(this.item);
        }
      },
      error: (error) => {
        console.log(error)
        this.toast.showError(error)
      }
    });
  }

  private initializeFormGroup() {
    this.form = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      subTitle: [''],
      componentName: ['', Validators.required],
      appPageLayout: [''],
      appPageFields: this.fb.array([]),
      appPageActions: this.fb.array([]),
      showRowActionCol: [true],
      rowActionType: ['button'],
      rowActions: this.fb.array([])
    });
  }
  showProperty(field: AbstractControl, show: boolean): void {
    field.get('showProperties')?.setValue(show);
  }


  showPropertyStatus(field: any) {
    return field.get('showProperties')?.value;
  }

  // App Page Toolbar Actions //

  get appPageActions(): FormArray {
    return this.form.get('appPageActions') as FormArray;
  }


  addAppPageAction(): void {
    this.appPageActions.push(this.createAppPageAction());
  }

  removeAppPageAction(index: number): void {
    this.appPageActions.removeAt(index);
  }

  private createAppPageAction(): FormGroup {
    const atn_id = 'atn_' + this.newGuid();
    const sortOrder = this.appPageActions?.length + 1 ?? 1;
    return this.fb.group({
      id: [atn_id],
      actionName: ['', Validators.required],
      actionType: ['button', Validators.required],
      caption: [''],
      icon: [null],
      permissions: [''],
      functionName: [''],
      navigationUrl: [''],
      position: ['left'],
      severity: ['primary'],
      sortOrder: [sortOrder],
      isVisible: [true],
      showCaption: [true],
      ParentId: [null],
      showProperties: [true]
    });
  }

  private defaultAppPageAction() {
    const atn_id_1 = 'atn_' + this.newGuid();
    const atn_id_2 = 'atn_' + this.newGuid();
    const appPageActions = this.fb.array([
      this.fb.group({
        id: [atn_id_1],
        actionName: ['new', Validators.required],
        actionType: ['button', Validators.required],
        caption: ['New'],
        icon: ['pi pi-plus'],
        permissions: [''],
        functionName: [''],
        navigationUrl: [''],
        position: ['left'],
        severity: ['success'],
        sortOrder: [1],
        isVisible: [true],
        showCaption: [true],
        ParentId: [null],
        showProperties: [false]
      }),
      this.fb.group({
        id: [atn_id_2],
        actionName: ['refresh', Validators.required],
        actionType: ['button', Validators.required],
        caption: ['Refresh'],
        icon: ['pi pi-sync'],
        permissions: [''],
        functionName: [''],
        navigationUrl: [''],
        position: ['left'],
        severity: ['help'],
        sortOrder: [2],
        isVisible: [true],
        showCaption: [true],
        ParentId: [null],
        showProperties: [false]
      })
    ]);
  
    this.form.setControl('appPageActions', appPageActions);
  }

  // Row Action //

  get rowActions(): FormArray{
    return this.form.get('rowActions') as FormArray;
  }

  addRowAction(): void {
    this.rowActions.push(this.createRowAction());
  }

  removeRowAction(index: number): void {
    this.rowActions.removeAt(index);
  }
  
  private createRowAction(): FormGroup {
    const ract_id = 'ract_' + this.newGuid();
    const sortOrder = this.rowActions?.length + 1 ?? 1;
    return this.fb.group({
      id: [ract_id],
      actionName: ['', Validators.required],
      caption: [''],
      icon: [null],
      permissions: [''],
      functionName: [''],
      navigationUrl: [''],
      severity: ['primary'],
      sortOrder: [sortOrder],
      isVisible: [true],
      showCaption: [true],
      showProperties: [true]
    });
  }

  // App Page Fields //

  get appPageFields(): FormArray {
    return this.form.get('appPageFields') as FormArray;
  }

  addAppPageField(): void {
    this.appPageFields.push(this.createAppPageField());
  }

  removeAppPageField(index: number): void {
    this.appPageFields.removeAt(index);
  }

  createAppPageField(): FormGroup {
    const fld_id = 'fld_' + this.newGuid();
    const sortOrder = this.appPageFields?.length + 1 ?? 1;
    return this.fb.group({
      id: [fld_id],
      field: ['', Validators.required],
      header: [''],
      fieldType: ['string'],
      dbField: [''],
      format: [''],
      textAlign: ['center'],
      isSortable: [true],
      isFilterable: [false],
      isGlobalFilterable: [false],
      filterType: [null],
      dSName: [''],
      enableLink: [false],
      linkBaseUrl: [''],
      linkValueFieldName: [''],
      bgColor: [''],
      color: [''],
      isVisible: [true],
      isActive: [true],
      sortOrder: [sortOrder],
      showProperties: [true],
    });
  }



  private newGuid() {
    return 'xxx4x'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  fieldTypeSelectList = [
    { 'id': 'string', 'name': 'String' },
    { 'id': 'select', 'name': 'Select' },
    { 'id': 'multiselect', 'name': 'Multi-Select' },
    { 'id': 'date', 'name': 'Date' },
    { 'id': 'datetime', 'name': 'Date Time' },
    { 'id': 'daterange', 'name': 'Date Range' },
    { 'id': 'time', 'name': 'Time' },
    { 'id': 'number', 'name': 'Number' }
  ];

  alignSelectList = [
    { 'id': 'left', 'name': 'Left' },
    { 'id': 'center', 'name': 'Center' },
    { 'id': 'right', 'name': 'Right' }
  ];

  filterSelectList = [
    { 'id': 'contains', 'name': 'Contains' },
    { 'id': 'equal', 'name': 'Equal' },
    { 'id': 'select', 'name': 'Select' },
    { 'id': 'range', 'name': 'Range' },
    { 'id': 'multi-select', 'name': 'Multi-Select' }
  ];

  actionButtonsPositionSelectList = [
    { 'id': 'left', 'name': 'Left' },
    { 'id': 'right', 'name': 'Right' },
    { 'id': 'topright', 'name': 'Top-Right' }
  ];

  actionTypeSelectList = [
    { 'id': 'button', 'name': 'Button' },
    { 'id': 'dropdown', 'name': 'Dropdown' },
    { 'id': 'upload', 'name': 'Upload' }
  ];

  severitySelectList = [
    { 'id': 'primary', 'name': 'Primary' },
    { 'id': 'secondary', 'name': 'Decondary' },
    { 'id': 'success', 'name': 'Success' },
    { 'id': 'info', 'name': 'Info' },
    { 'id': 'warning', 'name': 'Warning' },
    { 'id': 'help', 'name': 'Help' },
    { 'id': 'danger', 'name': 'Danger' },
    { 'id': 'contrast', 'name': 'Contrast' }
  ];
}
