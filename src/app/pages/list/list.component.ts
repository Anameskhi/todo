import { Router, RouterModule } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule, NgFor } from '@angular/common';
import {  Component, OnInit } from '@angular/core';
import { ITodo } from 'src/app/common/interfaces/todo.interface';
import { TodoService } from 'src/app/common/services/todo.service';
import {  MatIconModule } from '@angular/material/icon';
import { StorageService } from 'src/app/common/services/storage.service';
import { TodoStatus } from 'src/app/common/types/todo-status';
import { animate, state, style, transition, trigger } from '@angular/animations';



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
  todos = this.todoService.todosSub.subscribe(res => { 
    this.todo = [res, ...this.todo] .sort((a, b) => this.sortByTimestamp(a, b));
    this.saveListsToStorage();
  })

  getTodos() {
    this.todoService.getTodos().subscribe((todos: ITodo[]) => {
  
      this.todo = todos.filter((todo) => todo.status === 'todo')
      this.inProgress = todos.filter((todo) => todo.status === 'pending');
      this.done = todos.filter((todo) => todo.status === 'completed');

    });

  }
  sortByTimestamp(a: ITodo, b: ITodo): number {
    const timestampA = new Date(a.dueDate).getTime();
    const timestampB = new Date(b.dueDate).getTime();
    return timestampA - timestampB;
  }
  // .sort((a, b) => this.sortByTimestamp(a, b));

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
    if (event.container.id === 'cdk-drop-list-2') {
      const item = event.container.data[event.currentIndex];
      item.completedAt = new Date();
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

  toggleDescription(item: ITodo) {
    item.expanded = !item.expanded;
  }
  isDueSoon(item: ITodo){
    const now = new Date();
    const dueDate = new Date(item.dueDate);
    const timeDiff = dueDate.getTime() - now.getTime();
    const oneDayInMillis = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  
    const threeDaysInMillis = 3 * oneDayInMillis; // 3 days in milliseconds

    if (timeDiff < oneDayInMillis) {
      return 'due-soon';
    } else if (timeDiff < threeDaysInMillis) {
      return 'due-warning';
    } else {
      return ''; // No additional CSS class needed
    }
  }
}
