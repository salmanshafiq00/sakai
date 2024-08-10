import { Component, Inject, OnInit } from '@angular/core';
import {  Validators } from '@angular/forms';
import { LookupDetailsClient } from 'src/app/modules/generated-clients/api-service';
import { BaseDetailComponent } from 'src/app/shared/components/base-detail/base-detail.component';
import { ENTITY_CLIENT } from 'src/app/shared/injection-tokens/tokens';

@Component({
  selector: 'app-lookup-detail-detail',
  templateUrl: './lookup-detail-detail.component.html',
  styleUrl: './lookup-detail-detail.component.scss',
  providers: [ {provide: ENTITY_CLIENT, useClass: LookupDetailsClient}]
})
export class LookupDetailDetailComponent extends BaseDetailComponent {
  
  constructor(@Inject(ENTITY_CLIENT) entityClient: LookupDetailsClient){
    super(entityClient)
  }

  override initializeFormGroup() {
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
