import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LookupListComponent } from "./components/lookup-list/lookup-list.component";

const routes: Routes = [
  {path: 'lookup', component: LookupListComponent}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonSetupRoutingModule{}

export const CommonSetupRoutingComponents = [
  LookupListComponent
]