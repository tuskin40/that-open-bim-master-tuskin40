

export class Todo {
    dateAdded: string
    description: string
    done: boolean
    dateCompleted: string

    constructor (description: string){
        this.dateAdded = new Date(project.finishDate).toLocaleDateString()
        this.description = description
        this.done = false
    }
}