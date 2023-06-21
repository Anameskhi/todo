import { NgModule, createComponent } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './features/components/navbar/navbar.component';
import { MainLayoutComponent } from './features/main-layout.component';
import {  MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { CreateModule } from './pages/create/create.module';
import { ListComponent } from './pages/list/list.component';
import { CommonComponent } from './pages/commoncomp/common.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './pages/confirmation-dialog/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TodoDialogComponent } from './pages/todo-dialog/todo-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainLayoutComponent,
    CommonComponent,
    ConfirmationDialogComponent,
    TodoDialogComponent
 


  ], 
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    DragDropModule,
    CreateModule,
    ListComponent,
    AsyncPipe,
    MatDialogModule
    
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
