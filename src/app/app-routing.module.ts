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
      redirectTo: 'create',
      pathMatch: 'full'
    },

  {
    path: 'create',
    loadChildren: () => import('./pages/commoncomp/commoncomp.module').then(m=>m.CommoncompModule)
  },
  {
    path: 'update/:id',
    loadChildren: () => import('./pages/commoncomp/commoncomp.module').then(m=>m.CommoncompModule)
  }


]
  }
]
  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
