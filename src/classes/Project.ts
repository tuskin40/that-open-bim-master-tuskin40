import { v4 as uuidv4 } from "uuid"
import { ITodo, Todo } from "./Todo"

export type ProjectStatus = "Pending" | "Active" | "Finished"
export type ProjectRole = "Architect" | "Engineer" | "Developer"
const initialsBackgroundColors = ["#FBA834", "#387ADF", "#8447ff", "#8cffda", "#50C4ED", "#FAA300", "#F4538A", "#F5DD61", "#c2a3f4", "#59D5E0"]


export interface IProject {
    name: string
    description: string
    status: ProjectStatus
    projectRole: ProjectRole
    finishDate: Date
}
export class Project implements IProject {
    // to satisfy the IProject
    name: string
    description: string
    status: ProjectStatus
    projectRole: ProjectRole
    finishDate: Date

    // Class internal
    ui: HTMLDivElement
    cost: number = Math.floor(Math.random() * Math.pow(10, 7)) // Remove
    progress: number = 0
    id: string
    initialsBackgroundColor: string 
    todos: Todo[] = []


    constructor(data: IProject) {
        // project data definition
        for (const key in data) {
            if (key === 'todos') {
                this.addTodos(data[key])
            } else if (key != 'ui') {
                this[key] = data[key]
                // console.log(data[key])
            }
        }

        if (!this.id) { this.id = uuidv4() }
        this.initialsBackgroundColor = initialsBackgroundColors[Math.floor(Math.random() * 11)]
        this.setUI()
    }

    addTodos(todoArray: ITodo[]){
        for (const todoKey in todoArray) {
            const newTodo = new Todo(todoArray[todoKey])
            // console.log("newTodo", newTodo)
            this.todos.push(newTodo)
        }
    }

    update(data: Todo) {
        // project data definition
        // for (const key in data) {
        //     if (key != 'ui') {
        //         this[key] = data[key]
        //         // console.log(data[key])
        //     }
        // }
        for (const key in data) {
            if (key === 'todos') {
                this.addTodos(data[key])
            } else if (key != 'ui') {
                this[key] = data[key]
                // console.log(data[key])
            }
        }

        if (!this.id) { this.id = uuidv4() }
        this.updateUI()
    }

    addTodo(todoData: ITodo) {
        const new_todo = new Todo(todoData)
        this.todos.push(new_todo)
        return new_todo
    }


    costCurrencyCH(amount: number) {
        return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(
            amount,
        )
    }
    costCurrencyUS(amount: number) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
            amount,
        )
    }



    // Create the project card UI
    setUI() {

        if (this.ui) { return } // prevents from code running again after the ui has already been created

        this.ui = document.createElement("div")
        this.ui.className = "project-card"
        this.ui.innerHTML = `                    
        <div class="card-header">
            <p class="card-initial" style="background-color: ${this.initialsBackgroundColor}">${this.name.slice(0, 2)}</p>
            <div>
                <h5>${this.name}</h5>
                <p>${this.description}</p>
            </div>
        </div>
        <div class="card-content">
            <div class="card-property">
                <p>Status</p>
                <p>${this.status}</p>
            </div>
            <div class="card-property">
                <p>Role</p>
                <p>${this.projectRole}</p>
            </div>
            <div class="card-property">
                <p>Cost</p>
                <p>${this.costCurrencyUS(this.cost)}</p>
            </div>
            <div class="card-property">
                <p>Estimated Progress</p>
                <p>${this.progress}%</p>
            </div>
        </div>`

    }

    // Create the project card UI
    updateUI() {

        // if (this.ui) { return } // prevents from code running again after the ui has already been created


        this.ui.innerHTML = `                    
        <div class="card-header">
            <p class="card-initial" style="background-color: ${this.initialsBackgroundColor}">${this.name.slice(0, 2)}</p>
            <div>
                <h5>${this.name}</h5>
                <p>${this.description}</p>
            </div>
        </div>
        <div class="card-content">
            <div class="card-property">
                <p>Status</p>
                <p>${this.status}</p>
            </div>
            <div class="card-property">
                <p>Role</p>
                <p>${this.projectRole}</p>
            </div>
            <div class="card-property">
                <p>Cost</p>
                <p>${this.costCurrencyUS(this.cost)}</p>
            </div>
            <div class="card-property">
                <p>Estimated Progress</p>
                <p>${this.progress}%</p>
            </div>
        </div>`
    }
}