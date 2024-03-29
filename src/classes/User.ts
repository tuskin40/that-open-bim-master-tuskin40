import { v4 as uuidv4 } from "uuid"
import { IProject, Project } from "./Project"
import { formatDate } from "../index"

// export type UserRole = "architect" | "engineer" | "developer"
export type UserStatus = "Pending" | "Active" | "Deactivated"
export type UserRole = "Architect" | "Engineer" | "Developer"

export const UserRoleList: string[] = ["Architect", "Engineer", "Developer"]



export interface IUser {
    dateAdded: Date
    fullName: string
    userName: string
    status: UserStatus
    role: UserRole
}

export class User implements IUser {
    dateAdded: Date
    fullName: string
    userName: string
    status: UserStatus
    role: UserRole

    // Class internal
    ui: HTMLDivElement
    id: string

    // Feature - Add the list of projects to User
    // projectsList: Project[] = []


    constructor(data: IUser) {
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

        this.ui = document.createElement("div")
        this.ui.className = "user-card"
        this.ui.setAttribute("data-userId", this.id)
        this.ui.innerHTML = `                    
            <div class="user-card-header">
                <img src="./assets/user-svgrepo-com.svg" alt="">
                <div>
                    <h5>${this.fullName}</h5>
                    <p class="user-username">${this.userName}</p>
                    <p class="user-role">${this.role}</p>
                </div>
            </div>
            <div class="card-content">
                <div class="card-property">
                    <p>Added</p>
                    <p>${formatDate(this.dateAdded)}</p>
                </div>
                <div class="card-property">
                    <p>Status</p>
                    <p class="user-card-active ${this.status}">${this.status}</p>
                </div>
            </div>
                                `
    }
}
