import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule, NgFor } from '@angular/common';
import {  Component, OnInit } from '@angular/core';
import { ITodo } from 'src/app/common/interfaces/todo.interface';
import { TodoService } from 'src/app/common/services/todo.service';
import {  MatIconModule } from '@angular/material/icon';
import { StorageService } from 'src/app/common/services/storage.service';
import { TodoStatus } from 'src/app/common/types/todo-status';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';
import { NgToastService } from 'ng-angular-popup';



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
  id?: string
  constructor(
    private todoService: TodoService,
    private storageService: StorageService,
    private router: Router,
    private dialog: MatDialog,
    private toastSrv: NgToastService,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.actRoute.params.subscribe((params) => {
      this.id = params['id'];
      
    });
    this.getAllTodos()
    this.getTodos()
    

  }
 

 getAllTodos(){
  this.todoService.getTodos().subscribe((todos) => {
    this.todo = todos.filter((todo) => todo.status === 'ToDo');
    this.inProgress = todos.filter((todo) => todo.status === 'In progress');
    this.done = todos.filter((todo) => todo.status === 'Done');
  });
 }

  getTodos() {
    this.todoService.todosSub.subscribe(res => {
      if(res.status == 'ToDo'){
        this.todo = [res, ...this.todo]
      }else if(res.status == "In progress"){
        this.inProgress = [res, ...this.inProgress]
      }else{
        this.done = [res, ...this.done]
      }



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
      if (item.status !== status) {
        item.status = status;
        this.todoService.updateTodoStatus(item.id, status).subscribe();
      }
    

    });
  }

  getListStatus(containerId: string): TodoStatus {
    switch (containerId) {
      case '0':
        return 'ToDo';
      case '1':
        return 'In progress';
      case '2':
        return 'Done';
      default:
        return 'ToDo';
    }
  }



  edit(item: ITodo){
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

  openConfirmationDialog(itemId: string){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '600px',
      data: { itemId }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        // Delete the item
        this.delete(itemId);
      }
    });
  }
    delete(id: string) {
      this.todoService.deleteTodoById(id).subscribe(() => {
        this.toastSrv.success({ detail: "Success Message", summary: "ToDo successfully deleted", duration: 3000 })
        if (id === this.id) {
          this.id = undefined; // Clear the id property
          this.router.navigate(['create']); // Navigate to the create route
        }
        this.getAllTodos()
      });
      

  }
  openTodoDialog(item: ITodo) {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      width: '500px',
      data: item
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
