
import { IUser, User } from "./User"

export class UsersManager {
    list: User[] = []
    ui: HTMLElement
    activeUser: User

    constructor(container: HTMLElement) {
        this.ui = container
        this.ui.innerHTML = ""

    }

    newUser(data: IUser) {
        const userNames = this.list.map((user) => {
            return user.userName
        })

        const nameInUse = userNames.includes(data.userName)

        if (nameInUse) {
            throw new Error(`A user with the username "${data.userName}" already exists`);
        }

        if (data.userName.length < 5) {
            throw new Error(`Username "${data.userName}" is too short, it should be more than 5 characters long`);
        }

        const user = new User(data)
        user.ui.addEventListener('click', () => {
            console.log("New user card clicked");

        })

        this.ui.append(user.ui)
        this.list.push(user)
        return user

    }


    deleteUser(id: string) {
        const user = this.getUser(id)
        if (!user) { return }
        user.ui.remove()
        const remaining = this.list.filter((user) => {
            return user.id !== id
        })
        this.list = remaining
        // this.ui_updateTodo_list()
    }

    updateUser(data: User) {
        // if (data.name.length < 5) {
        //     throw new Error(`Project name "${data.name}" too short, it should be more than 5 characters long`);
        // }

        // let existProject = this.getUserByName(this.activeUser.name)

        // if (existProject) {
        //     existProject.update(data)
        //     this.ui_setProjectDetailsPage(existProject)
        //     this.ui_setProjectEditPage(existProject)
        // }
        // return existProject
        console.log("Update User")
    }


    getUser(id: string) {
        const user = this.list.find((user) => {
            return user.id === id
        })
        return user
    }

    getUserByName(username: string) {
        const user = this.list.find((user) => {
            return user.userName === username
        })
        return user
    }


    exportToJSON(filename: string = "users") {
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
            const users: IUser[] = JSON.parse(json as string)
            for (const user of users) {
                try {

                    const existUser = this.getUserByName(user.name)
                    if (existUser) {
                        console.log("Project already exists", existUser)
                        this.updateUser(user)
                    }
                    else {

                        this.newUser(user)
                    }
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


}