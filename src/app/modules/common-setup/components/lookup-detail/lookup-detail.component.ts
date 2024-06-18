import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonConstants } from 'src/app/core/contants/common';
import { CommonValidationMessage } from 'src/app/core/contants/forms-validaiton-msg';
import { CreateLookupCommand, LookupModel, LookupsClient, SelectListModel, SelectListsClient, UpdateLookupCommand } from 'src/app/modules/generated-clients/api-service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-lookup-detail',
  templateUrl: './lookup-detail.component.html',
  styleUrl: './lookup-detail.component.scss',
  providers: [ToastService]
})
export class LookupDetailComponent {

  submitted: boolean = true;

  VMsg = CommonValidationMessage;
  comConst = CommonConstants;

  form: FormGroup;

  id: string = '';
  item: LookupModel = new LookupModel();

  parentList: SelectListModel[] = [];

  get f() {
    return this.form.controls;
  }

  private customDialogService: CustomDialogService = inject(CustomDialogService);
  private toast: ToastService = inject(ToastService);
  private fb: FormBuilder = inject(FormBuilder);

  private selectListClient: SelectListsClient = inject(SelectListsClient);
  private lookupsClient: LookupsClient = inject(LookupsClient);



  ngOnInit() {

    this.id = this.customDialogService.getConfigData(); // get the passed data (id)
    this.initializeFormGroup();

    if (this.id && this.id !== this.comConst.EmptyGuid) {
      this.getById(this.id);
    }

    this.getParentSelectList();
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
    this.submitted = true;
    let createLookupCommand = new CreateLookupCommand();
    createLookupCommand = { ...this.form.value }

    this.lookupsClient.createLookup(createLookupCommand).subscribe({
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
    this.submitted = true;
    let updateLookupCommand = new UpdateLookupCommand();
    updateLookupCommand = { ...this.form.value }

    this.lookupsClient.updateLookup(updateLookupCommand).subscribe({
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

  private getParentSelectList() {
    this.selectListClient.getLookupSelectList(false).subscribe({
      next: (res) => {
        this.parentList = res;
      }
    });
  }

  private getById(id: string) {
    this.lookupsClient.getLookup(id).subscribe({
      next: (res: LookupModel) => {
        this.item = res;
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
      created: [null]
    });
  }

}
