import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IPerson } from 'src/app/common/interfaces/person.interface';
import { TodoService } from 'src/app/common/services/todo.service';
import { PersonService } from 'src/app/common/services/person.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ITodo } from 'src/app/common/interfaces/todo.interface';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  tasks: ITodo[] = [];
  inProgress: ITodo[] = [];
  done: ITodo[] = [];

  persons: IPerson[] = [];
  id: string | undefined;

  constructor(
    private personService: PersonService,
    private todoService: TodoService,
    private router: Router,
    private actroute: ActivatedRoute,
    private toastSrv: NgToastService
  ) {}

  ngOnInit(): void {
    this.getTodos();
    this.getPersons();

    this.actroute.params.subscribe((params) => {
      this.id = params['id'];
      if (params['id']) {
        this.getTodoById(params['id']);
      }
    });
  }

  getTodoById(id: string) {
    this.todoService.getTodoById(id).subscribe((res) => {
      if (res) {
        this.form.patchValue(res);
      }
    });
  }

  form: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    responsiblePersonId: new FormControl('', Validators.required),
    description: new FormControl(''),
    dueDate: new FormControl('', Validators.required),
  });

  getPersons() {
    this.personService.getPersons().subscribe((res) => (this.persons = res));
  }

  submit() {
    const { responsiblePersonId } = this.form.value;
    let responsiblePerson: IPerson | undefined;
    if (responsiblePersonId) {
      responsiblePerson = this.persons.find(
        (person) => person.id === +responsiblePersonId
      );
    }
    if (!this.id) {
      this.todoService
        .addTodo({ ...this.form.value, responsiblePerson: responsiblePerson })
        .subscribe((res) => {
          this.todoService.todosSub.next(res);
          this.form.reset();
          this.toastSrv.success({ detail: "Success Message", summary: "ToDo successfully created", duration: 3000 })
          this.router.navigate(['create']);
        });
    } else {
      this.todoService
        .updateTodoById(this.id, {
          ...this.form.value,
          responsiblePerson: responsiblePerson,
        })
        .subscribe((res) => {
          this.todoService.todosSub.next(res);
          this.toastSrv.success({ detail: "Success Message", summary: "ToDo successfully updated", duration: 3000 })
          this.form.reset();
          this.router.navigate(['create']);
        });
    }
  }

  getTodos() {
    this.todoService.getTodos().subscribe((res) => console.log(res));
  }
  
  dateFilter = (date: Date | null): boolean => {
    if (date === null) {
      return true; // Return true to disable selection for null date
    }
  
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set the time to midnight for comparison
    return date >= currentDate;
  };
}
