import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { CommonConstants } from 'src/app/core/contants/common';
import { CommonValidationMessage } from 'src/app/core/contants/forms-validaiton-msg';
import { CreateRoleCommand, RolesClient, TreeNodeListsClient, UpdateRoleCommand, RoleModel } from 'src/app/modules/generated-clients/api-service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrl: './role-detail.component.scss',
  providers: [ToastService, TreeNodeListsClient, RolesClient]
})
export class RoleDetailComponent {
  VMsg = CommonValidationMessage;
  comConst = CommonConstants;
  optionDataSources = {};

  form: FormGroup;

  id: string = '';
  item: RoleModel = new RoleModel();

  selectedPermissions: TreeNode[] = [];
  selectedAppMenus: TreeNode[] = [];

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

  private nodeListClient: TreeNodeListsClient = inject(TreeNodeListsClient);
  private entityClient: RolesClient = inject(RolesClient);



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
    let createCommand = new CreateRoleCommand();
    createCommand = { ...this.form.value }
    this.entityClient.create(createCommand).subscribe({
      next: () => {
        this.toast.created()
        this.customDialogService.close(true);
      },
      error: (error) => {
        this.toast.showError(error.errors[0]?.description)
      }
    });

  }

  private update() {
    let updateCommand = new UpdateRoleCommand();
    updateCommand = { ...this.form.value };
    this.entityClient.updateRole(updateCommand).subscribe({
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
    this.entityClient.getRole(id).subscribe({
      next: (res: RoleModel) => {
        this.item = res;
        console.log(res);
        this.optionDataSources = res.optionsDataSources;
        this.form.patchValue({
          ...this.item
        });
      }
    });
  }

  private initializeFormGroup() {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      permissions: [null],
      roleMenus: [null],
    });

  }

  selectNodes(nodes: TreeNode[], selectedLabels: string[]) {
    nodes.forEach(node => {
      if (selectedLabels.includes(node.key!)) {  // Ensure label is not undefined
        this.selectedAppMenus.push(node);
      }
      if (node.children) {
        this.selectNodes(node.children, selectedLabels);
      }
    });
  }

  selectNodesByLabel(nodes: TreeNode[], selectedLabels: string[]) {
    nodes.forEach(node => {
      if (selectedLabels.includes(node.label!)) {  // Ensure label is not undefined
        this.selectedPermissions.push(node);
      }
      if (node.children) {
        this.selectNodesByLabel(node.children, selectedLabels);
      }
    });
  }

  updateParentSelection(nodes: TreeNode[], selectedNodes: TreeNode[]) {
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        this.updateParentSelection(node.children, selectedNodes);  // Recursively update child nodes
        const totalChildren = node.children.length;
        const selectedChildren = node.children.filter(child => selectedNodes.includes(child)).length;
        if (selectedChildren === totalChildren) {
          // All children are selected, mark parent as selected
          if (!selectedNodes.includes(node)) {
            selectedNodes.push(node);
          }
          node.partialSelected = false;
        } else if (selectedChildren > 0) {
          // Some children are selected, mark parent as partially selected
          node.partialSelected = true;
          // Ensure parent is not fully selected if partially selected
          const parentIndex = selectedNodes.indexOf(node);
          if (parentIndex !== -1) {
            selectedNodes.splice(parentIndex, 1);
          }
        } else {
          // No children are selected, ensure parent is not selected
          node.partialSelected = false;
          const parentIndex = selectedNodes.indexOf(node);
          if (parentIndex !== -1) {
            selectedNodes.splice(parentIndex, 1);
          }
        }
      }
    });
  }





}
