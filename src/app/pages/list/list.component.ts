import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { ITodo } from 'src/app/common/interfaces/todo.interface';
import { TodoService } from 'src/app/common/services/todo.service';
import {  MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [CdkDropList, NgFor, CdkDrag,MatIconModule],
})
export class ListComponent implements OnInit{
  todo: ITodo[] = [];
  inProgress: ITodo[] = [];
  done: ITodo[] = [];
   
   todos = this.todoService.todosSub.subscribe(res=>{this.todo.push(res)})

  drop(event: CdkDragDrop<ITodo[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }


 
  constructor(
    private todoService: TodoService
  ){}

  ngOnInit(): void {
   this.getTodo()
  }



  getTodo(){
    this.todoService.getTodos().subscribe(res =>this.todo = res)
  }

  delete(){
    console.log('delete')
  }
}
