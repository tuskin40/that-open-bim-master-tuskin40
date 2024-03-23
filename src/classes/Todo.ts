import { v4 as uuidv4 } from "uuid"

export type TodoStatus = "cancelled" | "active" | "finished"
export const iconsList: string[] = ["disabled_by_default", "check_box_outline_blank", "check_box"]
export const todoStatusList: string[] = ["cancelled", "active", "finished"];

export interface ITodo {
    dateAdded: Date
    description: string
    status: TodoStatus
    dueDate: Date
}

export class Todo implements ITodo {
    dateAdded: Date
    description: string
    status: "cancelled" | "active" | "finished"
    dueDate: Date

    ui: HTMLDivElement
    id: string

    constructor(data: ITodo) {
        for (const key in data) {
            if (key != 'ui') {
                this[key] = data[key]
            }
        }

        if (!this.id) { this.id = uuidv4() }
        this.setTodoUI()
    }

    setTodoUI() {

        if (this.ui) { return } // prevents from code running again after the ui has already been created

        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const dueDate = new Date(this.dueDate)
        const formattedDueDate = daysOfWeek[dueDate.getDay()] + ", " + dueDate.getDate() + " " + months[dueDate.getMonth()]
     
        this.ui = document.createElement("div")
        this.ui.className = "todo-item " + this.status
        this.ui.setAttribute("data-todoId", this.id)
        this.ui.innerHTML = `                    
            <div style="display: flex;justify-content: space-between;align-items: center;" >
                <div style="display: flex; align-items: center;">
                    <span class="material-symbols-outlined"
                        style="padding: 8px; background-color: var(--background-100); border-radius: 8px; margin-right: 8px;">${iconsList[todoStatusList.indexOf(this.status)]}</span>
                    ${this.description}
                </div>
                <p style="text-wrap: nowrap;margin-left: 8px;">${formattedDueDate}</p>
            </div>
                                `
    }
}