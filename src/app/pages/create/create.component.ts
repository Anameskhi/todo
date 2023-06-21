import { TodoService } from './../../common/services/todo.service';
import { ListComponent } from './../list/list.component';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { PersonService } from 'src/app/common/services/person.service';
import { Observable, switchMap } from 'rxjs';
import { IPerson } from 'src/app/common/interfaces/person.interface';
import { ITodo } from 'src/app/common/interfaces/todo.interface';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],

})
export class CreateComponent implements OnInit{

  tasks: ITodo[] = []
  inProgress: ITodo[] = []
  done: ITodo[] = []
  
  persons: IPerson[] = []
  id: string | undefined
  constructor(
    private personService: PersonService,
    private todoService: TodoService,
    private router: Router,
    private actroute: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.getTodos()
    this.getPersons()

    this.actroute.params.subscribe((params)=>{
      this.id = params['id']
      if(params['id']){
        this.getTodoById(params['id'])
      }
    })
  }
  

  getTodoById(id: string){
    this.todoService.getTodoById(id)
    .subscribe(res=>{
      if(res){
        this.form.patchValue(res)

      }
    })
  }





  form: FormGroup = new FormGroup({
    title: new FormControl('',Validators.required),
    responsiblePersonId: new FormControl('',Validators.required),
    description: new FormControl(''),
    dueDate: new FormControl('',Validators.required)
  })

  getPersons(){
    this.personService.getPersons().subscribe(res=> this.persons = res)
  }
 
  submit(){
      const {responsiblePersonId} = this.form.value
      let responsiblePerson: IPerson | undefined
      if(responsiblePersonId){
        responsiblePerson = this.persons.find(person => person.id === +responsiblePersonId)
      }
      if(!this.id){
        this.todoService.addTodo({...this.form.value,responsiblePerson:  responsiblePerson})
        .subscribe(res => {
          this.todoService.todosSub.next(res)
          this.form.reset()
          this.router.navigate(['create'])
        }
        )
        
      }else{
        this.todoService.updateTodoById(this.id,{...this.form.value,responsiblePerson:  responsiblePerson})
        .subscribe(res=>{
          this.todoService.todosSub.next(res)
          this.form.reset()
       
          this.router.navigate(['create'])
        })
        
     
        
      }
     
  }
  getTodos(){
    this.todoService.getTodos().subscribe(res=>console.log(res))
  }

}
