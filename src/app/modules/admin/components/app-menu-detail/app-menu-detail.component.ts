import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonConstants } from 'src/app/core/contants/common';
import { CommonValidationMessage } from 'src/app/core/contants/forms-validaiton-msg';
import { AppMenusClient, AppUserModel, CreateAppMenuCommand, UpdateAppMenuCommand, AppMenuModel } from 'src/app/modules/generated-clients/api-service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { PrimengIcon } from 'src/app/shared/services/primeng-icon';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-app-menu-detail',
  templateUrl: './app-menu-detail.component.html',
  styleUrl: './app-menu-detail.component.scss',
  providers: [ToastService , AppMenusClient]
})
export class AppMenuDetailComponent  implements OnInit {
  VMsg = CommonValidationMessage;
  comConst = CommonConstants;
  optionDataSources = {};

  form: FormGroup;

  id: string = '';
  item: AppUserModel = new AppUserModel();

  get f() {
    return this.form.controls;
  }

  get isEdit(): boolean{
    return this.id && this.id != '00000000-0000-0000-0000-000000000000'
  }

  selectList(dsName: string){
    return this.optionDataSources[dsName];
  }

  primengIcons = PrimengIcon.primeIcons;

  private customDialogService: CustomDialogService = inject(CustomDialogService);
  private toast: ToastService = inject(ToastService);
  private fb: FormBuilder = inject(FormBuilder);

  private entityClient: AppMenusClient = inject(AppMenusClient);



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
    let createCommand = new CreateAppMenuCommand();
    createCommand = { ...this.form.value }
    this.entityClient.createMenu(createCommand).subscribe({
      next: () => {
        this.toast.created()
        this.customDialogService.close(true);
      },
      error: (error) => {
        console.log(error)
        this.toast.showError(error.errors[0]?.description)
      }
    });

  }

  private update() {
    let updateCommand = new UpdateAppMenuCommand();
    console.log(this.form.value)
    updateCommand = { ...this.form.value };
    console.log(updateCommand)
    this.entityClient.updateMenu(updateCommand).subscribe({
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
    this.entityClient.getAppMenu(id).subscribe({
      next: (res: AppMenuModel) => {
        this.item = res;
         this.optionDataSources = res.optionsDataSources;
         if(id && id !== this.comConst.EmptyGuid){
          this.form.patchValue({
            ...this.item
          });
         }
      }
    });
  }

  private initializeFormGroup() {
    this.form = this.fb.group({
      id: [''],
      label: ['', Validators.required],
      routerLink: ['', Validators.required],
      icon: [null],
      tooltip: [''],
      description: [''],
      isActive: [true],
      visible: [true],
      orderNo: [''],
      parentId: [null],
      menuTypeId: [null],
      test: ['test value']
    });

  }

}
