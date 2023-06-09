import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ITodo } from '../interfaces/todo.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(
    private storageService: StorageService
  ) { }

  get todos(): ITodo[]{
    return this.storageService.get('todos') || []
  }

  getTodos():Observable<ITodo[]>{
    return of(this.todos)
  }

  getTodoById(id: string | number):Observable<ITodo | undefined>{
    return of(this.todos.find(todo => todo.id === id))
  }

  addTodo(todo: ITodo):void{
    const todos = this.todos 
    todo.id = this.generateId();
    todo.createdAt = new Date();
    todo.status = 'pending'
    todos.push(todo)
    this.storageService.set('todos', todos)
  }

  generateId():string{
    return Math.random().toString(36).substr(2,9)
  }

  updateTodoById(id: string | number, todo: ITodo):void{
    const todos = this.todos;
    const index = todos.findIndex(todo => todo.id === id)
    todos[index] = todo
    this.storageService.set('todos', todos)
  }

  deleteTodoById(id: string | number): void{
    const todos = this.todos;
    const index = todos.findIndex(todo=> todo.id === id)
    todos.splice(index,1)
    this.storageService.set('todos', todos)
  }
}
