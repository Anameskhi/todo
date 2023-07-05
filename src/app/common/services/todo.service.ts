import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { ITodo } from '../interfaces/todo.interface';
import { StorageService } from './storage.service';
import { v4 as uuidv4 } from 'uuid';
import { TodoStatus } from '../types/todo-status';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  todosSub: Subject<ITodo> = new Subject<ITodo>()

  constructor(
    private storageService: StorageService
  ) { }

  get todos(): ITodo[] {
    return this.storageService.get('todos') || []
  }

  getTodos(): Observable<ITodo[]> {
    return of(this.todos)
  }

  getTodoById(id: string): Observable<ITodo | undefined> {
    return of(this.todos.find(todo => todo.id === id));
  }

  addTodo(todo: ITodo): Observable<ITodo> {
    const todos = this.todos
    todo.id = uuidv4();
    todo.createdAt = new Date();
    todo.status = todo.status
    todos.push(todo)
    this.storageService.set('todos', todos)
    return of(todo)
  }

  updateTodoById(id: string | number, todo: ITodo): Observable<ITodo> {
    console.log(id)
    const todos = this.todos;
    const index = todos.findIndex(todo => todo.id === id)
    todos[index] = {
      ...todos[index],
      ...todo,
      // id: todos[index].id

    }
    this.storageService.set('todos', todos)
    console.log(id)
    return of(todo)
  }

  deleteTodoById(id: string | number): Observable<boolean> {
    const todos = this.todos;
    const index = todos.findIndex(todo => todo.id === id)
    todos.splice(index, 1)
    this.storageService.set('todos', todos)
    return of(true)
  }
  
  updateTodoStatus(id: string, status: TodoStatus): Observable<ITodo | undefined> {
    const todos = this.todos;
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      todos[index].status = status;
      this.storageService.set('todos', todos);
      return of(todos[index]);
    } else {
      return of(undefined);
    }
  }

  // statusCheck(status: string){
  //   if(status == "ToDo"){
  //     return "todo"
  //   }else if(status == "In progress"){
  //     return "pending"
  //   }else{
  //     return "completed"
  //   }
  // }
}
