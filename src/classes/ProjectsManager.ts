import { isThisTypeNode } from "typescript"
import { IProject, Project } from "./Project"

export class ProjectsManager {
    list: Project[] = []
    ui: HTMLElement

    constructor(container: HTMLElement) {
        this.ui = container
        this.ui.innerHTML = ""
    }

    newProject(data: IProject) {
        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            throw new Error(`A project with the name "${data.name}" already exists`)
        }
        const project = new Project(data)

        project.ui.addEventListener('click', () => {
            const projectPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details")
            if (!projectPage || !detailsPage) { return }

            projectPage.style.display = "none"
            detailsPage.style.display = "flex"
            this.setDetailsPage(project)
        })



        this.ui.append(project.ui)
        this.list.push(project)
        return project
    }

    private setDetailsPage(project: Project) {
        const detailsPage = document.getElementById("project-details")
        if (!detailsPage) { return }
        const name = detailsPage.querySelector("[data-project-info='name']")
        if (name) { name.textContent = project.name }
        const description = detailsPage.querySelector("[data-project-info='description']")
        if (description) { description.textContent = project.description }
        
        const cardName = detailsPage.querySelector("[data-project-info='card-name']")
        if (cardName) { cardName.textContent = project.name }
        const cardDescription = detailsPage.querySelector("[data-project-info='card-description']")
        if (cardDescription) { cardDescription.textContent = project.description }

        const status = detailsPage.querySelector("[data-project-info='status']")
        if (status) { status.textContent = project.status }
        const cost = detailsPage.querySelector("[data-project-info='cost']")
        if (cost) {
            cost.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                project.cost)
        }

        const userRole = detailsPage.querySelector("[data-project-info='userRole']")
        if (userRole) { userRole.textContent = project.userRole }
        const finishDate = detailsPage.querySelector("[data-project-info='finishDate']")
        if (finishDate) { finishDate.textContent = new Date(project.finishDate).toLocaleDateString() }
    }

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

    totalProjectsCost() {
        const initialValue = 0
        const totalProjCost = this.list.reduce((accumulator, project) =>
            accumulator + project.cost, initialValue
        )
        return totalProjCost
    }
}