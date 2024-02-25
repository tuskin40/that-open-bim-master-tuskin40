import { Project, IProject, ProjectStatus, UserRole } from "./classes/Project"


// const showModal = () => {
//     const modal = document.getElementById("new-project-modal")
//     modal.showModal()
// }

function showModal(id: string){
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
        modal.showModal()
    } else {
        console.warn("Element:" + id + " was not found")
    }
}

const newProjectBtn = document.getElementById("new-project-btn")

if (newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {showModal("new-project-modal")})
} else {
    console.warn("New project button was not found")
}

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
        const myProject = new Project(projectObj)
        console.log("Project data:", myProject)
    })
} else {
    console.warn("The project from was not found. check the ID!")
   
}