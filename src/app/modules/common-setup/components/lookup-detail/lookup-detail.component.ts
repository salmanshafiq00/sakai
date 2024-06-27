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
    createLookupCommand = { ...this.form.value }
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
      parentId: [null],
      created: [null],
      balance: [null]
    });
  }

}
