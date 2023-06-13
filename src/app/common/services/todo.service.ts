import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { ITodo } from '../interfaces/todo.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  todosSub: Subject<ITodo> = new Subject<ITodo>()

  constructor(
    private storageService: StorageService
  ) { }

  get todos(): ITodo[]{
    return this.storageService.get('todos') || []
  }

  getTodos():Observable<ITodo[]>{
    return of(this.todos)
  }

  getTodoById(id: string): Observable<ITodo | undefined> {
    return of(this.todos.find(todo => todo.id === id));
  }

  addTodo(todo: ITodo):Observable<ITodo>{
    console.log(todo)
    const todos = this.todos 
    todo.id = this.generateId();
    todo.createdAt = new Date();
    todo.status = 'todo'
    todos.push(todo)
    this.storageService.set('todos', todos)
    return of(todo)
  }

  generateId():string{
    return Math.random().toString(36).substr(2,9)
  }

  updateTodoById(id: string | number, todo: ITodo):Observable<ITodo>{
    console.log(id)
    const todos = this.todos;
    const index = todos.findIndex(todo => todo.id === id)
    todos[index] = {
      // ...todos[index],
      ...todo,
      id: todos[index].id
    
    }
    this.storageService.set('todos', todos)
    console.log(id)
    return of(todo)
  }

  deleteTodoById(id: string | number): Observable<boolean>{
    const todos = this.todos;
    const index = todos.findIndex(todo=> todo.id === id)
    todos.splice(index,1)
    this.storageService.set('todos', todos)
    return of(true)
  }
}
