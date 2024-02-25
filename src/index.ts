import { IProject, ProjectStatus, UserRole } from "./classes/Project"
import { ProjectsManager } from "./classes/ProjectsManager"

// const showModal = () => {
//     const modal = document.getElementById("new-project-modal")
//     modal.showModal()
// }

// functions for modal form display
function showModal(id: string){
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
        modal.showModal()
    } else {
        console.warn("Element:" + id + " was not found")
    }
}

function closeModal(id: string){
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
        modal.close()
    } else {
        console.warn("Element:" + id + " was not found")
    }
}

function toggleModal(id: string){
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
        if (modal.open) {
            modal.close()
        } else {
            modal.showModal()
        }
    } else {
        console.warn("Element:" + id + " was not found")
    }
}


// New Project button code
const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {toggleModal("new-project-modal")})
} else {
    console.warn("New project button was not found")
}

// Cancel New project button
const cancelFormBtn = document.getElementById("cancel-new-project-button")
if (cancelFormBtn) {
    cancelFormBtn.addEventListener("click", () => {toggleModal("new-project-modal")})
} else {
    console.warn("New cancel-new-project-button was not found")
}

// Project Manager code
const projectListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectListUI)

// Read form data and create project card code
const projectForm = document.getElementById("new-project-form")

if (projectForm && projectForm instanceof HTMLFormElement)
{
    projectForm.addEventListener("submit", (e)=> {
        e.preventDefault()
        const formData = new FormData(projectForm)
        const projectObj: IProject = {
            "name": formData.get("name") as string,
            "description": formData.get("description") as string,
            "userRole": formData.get("userRole") as UserRole,
            "status": formData.get("status") as ProjectStatus,
            "finishDate": new Date(formData.get("finishDate") as string),
        }
        const myProject = projectsManager.newProject(projectObj)
        projectForm.reset()
        toggleModal("new-project-modal")
        console.log("Project data:", myProject)
    })

} else {
    console.warn("The project from was not found. check the ID!")
   
}

