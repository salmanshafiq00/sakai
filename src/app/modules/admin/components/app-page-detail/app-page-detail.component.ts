import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonConstants } from 'src/app/core/contants/common';
import { CommonValidationMessage } from 'src/app/core/contants/forms-validaiton-msg';
import { LookupModel, LookupsClient, CreateLookupCommand, UpdateLookupCommand, AppPagesClient } from 'src/app/modules/generated-clients/api-service';
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

  item: LookupModel = new LookupModel();

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
      console.log(this.form)
      // this.save();
    } else {
      // this.update();
    }
  }

  // private save() {
  //   let createLookupCommand = new CreateLookupCommand();
  //   const selectedSubjects = this.form.get('subjects')?.value?.map(x => x.id) || [];
  //   const selectedRadioSubjects = this.form.get('subjectRadio')?.value?.id;
  //   createLookupCommand = { ...this.form.value, createdDate: '2023-06-06', subjects: selectedSubjects, subjectRadio:  selectedRadioSubjects}

  //   console.log(createLookupCommand);

  //   this.entityClient.createLookup(createLookupCommand).subscribe({
  //     next: () => {
  //       this.toast.created()
  //       this.customDialogService.close(true);
  //     },
  //     error: (error) => {
  //       this.toast.showError(error.errors[0]?.description)
  //       console.log(error);
  //     }
  //   });
  // }

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
      next: (res: LookupModel) => {
        this.item = res;
        this.optionDataSources = res.optionDataSources;
        this.form.patchValue(this.item);
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
  
  showPropertyStatus(field: any){
    return  field.get('showProperties')?.value;
  }
  createAppPageField(): FormGroup {
    return this.fb.group({
      id: [null],
      appPageId: [null],
      fieldName: ['', Validators.required],
      caption: [''],
      fieldType: [''],
      format: [''],
      cellTemplate: [''],
      textAlign: [''],
      position: [''],
      allowSort: [true],
      allowFilter: [false],
      filterType: [''],
      enableLink: [null],
      linkBaseUrl: [''],
      linkValueFieldName: [''],
      bgColor: [''],
      color: [''],
      isVisible: [true],
      sortOrder: [0],
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
    { 'id': 'time', 'name': 'Time' },
    { 'id': 'list', 'name': 'List' }
  ];

  alignSelectList = [
    { 'id': 'left', 'name': 'Left' },
    { 'id': 'centre', 'name': 'Centre' },
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

  controlTypeSelectList = [
    { 'id': 'check', 'name': 'CheckBox' },
    { 'id': 'terms-check', 'name': 'Acknowledgement' },
    { 'id': 'datagrid', 'name': 'DataGrid' },
    { 'id': 'datepicker', 'name': 'Date' },
    { 'id': 'multiselect', 'name': 'MultSelect' },
    { 'id': 'multiselect-tag', 'name': 'MultSelect-Tag' },
    { 'id': 'multiselect-detail', 'name': 'MultSelect-Detail' },
    { 'id': 'number', 'name': 'Number' },
    { 'id': 'password', 'name': 'Password' },
    { 'id': 'radio', 'name': 'RadioGroup' },
    { 'id': 'select', 'name': 'Dropdown' },
    { 'id': 'textbox', 'name': 'TextBox' },
    { 'id': 'serial', 'name': 'SerialAuto' },
    { 'id': 'textarea', 'name': 'TextArea' },
    { 'id': 'timepicker', 'name': 'Time' },
    { 'id': 'treelist', 'name': 'TreeList' },
    { 'id': 'treeselect', 'name': 'TreeSelect' },
    { 'id': 'tab', 'name': 'Tab' },
    { 'id': 'file', 'name': 'File' },
    { 'id': 'customcomponent', 'name': 'Component' },
    { 'id': 'htmleditor', 'name': 'HtmlEditor' },
    { 'id': 'commentcontrol', 'name': 'CommentControl' },
    { 'id': 'fileuploadcontrol', 'name': 'FileUploadControl' },
    { 'id': 'pdfviewer', 'name': 'PdfViewer' },
    { 'id': 'extendedpdfviewer', 'name': 'Extendedpdfviewer' },
    { 'id': 'posDatagrid', 'name': 'PosDatagrid' },
    { 'id': 'labelView', 'name': 'LabelView' },
    { 'id': 'dynamicselect', 'name': 'DynamicSelect' },
    { 'id': 'image', 'name': 'Image' },
    { 'id': 'multiplefileprogressbar', 'name': 'Multiplefileprogressbar' },
    { 'id': 'hrmmultiplefileprogressbar', 'name': 'HrmMultiplefileprogressbar' },
    { 'id': 'generalfileprogressbar', 'name': 'Generalfileprogressbar' },
    { 'id': 'datePickerTwelveHourFormat', 'name': 'DatePickerTwelveHourFormat' },
    { 'id': 'notificationcontrol', 'name': 'NotificationControl' },
    { 'id': 'activity', 'name': 'Activity' },
  ];

}
