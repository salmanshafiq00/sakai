import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonConstants } from 'src/app/core/contants/common';
import { CommonValidationMessage } from 'src/app/core/contants/forms-validaiton-msg';
import { CreateLookupCommand, LookupModel, LookupsClient, UpdateLookupCommand } from 'src/app/modules/generated-clients/api-service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-lookup-detail',
  templateUrl: './lookup-detail.component.html',
  styleUrl: './lookup-detail.component.scss',
  providers: [ToastService]
})
export class LookupDetailComponent implements OnInit {
  VMsg = CommonValidationMessage;
  comConst = CommonConstants;
  optionDataSources = {};
  form: FormGroup;
  id: string = '';

  item: LookupModel = new LookupModel();

  get f() {
    return this.form.controls;
  }

  fc(controlName: string): FormControl{
    return this.form.get(controlName) as FormControl;
  }

  private customDialogService: CustomDialogService = inject(CustomDialogService);
  private toast: ToastService = inject(ToastService);
  private fb: FormBuilder = inject(FormBuilder);

  private entityClient: LookupsClient = inject(LookupsClient);

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
      // this.save();
    } else {
      this.update();
    }
  }

  private save() {
    let createLookupCommand = new CreateLookupCommand();
    const selectedSubjects = this.form.get('subjects')?.value?.map(x => x.id) || [];
    const selectedRadioSubjects = this.form.get('subjectRadio')?.value?.id;
    createLookupCommand = { ...this.form.value, createdDate: '2023-06-06', subjects: selectedSubjects, subjectRadio:  selectedRadioSubjects}
    this.entityClient.createLookup(createLookupCommand).subscribe({
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
    let updateLookupCommand = new UpdateLookupCommand();
    updateLookupCommand = { ...this.form.value }
    this.entityClient.updateLookup(updateLookupCommand).subscribe({
      next: () => {
        this.toast.updated()
        this.customDialogService.close(true);
      },
      error: (error) => {
        this.toast.showError(error.errors[0]?.description)
        console.log(error);
      }
    });
  }

  private getById(id: any) {
    this.entityClient.getLookup(id).subscribe({
      next: (res: LookupModel) => {
        this.item = res;
        this.optionDataSources = res.optionDataSources;
        this.item.subjects = this.optionDataSources['subjectSelectList']?.filter(x => this.item.subjects.includes(x.id));
        this.item.subjectRadio = this.optionDataSources['subjectRadioSelectList']?.find(x => this.item.subjectRadio === x.id);
        console.log(this.item)
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
      id: [''],
      name: ['', Validators.required],
      code: ['codes', [Validators.required]],
      description: ['', Validators.required],
      status: [false],
      parentId: [null, Validators.required],
      createdDate: [null, Validators.required],
      createdTime: [null, Validators.required],
      created: [null, Validators.required],
      createdYear: [null],
      balance: [null, Validators.required],
      round: [null, Validators.required],
      tk: [null, Validators.required],
      subjects: [null, Validators.required],
      subjectRadio: [null, Validators.required],
      multiParent: [null, Validators.required],
    });
  }


}
