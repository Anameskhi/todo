import { NgModule, createComponent } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommoncompRoutingModule } from './commoncomp-routing.module';
import { CreateModule } from '../create/create.module';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    CommoncompRoutingModule,
    MatIconModule
    
  ]
})
export class CommoncompModule { }
