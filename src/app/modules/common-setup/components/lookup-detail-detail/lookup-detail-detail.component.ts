import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonConstants } from 'src/app/core/contants/common';
import { CommonValidationMessage } from 'src/app/core/contants/forms-validaiton-msg';
import { LookupModel, LookupDetailsClient, CreateLookupDetailCommand, UpdateLookupDetailCommand, LookupDetailModel } from 'src/app/modules/generated-clients/api-service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-lookup-detail-detail',
  templateUrl: './lookup-detail-detail.component.html',
  styleUrl: './lookup-detail-detail.component.scss',
  providers: [ToastService, LookupDetailsClient]
})
export class LookupDetailDetailComponent implements OnInit {
  VMsg = CommonValidationMessage;
  comConst = CommonConstants;
  optionDataSources = {};

  form: FormGroup;

  id: string = '';
  item: LookupModel = new LookupModel();

  get f() {
    return this.form.controls;
  }

  private customDialogService: CustomDialogService = inject(CustomDialogService);
  private toast: ToastService = inject(ToastService);
  private fb: FormBuilder = inject(FormBuilder);

  private entityClient: LookupDetailsClient = inject(LookupDetailsClient);

  ngOnInit() {
    this.id = this.customDialogService.getConfigData(); 
    this.initializeFormGroup();
    this.getById(this.id);
  }

  onSubmit() {
    if (!this.id || this.id === this.comConst.EmptyGuid) {
      this.save();
    } else {
      this.update();
    }
  }

  cancel() {
    this.customDialogService.close(false);
  }

  private save() {
    let createLookupCommand = new CreateLookupDetailCommand();
    createLookupCommand = { ...this.form.value }

    this.entityClient.create(createLookupCommand).subscribe({
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
    let updateLookupCommand = new UpdateLookupDetailCommand();
    updateLookupCommand = { ...this.form.value }

    this.entityClient.update(updateLookupCommand).subscribe({
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

  private getById(id: string) {
    this.entityClient.get(id).subscribe({
      next: (res: LookupDetailModel) => {
        this.item = res;
        this.optionDataSources = res.optionDataSources;
        console.log(res);
        this.form.patchValue(this.item);
      }
    });
  }

  private initializeFormGroup() {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: [''],
      status: [false],
      parentId: [null],
      lookupId: [null],
    });
  }

}
