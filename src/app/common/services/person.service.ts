import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IPerson } from '../interfaces/person.interface';
import { persons } from 'src/app/shared/datas/person';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor() { }

  getPersons():Observable<IPerson[]>{
    return of(persons)
  }

  getPerson(id: number | string):Observable<IPerson | undefined>{
    return of(persons.find(person=> person.id === id))
  }
}
