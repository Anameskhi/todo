import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './features/components/navbar/navbar.component';
import { MainLayoutComponent } from './features/main-layout.component';

const routes: Routes = [
  {
  path: '',
  component: MainLayoutComponent,
  children: [

  {
    path: '',
    loadChildren: () => import('./pages/create/create.module').then(m=>m.CreateModule)
  }


]
  }
]
  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
