const connection = require('./connection')
const cTable = require("console.table")

class DB {
    constructor(connection) {
        this.conn = connection
    }

    getDepartments() {
        return this.conn.promise().query("SELECT * FROM department")
    }

    getRoles() {
        return this.conn.promise().query("SELECT * FROM role")
    }

    getEmployees() {
        return this.conn.promise().query(`
        SELECT e.id AS id, e.first_name AS first_name, e.last_name as last_name, r.title AS title, d.name AS department, r.salary AS salary, e.manager_id AS manager
        FROM department d
            LEFT JOIN role r ON d.id = r.department_id
            LEFT JOIN employee e ON r.id = e.role_id
        `)
    }

    getEmployee(employee_id) {
        return this.conn.promise().query(`
        SELECT e.first_name AS first_name, e.last_name AS last_name
        FROM employee e WHERE e.id = ?
        `, employee_id)
    }

    insertDepartment(name) {
        return this.conn.promise().query("INSERT INTO department (name) VALUES (?)", name)
    }

    insertRole(name, salary, department_id) {
        return this.conn.promise().query("INSERT INTO role (title, salary, department_id) VALUES (?,?,?)", [name, salary, department_id])
    }

    insertEmployee(fname, lname, role_id, manager_id=null) {
        return this.conn.promise().query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [fname, lname, role_id, manager_id])
    }

    updateEmployeeRole(employee_id, new_role) {
        return this.conn.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [new_role, employee_id])
    }

}

module.exports = new DB(connection);

let db = new DB(connection);

// db.insertDepartment("Yo Momma").then( ([rows]) => console.table(rows) ).catch( err => console.log(err) )
// db.insertRole("Ass Eater", 100_000, 5).then( ([rows]) => console.table(rows) ).catch( err => console.log(err) )
// db.insertEmployee("Will", "K", 9).then( ([rows]) => console.table(rows) ).catch( err => console.log(err) )
// db.updateEmployeeRole(8, 6).then( ([rows]) => console.table(rows) ).catch( err => console.log(err) )

// db.getDepartments().then( ([rows]) => console.table(rows) ).catch( err => console.log(err) )
// db.getRoles().then( ([rows]) => console.table(rows) ).catch( err => console.log(err) )
// db.getEmployees().then( ([rows]) => console.table(rows) ).catch( err => console.log(err) )

// db.getEmployees().then( ([rows]) => rows ).catch( err => console.log(err) )
db.getEmployees().then( ([rows]) => {
    for(const emp of rows) {
        if (emp.manager) {
            let m_name;
            for(const temp of rows) {
                if (emp.manager === temp.id) {
                    m_name = `${temp.first_name} ${temp.last_name}`
                }
            }
            emp.manager = m_name
        }
    }
    console.table(rows)
})

connection.end()