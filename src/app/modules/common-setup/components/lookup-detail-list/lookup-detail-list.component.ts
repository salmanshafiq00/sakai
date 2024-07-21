import { Component } from '@angular/core';
import { LookupDetailDetailComponent } from '../lookup-detail-detail/lookup-detail-detail.component';
import { LookupDetailsClient, } from 'src/app/modules/generated-clients/api-service';


@Component({
  selector: 'app-lookup-detail-list',
  templateUrl: './lookup-detail-list.component.html',
  styleUrl: './lookup-detail-list.component.scss',
  providers: [LookupDetailsClient]

})
export class LookupDetailListComponent  {
  detailComponent = LookupDetailDetailComponent;
  getFuncName = 'getLookupDetails';

  constructor(public entityClient: LookupDetailsClient) {
      
  }
}