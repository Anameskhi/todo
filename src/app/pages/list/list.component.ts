import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule, NgFor } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { ITodo } from 'src/app/common/interfaces/todo.interface';
import { TodoService } from 'src/app/common/services/todo.service';
import {  MatIconModule } from '@angular/material/icon';
import { PersonService } from 'src/app/common/services/person.service';
import { IPerson } from 'src/app/common/interfaces/person.interface';
import { StorageService } from 'src/app/common/services/storage.service';
import { TodoStatus } from 'src/app/common/types/todo-status';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [CdkDropList, NgFor, CdkDrag,MatIconModule,CommonModule,RouterModule],
})
export class ListComponent implements OnInit{
  todo: ITodo[] = [];
  inProgress: ITodo[] = [];
  done: ITodo[] = [];

  persons: IPerson[] = []
   
   todos = this.todoService.todosSub.subscribe(res=>{this.todo.push(res)})

  fetchListsFromStorage() {
    this.todoService.getTodos().subscribe((todos: ITodo[]) => {
      this.todo = todos.filter(todo => todo.status === 'todo');
      this.inProgress = todos.filter(todo => todo.status === 'pending');
      this.done = todos.filter(todo => todo.status === 'completed');
    });
  }

  saveListsToStorage() {
    const todos = [...this.todo, ...this.inProgress, ...this.done];
    this.storageService.set('todos', todos);
  }

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

      const updatedTodos = [...this.todo, ...this.inProgress, ...this.done];
      const todoToUpdate = updatedTodos[event.currentIndex];
      
      const status = this.getListStatus(event.container.id);
      console.log(event.container.id)
      todoToUpdate.status = status;
  
      this.saveListsToStorage();
      this.todoService.updateTodoById(todoToUpdate.id, todoToUpdate).subscribe(() => {
      });
    }
  }
  getListStatus(containerId: string): TodoStatus {
    switch (containerId) {
      case 'cdk-drop-list-0':
        return 'todo';
      case 'cdk-drop-list-1':
        return 'pending';
      case 'cdk-drop-list-2':
        return 'completed';
      default:
        return 'todo';
    }
  }
  constructor(
    private todoService: TodoService,
    private router: Router,
    private storageService: StorageService
  ){}

  ngOnInit(): void {
   this.getTodo()
   this.fetchListsFromStorage()
  //  console.log(this.todo,this.inProgress,this.done)
  }

  getTodo(){
    this.todoService.getTodos().subscribe(res => {
      this.todo = res;
      this.fetchListsFromStorage(); 
    });
  }

  delete(id: string) {
    this.todoService.deleteTodoById(id).subscribe(() => {
      this.getTodo()
    });
  }

  edit(item: ITodo){
    console.log(item)
    this.router.navigate([`update/${item.id}`])
  }
}
