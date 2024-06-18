import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserListComponent } from "./components/user-list/user-list.component";
import { RoleListComponent } from "./components/role-list/role-list.component";
import { UserDetailComponent } from "./components/user-detail/user-detail.component";
import { RoleDetailComponent } from "./components/role-detail/role-detail.component";
import { AppMenuListComponent } from "./components/app-menu-list/app-menu-list.component";
import { AppMenuDetailComponent } from "./components/app-menu-detail/app-menu-detail.component";

const routes: Routes = [
  {path: 'users', component: UserListComponent},
  {path: 'roles', component: RoleListComponent},
  {path: 'app-menus', component: AppMenuListComponent},
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
  AppMenuDetailComponent

]