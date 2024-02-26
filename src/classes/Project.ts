import { v4 as uuidv4} from "uuid"

export type ProjectStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"

export interface IProject {
    name: string
    description:string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date
}
export class Project implements IProject {
    // to satisfy the IProject
    name: string
    description:string
    status: "pending" | "active" | "finished"
    userRole: "architect" | "engineer" | "developer"
    finishDate: Date

    // Class internal
    ui: HTMLDivElement
    cost: number     = Math.floor(Math.random() * Math.pow(10,7)) // Remove
    progress: number = 0
    id: string

    costCurrencyCH(amount: number){
        return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(
            amount,
          )
    }
    costCurrencyUS(amount: number){
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
            amount,
          )
    }

    constructor(data: IProject ) {
        // project data definition
        this.name           = data.name
        this.description    = data.description
        this.status         = data.status
        this.userRole       = data.userRole
        this.finishDate     = data.finishDate
        this.id             = uuidv4()
        this.setUI()
    }

    setUI() {

        if (this.ui) {return} // prevents from code running again after the ui has already been created

        this.ui             = document.createElement("div")
        this.ui.className   = "project-card"
        this.ui.innerHTML   = `                    
        <div class="card-header">
            <p class="card-initial">HC</p>
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
                <p>${this.userRole}</p>
            </div>
            <div class="card-property">
                <p>Cost</p>
                <p>${this.costCurrencyUS(this.cost)}</p>
            </div>
            <div class="card-property">
                <p>Estimated Progress</p>
                <p>${this.progress * 100}%</p>
            </div>
        </div>`
    }
}