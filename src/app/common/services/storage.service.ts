import { JsonPipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  get(key: string):any{
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  }

  set(key: string, value: any):any{
    return localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string):void {
    localStorage.removeItem(key)
  }
}
