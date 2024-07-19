import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonConstants } from 'src/app/core/contants/common';
import { CommonValidationMessage } from 'src/app/core/contants/forms-validaiton-msg';
import { AppUserModel, CreateAppUserCommand, SelectListModel, SelectListsClient, UpdateAppUserCommand, UsersClient } from 'src/app/modules/generated-clients/api-service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { ToastService } from 'src/app/shared/services/toast.service';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
  providers: [ToastService, UsersClient]
})
export class UserDetailComponent implements OnInit {
  VMsg = CommonValidationMessage;
  comConst = CommonConstants;
  optionDataSources = {};

  form: FormGroup;

  id: string = '';
  item: AppUserModel = new AppUserModel();

  roleSelectList: SelectListModel[] = [];

  get f() {
    return this.form.controls;
  }

  get isEdit(): boolean {
    return this.id && this.id != '00000000-0000-0000-0000-000000000000'
  }

  selectList(dsName: string) {
    return this.optionDataSources[dsName];
  }

  private customDialogService: CustomDialogService = inject(CustomDialogService);
  private toast: ToastService = inject(ToastService);
  private fb: FormBuilder = inject(FormBuilder);

  private entityClient: UsersClient = inject(UsersClient);



  ngOnInit() {

    this.id = this.customDialogService.getConfigData();
    this.initializeFormGroup();
    this.getById(this.id);

    // if (!this.id || this.id === this.comConst.EmptyGuid) {
    //   this.getRoleSelectList();
    // }

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
    console.log(this.form.value)
    let createCommand = new CreateAppUserCommand();
    createCommand = { ...this.form.value }
    this.entityClient.createUser(createCommand).subscribe({
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
    let updateCommand = new UpdateAppUserCommand();
    updateCommand = { ...this.form.value };
    this.entityClient.updateUser(updateCommand).subscribe({
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
    this.entityClient.getUser(id).subscribe({
      next: (res: AppUserModel) => {
        this.item = res;
        console.log(res);
        this.optionDataSources = res.optionsDataSources;
        // const assignedRoles = this.optionDataSources['roleSelectList'].filter(role => res.roles.includes(role.name));
        this.form.patchValue({
          ...this.item,
          // roles: assignedRoles
        });
      }
    });
  }

  private initializeFormGroup() {
    this.form = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: [''],
      username: ['', Validators.required],
      email: [''],
      phoneNumber: [''],
      isActive: [true],
      password: [''],
      confirmPassword: [''],
      roles: [null]
    });

  }

}
