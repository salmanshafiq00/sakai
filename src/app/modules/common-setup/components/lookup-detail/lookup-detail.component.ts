import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonMessage } from 'src/app/core/contants/forms-validaiton-msg';
import { LookupResponse, SelectListModel, SelectListsClient } from 'src/app/modules/generated-clients/api-service';

@Component({
  selector: 'app-lookup-detail',
  templateUrl: './lookup-detail.component.html',
  styleUrl: './lookup-detail.component.scss',
  providers: [SelectListsClient, MessageService]
})
export class LookupDetailComponent {

  VMsg = CommonMessage;

  form: FormGroup;

  item: LookupResponse = new LookupResponse();

  parentList: SelectListModel[] = [];

  selectListClient: SelectListsClient = inject(SelectListsClient);
  messageService: MessageService = inject(MessageService);
  fb: FormBuilder = inject(FormBuilder);

  ngOnInit(){
    this.initializeFormGroup();
    this.getParentSelectList();
  }

  onSubmit(){
    console.log(this.form)
  }

  private getParentSelectList() {
    this.selectListClient.getLookupSelectList(true).subscribe({
      next: (res) => {
        this.parentList = res;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Parent Dropdown not found', life: 3000 })
      }
    });
  }

  private initializeFormGroup(){
    this.form = this.fb.group({
      id: [''],
      name: [''],
      code: [''],
      description: [''],
      status: [false],
      parentId: [''],
      created: [null]
    });
  }

}
