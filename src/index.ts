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


// Navigation Project button code
const allProjectBtn = document.getElementById("projects-btn")
if (allProjectBtn) {
    allProjectBtn.addEventListener("click", () => {
    const projectPage = document.getElementById("projects-page")
    const detailsPage = document.getElementById("project-details")
    if (!projectPage || !detailsPage) {return}

    projectPage.style.display = "flex"
    detailsPage.style.display = "none"
    
    })
} else {
    console.warn("New project button was not found")
}

// New Project button code
const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {toggleModal("new-project-modal")})
} else {
    console.warn("New project button was not found")
}

// Export button code
const exportProjectBtn = document.getElementById("export-project-btn")
if (exportProjectBtn) {
    exportProjectBtn.addEventListener("click", () => {projectsManager.exportToJSON()})
} else {
    console.warn("export-project-btn button was not found")
}

// Import button code
const importProjectBtn = document.getElementById("import-project-btn")
if (importProjectBtn) {
    importProjectBtn.addEventListener("click", () => {projectsManager.importFromJSON()})
} else {
    console.warn("import-project-btn button was not found")
}

// Cancel New project button
const cancelFormBtn = document.getElementById("cancel-new-project-button")
if (cancelFormBtn) {
    cancelFormBtn.addEventListener("click", () => {toggleModal("new-project-modal")})
} else {
    console.warn("New cancel-new-project-button was not found")
}

// Error modal button
const errorModalBtn = document.getElementById("error-modal-button")
if (errorModalBtn) {
    errorModalBtn.addEventListener("click", () => {toggleModal("error-modal")})
} else {
    console.warn("New error-modal-button was not found")
}

// Project Manager code
const projectListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectListUI)

// Error message code

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

        try {
            const myProject = projectsManager.newProject(projectObj)
            projectForm.reset()
            toggleModal("new-project-modal")
            console.log("Project cost:", new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                projectsManager.totalProjectsCost(),
              ))
        } catch (err){
            // alert(err)
            console.error(err)
            // projectForm.reset()
            // toggleModal("new-project-modal")
            const errorMsg = document.getElementById("error-message") as HTMLElement
            errorMsg.innerHTML = err
            showModal("error-modal")
        }

    })

} else {
    console.warn("The project from was not found. check the ID!")
   
}

