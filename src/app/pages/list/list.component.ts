import { Router, RouterModule } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule, NgFor } from '@angular/common';
import {  Component, OnInit } from '@angular/core';
import { ITodo } from 'src/app/common/interfaces/todo.interface';
import { TodoService } from 'src/app/common/services/todo.service';
import {  MatIconModule } from '@angular/material/icon';
import { StorageService } from 'src/app/common/services/storage.service';
import { TodoStatus } from 'src/app/common/types/todo-status';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [CdkDropList, NgFor, CdkDrag,MatIconModule,CommonModule,RouterModule],
})
export class ListComponent implements OnInit {
  todo: ITodo[] = [];
  inProgress: ITodo[] = [];
  done: ITodo[] = [];

  constructor(
    private todoService: TodoService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTodos();
  }
  todos = this.todoService.todosSub.subscribe(res => { this.todo = [res, ...this.todo] })

  getTodos() {
    this.todoService.getTodos().subscribe((todos: ITodo[]) => {
      this.todo = todos.filter((todo) => todo.status === 'todo');
      this.inProgress = todos.filter((todo) => todo.status === 'pending');
      this.done = todos.filter((todo) => todo.status === 'completed');
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
        event.currentIndex
      );
    }

    // Update the status of the items in the source container
    this.updateItemStatus(event.previousContainer.data, event.previousContainer.id);

    // Update the status of the items in the target container
    this.updateItemStatus(event.container.data, event.container.id);

    // Save the updated lists to storage
    this.saveListsToStorage();
  }

  updateItemStatus(items: ITodo[], containerId: string) {
    const status = this.getListStatus(containerId);

    items.forEach((item) => {
      item.status = status;
    });
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

  delete(id: string) {
    this.todoService.deleteTodoById(id).subscribe(() => {
      this.getTodos()
    });
  }

  edit(item: ITodo){
    console.log(item)
    this.router.navigate([`update/${item.id}`])
  }
}
