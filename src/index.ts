import { StringLiteralLike } from "typescript"
import { IProject, ProjectStatus, UserRole } from "./classes/Project"
import { ProjectsManager } from "./classes/ProjectsManager"

// const showModal = () => {
//     const modal = document.getElementById("new-project-modal")
//     modal.showModal()
// }

//#region GENERAL FUNCTIONS 

// functions for modal form display
function showModal(id: string) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
        modal.showModal()
    } else {
        console.warn("Element:" + id + " was not found")
    }
}

function closeModal(id: string) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
        modal.close()
    } else {
        console.warn("Element:" + id + " was not found")
    }
}

function toggleModal(id: string) {
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

function checkInputLength(id: string) {
    const inputElement = document.getElementById(id) as HTMLInputElement;
    if (!inputElement) { return }

    const inputValue = inputElement.value;

    if (inputValue.length < 5) {
        inputElement.classList.add('error');
    } else {
        inputElement.classList.remove('error');
    }
}
//#endregion

const newProjectInput = document.getElementById("new-project-name-input")
if (newProjectInput) {
    newProjectInput.addEventListener('focus', () => {
        checkInputLength(newProjectInput.id)
    })
    newProjectInput.addEventListener('input', () => {
        checkInputLength(newProjectInput.id)
    })
}


//#region BUTTON FUNCTIONS 


// Navigation Project button code
const allProjectBtn = document.getElementById("projects-btn")
if (allProjectBtn) {
    allProjectBtn.addEventListener("click", () => {
        const projectPage = document.getElementById("projects-page")
        const detailsPage = document.getElementById("project-details")
        if (!projectPage || !detailsPage) { return }

        projectPage.style.display = "flex"
        detailsPage.style.display = "none"

    })
} else {
    console.warn("projects-btn was not found")
}

// New Project button code
const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {
        const newProjectForm = document.getElementById("new-project-form")
        const finishDateInput = newProjectForm?.querySelector("[data-project-info='finishDate']") as HTMLInputElement
        finishDateInput.value = new Date().toISOString().split('T')[0];
        toggleModal("new-project-modal")
    })
} else {
    console.warn("new-project-btn was not found")
}

// Project Edit button
const editProjectBtn = document.getElementById("project-edit-btn")
if (editProjectBtn) {
    editProjectBtn.addEventListener("click", () => {
        const newProjectForm = document.getElementById("edit-project-form")
        // const finishDateInput = newProjectForm?.querySelector("[data-project-info='finishDate']") as HTMLInputElement
        // finishDateInput.value = new Date().toISOString().split('T')[0];
        toggleModal("edit-project-modal")
    })
} else {
    console.warn("project-edit-btn was not found")
}


// Add Project-todo button
const addProjectTodoBtn = document.getElementById("add-todo-btn")
if (addProjectTodoBtn) {
    addProjectTodoBtn.addEventListener("click", () => {
        // const newProjectForm = document.getElementById("new-project-form")
        // const finishDateInput = newProjectForm?.querySelector("[data-project-info='finishDate']") as HTMLInputElement
        // finishDateInput.value = new Date().toISOString().split('T')[0];
        // toggleModal("new-project-modal")
    })
} else {
    console.warn("add-todo-btn was not found")
}



// Export button code
const exportProjectBtn = document.getElementById("export-project-btn")
if (exportProjectBtn) {
    exportProjectBtn.addEventListener("click", () => { projectsManager.exportToJSON() })
} else {
    console.warn("export-project-btn button was not found")
}

// Import button code
const importProjectBtn = document.getElementById("import-project-btn")
if (importProjectBtn) {
    importProjectBtn.addEventListener("click", () => { projectsManager.importFromJSON() })
} else {
    console.warn("import-project-btn button was not found")
}

// Cancel New project button
const cancelFormBtn = document.getElementById("cancel-new-project-button") as HTMLElement
if (cancelFormBtn) {
    cancelFormBtn.addEventListener("click", () => { toggleModal("new-project-modal") })
} else {
    console.warn("New cancel-new-project-button was not found")
}

// Cancel Edit project button
const cancelEditFormBtn = document.getElementById("cancel-edit-project-button") as HTMLElement
if (cancelEditFormBtn) {
    cancelEditFormBtn.addEventListener("click", () => { toggleModal("edit-project-modal") })
} else {
    console.warn("New cancel-new-project-button was not found")
}

// Error modal button
const errorModalBtn = document.getElementById("error-modal-button")
if (errorModalBtn) {
    errorModalBtn.addEventListener("click", () => { toggleModal("error-modal") })
} else {
    console.warn("New error-modal-button was not found")
}

//#endregion

//#region MAIN CODE

// Project Manager code
const projectListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectListUI)

// Error message code

//#region ADD NEW PROJECT
const projectForm = document.getElementById("new-project-form")

if (projectForm && projectForm instanceof HTMLFormElement) {
    projectForm.addEventListener("submit", (e) => {
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
        } catch (err) {
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
//#endregion


//#region UPDATE EXISTING PROJECT
const projectEditForm = document.getElementById("edit-project-form")

if (projectEditForm && projectEditForm instanceof HTMLFormElement) {
    projectEditForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const formData = new FormData(projectEditForm)
        const projectObj = {
            "name": formData.get("name") as string,
            "description": formData.get("description") as string,
            "userRole": formData.get("userRole") as UserRole,
            "status": formData.get("status") as ProjectStatus,
            "finishDate": new Date(formData.get("finishDate") as string),
            "cost" : parseFloat(formData.get("cost") as string),
            "progress" : parseFloat(formData.get("progress") as string)
        }


        try {
            const myProject = projectsManager.updateProject(projectObj)
            toggleModal("edit-project-modal")

        } catch (err) {
            // alert(err)
            console.error(err)
            // projectEditForm.reset()
            // toggleModal("new-project-modal")
            const errorMsg = document.getElementById("error-message") as HTMLElement
            errorMsg.innerHTML = err
            showModal("error-modal")
        }

    })

} else {
    console.warn("The project from was not found. check the ID!")
}
//#endregion

// load data when document is loaded
// document.addEventListener('DOMContentLoaded', () => {
//     setTimeout(() => {
//         projectsManager.importFromJSON()
//     },5000)
// })
// window.onload = () => { projectsManager.importFromJSON() }

//#endregion 