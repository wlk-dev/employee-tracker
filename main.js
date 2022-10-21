const inq = require("inquirer")
require("console.table");

const db = require('./db/operations')

class Question {
    constructor(msg, type, name, choices=null) {
        this.value = {message : msg, type : type, name : name, choices : choices}
    }
}

const questions = [
    new Question("View", "list", "choice", ["All Roles", "All Employees"]),
    new Question("Add or Update", "list", "choice", ["Add Department", "Add Role", "Add Employee", "Update Role"])
]

