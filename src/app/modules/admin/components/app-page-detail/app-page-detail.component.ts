import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonConstants } from 'src/app/core/contants/common';
import { CommonValidationMessage } from 'src/app/core/contants/forms-validaiton-msg';
import { AppPagesClient, UpsertAppPageCommand, AppPageModel } from 'src/app/modules/generated-clients/api-service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
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
    'appPageFields': []
  };

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
      // this.update();
    }
  }

  private save() {
    let createCommand = new UpsertAppPageCommand();
    createCommand = { ...this.form.value }
    this.pageLayout.appPageFields = this.form.get('appPageFields').value;
    createCommand.appPageLayout = JSON.stringify(this.pageLayout);
    console.log(createCommand);

    this.entityClient.upsertPage(createCommand).subscribe({
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

  // private update() {
  //   let updateLookupCommand = new UpdateLookupCommand();
  //   updateLookupCommand = { ...this.form.value }
  //   this.entityClient.updateLookup(updateLookupCommand).subscribe({
  //     next: () => {
  //       this.toast.updated()
  //       this.customDialogService.close(true);
  //     },
  //     error: (error) => {
  //       this.toast.showError(error.errors[0]?.description)
  //       console.log(error);
  //     }
  //   });
  // }

  private getById(id: any) {
    this.entityClient.getAppPage(id).subscribe({
      next: (res: AppPageModel) => {
        // this.optionDataSources = res.optionDataSources;
        if (id && id !== CommonConstants.EmptyGuid) {
          this.pageLayout = JSON.parse(res.appPageLayout)
          console.log(this.pageLayout);
          this.item = res;
          this.item.appPageFields = this.pageLayout.appPageFields;
          console.log(this.item)
          this.form.patchValue(this.item);
        } else {
          this.item.id = this.id;
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
      routerLink: [''],
      name: ['', Validators.required],
      permission: [''],
      isActive: [false],
      active: [''],
      appPageLayout: [''],
      appPageFields: this.fb.array([])
    });
  }

  get appPageFields(): FormArray {
    return this.form.get('appPageFields') as FormArray;
  }

  addAppPageField(): void {
    this.appPageFields.push(this.createAppPageField());
  }

  removeAppPageField(index: number): void {
    this.appPageFields.removeAt(index);
  }

  showPropertyStatus(field: any) {
    return field.get('showProperties')?.value;
  }
  createAppPageField(): FormGroup {
    return this.fb.group({
      id: [null],
      appPageId: [null],
      fieldName: ['', Validators.required],
      caption: [''],
      fieldType: ['string'],
      dbField: [''],
      format: [''],
      textAlign: ['center'],
      isSortable: [true],
      isFilterable: [false],
      IsGlobalFilterable: [false],
      filterType: [null],
      dSName: [''],
      enableLink: [false],
      linkBaseUrl: [''],
      linkValueFieldName: [''],
      bgColor: [''],
      color: [''],
      isVisible: [true],
      sortOrder: [1],
      isActive: [true],
      showProperties: [true],
    });
  }

  showProperty(field: AbstractControl, show: boolean): void {
    field.get('showProperties')?.setValue(show);
  }

  fieldTypeSelectList = [
    { 'id': 'string', 'name': 'String' },
    { 'id': 'number', 'name': 'Number' },
    { 'id': 'date', 'name': 'Date' },
    { 'id': 'datetime', 'name': 'Date Time' },
    { 'id': 'daterange', 'name': 'Date Range' },
    { 'id': 'time', 'name': 'Time' },
    { 'id': 'list', 'name': 'List' }
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

}
