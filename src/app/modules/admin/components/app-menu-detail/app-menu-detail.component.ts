import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonConstants } from 'src/app/core/contants/common';
import { CommonValidationMessage } from 'src/app/core/contants/forms-validaiton-msg';
import { AppMenusClient, AppUserModel, CreateAppMenuCommand, UpdateAppMenuCommand, AppMenuModel, TreeNodeListsClient } from 'src/app/modules/generated-clients/api-service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { PrimengIcon } from 'src/app/shared/services/primeng-icon';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-app-menu-detail',
  templateUrl: './app-menu-detail.component.html',
  styleUrl: './app-menu-detail.component.scss',
  providers: [ToastService, TreeNodeListsClient, AppMenusClient]
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

  private treeNodeListsClient: TreeNodeListsClient = inject(TreeNodeListsClient);
  private entityClient: AppMenusClient = inject(AppMenusClient);



  ngOnInit() {

    this.id = this.customDialogService.getConfigData();
    this.initializeFormGroup();

    if (this.id && this.id !== this.comConst.EmptyGuid) {
      this.getById(this.id);
    }

    if (!this.id || this.id === this.comConst.EmptyGuid) {
      this.GetAllAppMenuTreeSelectList();
    }

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
    let createCommand = new CreateAppMenuCommand();
    createCommand = { ...this.form.value }
    createCommand.parentId = this.form.get('parentId')?.value?.key;
    console.log(createCommand)
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
    updateCommand = { ...this.form.value };
    updateCommand.parentId = this.form.get('parentId')?.value?.key;

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
        console.log(res);
         this.optionDataSources = res.optionsDataSources;
        const selectedParent = this.optionDataSources['parentTreeSelectList'].find(x => x.key?.toLowerCase() == res.parentId?.toLowerCase());
        // const selectedIcon = this.primengIcons.find(x => x.value?.toLowerCase() == res.icon?.toLowerCase());
        this.form.patchValue({
          ...this.item,
          parentId: selectedParent
        });
      }
    });
  }

  private initializeFormGroup() {
    this.form = this.fb.group({
      id: [''],
      label: ['', Validators.required],
      url: ['', Validators.required],
      icon: [null],
      tooltip: [''],
      description: [''],
      isActive: [true],
      visible: [true],
      orderNo: [''],
      parentId: [null]
    });

  }



  private GetAllAppMenuTreeSelectList() {
    this.treeNodeListsClient.getAllAppMenuTreeSelectList(false).subscribe({
      next: (res) => {
        this.optionDataSources['parentTreeSelectList'] = res;
      },
      error: (error) => {
          console.log(error)
      }
    });
  }

}
