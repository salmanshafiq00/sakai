import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserListComponent } from "./components/user-list/user-list.component";
import { RoleListComponent } from "./components/role-list/role-list.component";
import { UserDetailComponent } from "./components/user-detail/user-detail.component";
import { RoleDetailComponent } from "./components/role-detail/role-detail.component";
import { AppMenuListComponent } from "./components/app-menu-list/app-menu-list.component";
import { AppMenuDetailComponent } from "./components/app-menu-detail/app-menu-detail.component";
import { AppPageDetailComponent } from "./components/app-page-detail/app-page-detail.component";
import { AppPageListComponent } from "./components/app-page-list/app-page-list.component";

const routes: Routes = [
  {path: 'users', component: UserListComponent},
  {path: 'roles', component: RoleListComponent},
  {path: 'app-menus', component: AppMenuListComponent},
  {path: 'app-pages', component: AppPageListComponent},
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class AdminRoutingModule{

}

export const adminRoutingComponents = [
  UserListComponent,
  UserDetailComponent,
  RoleListComponent,
  RoleDetailComponent,
  AppMenuListComponent,
  AppMenuDetailComponent,
  AppPageListComponent,
  AppPageDetailComponent

]