import { Component } from '@angular/core';
import { AppPageDetailComponent } from '../app-page-detail/app-page-detail.component';
import { AppPagesClient } from 'src/app/modules/generated-clients/api-service';

@Component({
  selector: 'app-app-page-list',
  templateUrl: './app-page-list.component.html',
  styleUrl: './app-page-list.component.scss',
  providers: [AppPagesClient]
})
export class AppPageListComponent {
  detailComponent = AppPageDetailComponent;
  getFuncName = 'getAppPages';
  caption = 'Manage Application Page'

  constructor(public entityClient: AppPagesClient){
    
  }
}
