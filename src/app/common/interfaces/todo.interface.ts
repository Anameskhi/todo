import { TodoStatus } from "../types/todo-status"
import { IPerson } from "./person.interface"

export interface ITodo{
    id: string
    title: string
    status: TodoStatus
    dueDate: Date
    createdAt: Date
    updatedAt?: Date
    removedAt?: Date
    responsiblePerson?: IPerson

}