const inq = require("inquirer");
const logo = require("asciiart-logo");

const db = require('./db/operations')


// Use this function to display the ascii art logo and to begin the main prompts
function init() {


  loadMainPrompts()
}

// Here we load the initial prompts with a series of options. The first option is provided for you.
function loadMainPrompts() {
    inq.prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },

        {
            name : "View All Roles",
            value : "VIEW_ALL_ROLES"
        },

        {
            name : "View All Departments",
            value : "VIEW_ALL_DEPTS"
        },

        {
            name : "Add Department",
            value : "ADD_DEPT"
        },

        {
            name : "Add Role",
            value : "ADD_ROLE"
        },

        {
            name : "Add Employee",
            value : "ADD_EMP"
        },

        {
            name : "Update Employee",
            value : "UPDATE_EMP"
        },

        {
            name:"Exit",
            value : "EXIT"
        }

        // add more options here
      ]
    },
  ]).then(res => {
    let choice = res.choice;
    // Call the appropriate function depending on what the user chose
    
    switch (choice) {
        case "VIEW_EMPLOYEES":
            viewEmployees();
            break;

        case "VIEW_ALL_ROLES":
            viewRoles();
            break;
        
        case "VIEW_ALL_DEPTS":
            viewDepartments()
            break;

        case "ADD_DEPT":
            addDepartment()
            break;
        
        case "ADD_ROLE":
            addRole()
            break;
        
        case "ADD_EMP":
            addEmployee()
            break;
        
        case "UPDATE_EMP":
            updateEmployee()
            break;

        case "EXIT":
            db.close()
            return;  
      
        // add the other case statements here
    }
  }
)}

/* ======= Controllers ============================================================ */

// Here is a function which handles the first prompt option:  View all employees
function viewEmployees() {
  db.getEmployees()
    .then(([rows]) => {
      let employees = rows;
      console.log("\n");
      console.table(employees);
    })
    .then(() => loadMainPrompts());
}

function viewRoles() {


    db.getRoles()
      .then(([rows]) => {
        let employees = rows;
        console.log("\n");
        console.table(employees);
      })
      .then(() => loadMainPrompts());
}
  
function viewDepartments() {


    db.getDepartments()
      .then(([rows]) => {
        let employees = rows;
        console.log("\n");
        console.table(employees);
      })
      .then(() => loadMainPrompts());
}
  
function addDepartment() {
    inq.prompt([
        {
            type : "input",
            message : "Enter a department name : ",
            name : "dept_name" 
        }
    ]).then( res => {
        db.insertDepartment(res.dept_name).then( loadMainPrompts() )
    })
}

async function addRole() {
    let temp =  await db.getDepartments();
    let depts = [];
    for( const {id, name} of temp[0]) {
        depts.push( {name : name, value : id} )
    }

    inq.prompt([
        {
            type : "input",
            message : "Role Title : ",
            name : "title"
        },
        {
            type : "input",
            message : "Role Salary : ",
            name : "salary"
        },
        {
            type : "list",
            message : "Role Department.",
            name : "dept",
            choices : [
                ...depts
            ]
        }
    ]).then( res => {
        db.insertRole(res.title, res.salary, res.dept)
        loadMainPrompts();
    })
}

async function addEmployee() {
    let temp =  await db.getRoles();
    let roles = [];
    for( const {id, title} of temp[0]) {
        roles.push( {name : title, value : id} )
    }

    let temp2 =  await db.getManagers();
    let managers = [];
    for( const {name, value} of temp2[0]) {
        managers.push( {name : name, value : value} )
    }
    managers.push( {name : "None", value : null} )


    inq.prompt([
        {
            type : "input",
            message : "First Name : ",
            name : "first_name"
        },
        {
            type : "input",
            message : "Last Name : ",
            name : "last_name"
        },
        {
            type : "list",
            message : "Select a role.",
            name : "role",
            choices : [
                ...roles
            ]
        },
        {
            type : "list",
            message : "Select a manager.",
            name : "manager",
            choices : [
                ...managers
            ]
        }
    ]).then( res => {
        db.insertEmployee(res.first_name, res.last_name, res.role, res.manager)
        loadMainPrompts();
    })
}

async function updateEmployee() {
    let temp =  await db._getEmployees();
    let emps = [];
    for( const {name, value} of temp[0]) {
        emps.push( {name : name, value : value} )
    }

    let temp2 =  await db.getRoles();
    let roles = [];
    for( const {id, title} of temp2[0]) {
        roles.push( {name : title, value : id} )
    }

    inq.prompt([
        {
            type : "list",
            message : "Select an Employee to update.",
            name : "employee_id",
            choices : [
                ...emps
            ]
        },
        {
            type : "list",
            message : "Select a role.",
            name : "role_id",
            choices : [
                ...roles
            ]
        },
    ]).then( res => {
        db.updateEmployeeRole(res.employee_id, res.role_id)
        loadMainPrompts()
    })

}
/* ======= END Controllers ============================================================ */





/* 
  You will write lots of other functions here for the other prompt options.
  Note that some prompts will require you to provide more prompts, and these 
  may need functions of their own.
*/



// Everything starts here!
init();