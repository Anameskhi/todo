import { ListComponent } from './../list/list.component';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { PersonService } from 'src/app/common/services/person.service';
import { Observable } from 'rxjs';
import { IPerson } from 'src/app/common/interfaces/person.interface';
import { ITodo } from 'src/app/common/interfaces/todo.interface';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],

})
export class CreateComponent {

  tasks: ITodo[] = []
  inProgress: ITodo[] = []
  done: ITodo[] = []
  persons$: Observable<IPerson[]> = this.personService.getPersons() 
  constructor(
    private personService: PersonService
  ){}

  form: FormGroup = new FormGroup({
    title: new FormControl('',Validators.required),
    responsiblePersonId: new FormControl('',Validators.required),
    dueDate: new FormControl('',Validators.required)
  })



  submit(){

  }

}
