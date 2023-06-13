import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule, NgFor } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { ITodo } from 'src/app/common/interfaces/todo.interface';
import { TodoService } from 'src/app/common/services/todo.service';
import {  MatIconModule } from '@angular/material/icon';
import { PersonService } from 'src/app/common/services/person.service';
import { IPerson } from 'src/app/common/interfaces/person.interface';

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
    private todoService: TodoService,
    private personService: PersonService,
    private router: Router,
    private actRoute: ActivatedRoute
  ){}

  ngOnInit(): void {
   this.getTodo()
 
  }



  getTodo(){
    this.todoService.getTodos().subscribe(res =>this.todo = res)
  }

  delete(id: string){
    this.todoService.deleteTodoById(id)
    this.getTodo()
  }

  edit(item: ITodo){
    console.log(item)
    this.router.navigate([`update/${item.id}`])
  }
}
