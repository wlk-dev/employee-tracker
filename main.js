const inq = require("inquirer");
const logo = require("asciiart-logo");
require("console.table");

const db = require('./db/operations')

class Question {
    constructor(msg, type, name, choices=null) {
        this.value = {message : msg, type : type, name : name, choices : choices}
    }
}

const questions = {
    first : new Question("\nView, Manage or Exit", "list", "choice", ["View", "Manage", "Exit"]).value,
    view : new Question("\nView", "list", "choice", ["All Roles", "All Employees"]).value,
    manage : new Question("\nAdd or Update", "list", "choice", ["Add Department", "Add Role", "Add Employee", "Update Role"]).value
}

async function init () {
    let cond = true;
    let key = "first"
    
    while(cond) {
        let answer = await inq.prompt(questions.first)
        if (answer.choice === "Exit") break;

        switch (answer.choice) {
            case "View":
                key = await inq.prompt(questions.view)
                break;
            case "Manage":
                key = await inq.prompt(questions.manage)
                break;
    
            default:
                console.warn("Defaulted!", answer)
                cond = false;
        }

       switch(key.choice) {
            case "All Roles":
                db.getRoles().then( ([res]) => {
                    console.table(res)
                    console.log("\n\n")})
                break;
            case "All Employees":
                console.log("\n") 
                db.getEmployees().then( ([res]) => {
                    console.table(res)
                    console.log("\n\n")})
                break;
            
            case "Add Role":
                break;
            
            case "Add Employee":
                break;

            case "Add Department":
                break;

            default:
                console.warn("defaulted on key", key)
                cond = false;
       }
    }

    db.close();
}


init()