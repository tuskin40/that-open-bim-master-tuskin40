
import { isThisTypeNode } from "typescript"
import { IProject, Project } from "./Project"
import { ITodo, Todo } from "./Todo"

export class ProjectsManager {
    list: Project[] = []
    ui: HTMLElement
    activeProject: Project

    constructor(container: HTMLElement) {
        this.ui = container
        this.ui.innerHTML = ""
        // this.ui_update_list()
    }

    newProject(data: IProject) {
        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUse = projectNames.includes(data.name)
        // console.log("data",data)
        if (nameInUse) {
            throw new Error(`A project with the name "${data.name}" already exists`)
        }

        if (data.name.length < 5) {
            console.log(data.name, data.name.length)
            throw new Error(`Project name "${data.name}" too short, it should be more than 5 characters long`);
        }

        const project = new Project(data)
        // console.log(project)
        project.ui.addEventListener('click', () => {
            const projectPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details")
            if (!projectPage || !detailsPage) { return }

            projectPage.style.display = "none"
            detailsPage.style.display = "flex"
            this.ui_setProjectDetailsPage(project)
            this.ui_setProjectEditPage(project)

        })

        this.ui.append(project.ui)
        this.list.push(project)
        // this.ui_update_list()
        return project
    }

    
    updateProject(data) {
        if (data.name.length < 5) {
            throw new Error(`Project name "${data.name}" too short, it should be more than 5 characters long`);
        }
        
        let project = this.getProjectByName(data.name)
        
        if (project) {
            project.update(data)
            this.ui_setProjectDetailsPage(project)
        }
        this.ui_update_list()
        return project
    }
    
    addTodo(todoData: ITodo){
        if (todoData) {
            const newTodo = this.activeProject.addTodo(todoData)
            this.ui_addTodo(newTodo)
        }
    }

    //#region UI methods

    ui_update_list(){
        this.ui.innerHTML = ""
        for (const project of this.list){
            this.ui.append(project.ui)
            this.ui_setProjectTodos(project)
        }
         
        // console.info("ui_update_list")      
    }

    private ui_setProjectDetailsPage(project: Project) {
        this.activeProject = project
        const detailsPage = document.getElementById("project-details")
        if (!detailsPage) { return }

        const initials = detailsPage.querySelector("[data-project-info='initials']") as HTMLElement
        if (initials) {
            initials.textContent = project.name.slice(0, 2)
            initials.style.backgroundColor = project.initialsBackgroundColor
        }

        const name = detailsPage.querySelector("[data-project-info='name']")
        if (name) { name.textContent = project.name }

        const description = detailsPage.querySelector("[data-project-info='description']")
        if (description) { description.textContent = project.description }

        const cardName = detailsPage.querySelector("[data-project-info='card-name']")
        if (cardName) { cardName.textContent = project.name }

        const cardDescription = detailsPage.querySelector("[data-project-info='card-description']")
        if (cardDescription) { cardDescription.textContent = project.description }

        const cost = detailsPage.querySelector("[data-project-info='cost']")
        if (cost) {
            cost.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                project.cost)
        }
        
        const userRole = detailsPage.querySelector("[data-project-info='userRole']")
        if (userRole) { userRole.textContent = project.userRole }

        const status = detailsPage.querySelector("[data-project-info='status']")
        if (status) { status.textContent = project.status }

        const progress = detailsPage.querySelector("[data-project-info='progress']") as HTMLDivElement
        if (progress) { progress.textContent = project.progress.toString() + "%"
            progress.style.width = (10 + (project.progress / 100 * 90)).toString()+ "%" }

        const finishDate = detailsPage.querySelector("[data-project-info='finishDate']")
        if (finishDate) { finishDate.textContent = new Date(project.finishDate).toISOString().split('T')[0] }
    
        this.ui_setProjectTodos(project)

    }

    private ui_setProjectTodos(project: Project) {
        console.log(project)
        const detailsPage = document.getElementById("project-details")
        if (!detailsPage) { return }

        const todosContainer = document.getElementById("project-todos-container") as HTMLDivElement
        todosContainer.innerHTML = ""
        for (const todo of project.todos){
            this.ui_addTodo(todo)
            console.log(todo.ui)
        }
    }

    private ui_setProjectEditPage(project: Project) {
        const projectEditPage = document.getElementById("edit-project-form")
        if (!projectEditPage) { return }
        
        const name = projectEditPage.querySelector("[data-project-info='projectName']") as HTMLInputElement
        if (name) { name.value = project.name }
        
        const description = projectEditPage.querySelector("[data-project-info='description']") as HTMLInputElement
        if (description) { description.value = project.description}

        const userRole = projectEditPage.querySelector("[data-project-info='userRole']") as HTMLInputElement
        if (userRole) { userRole.value = project.userRole }

        const status = projectEditPage.querySelector("[data-project-info='status']") as HTMLInputElement
        if (status) { status.value = project.status }

        const cost = projectEditPage.querySelector("[data-project-info='cost']") as HTMLInputElement
        if (cost) {cost.value = project.cost.toString()}

        const progress = projectEditPage.querySelector("[data-project-info='progress']") as HTMLInputElement
        if (progress) {progress.value = project.progress.toString()}

        const finishDate = projectEditPage.querySelector("[data-project-info='finishDate']") as HTMLInputElement
        if (finishDate) {
            finishDate.value = new Date(project.finishDate).toISOString().split('T')[0]
         }
    }

    ui_addTodo(todo: Todo) {
        const todosContainer = document.getElementById("project-todos-container") as HTMLDivElement

        todosContainer?.append(todo.ui)
        todo.ui.addEventListener('click', () => {

            console.log("Todo clicked - toggle todo")

        })
        todo.ui.addEventListener('dblclick', () => {
            // const projectPage = document.getElementById("projects-page")
            // const detailsPage = document.getElementById("project-details")
            // if (!projectPage || !detailsPage) { return }

            // projectPage.style.display = "none"
            // detailsPage.style.display = "flex"
            // this.ui_setProjectDetailsPage(project)
            // this.ui_setProjectEditPage(project)
            console.log("Todo double clicked - remove todo")

        })
    }


    //#endregion

    getProject(id: string) {
        const project = this.list.find((project) => {
            return project.id === id
        })
        return project
    }
    getProjectByName(name: string) {
        const project = this.list.find((project) => {
            return project.name === name
        })
        return project
    }

    deleteProject(id: string) {
        const project = this.getProject(id)
        if (!project) { return }
        project.ui.remove()
        const remaining = this.list.filter((project) => {
            return project.id !== id
        })
        this.list = remaining
        // this.ui_update_list()
    }

    exportToJSON(filename: string = "projects") {
        const json = JSON.stringify(this.list, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url) // delete url created earlier 

    }

    importFromJSON() {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'application/json'
        const reader = new FileReader()
        reader.addEventListener("load", () => {
            const json = reader.result
            if (!json) { return }
            const projects: IProject[] = JSON.parse(json as string)
            for (const project of projects) {
                try {
                    this.newProject(project)
                } catch (err) {
                    console.error(err)
                }
            }
        })
        input.addEventListener("change", () => {
            const fileList = input.files
            if (!fileList) { return }
            reader.readAsText(fileList[0])
        })
        input.click()
    }

    // loadDefaultData(projects: Project[]){
    //     for (const project of projects) {
    //         try {
    //             this.newProject(project)
    //         } catch (err) {
    //             console.error(err)
    //         }
    //     }       
    // }


    totalProjectsCost() {
        const initialValue = 0
        const totalProjCost = this.list.reduce((accumulator, project) =>
            accumulator + project.cost, initialValue
        )
        return totalProjCost
    }
}
