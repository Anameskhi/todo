import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';

import { ListRoutingModule } from './list-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { ListComponent } from './list.component';



@NgModule({
  declarations: [


    
  ],
  imports: [
    CommonModule,
    ListRoutingModule,
    AsyncPipe
  ]
})
export class ListModule { }
