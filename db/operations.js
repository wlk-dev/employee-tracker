const connection = require('./connection')

class DB {
    constructor(connection) {
        this.conn = connection
    }

    close () {
        this.conn.end();
    }

    getDepartments() {
        return this.conn.promise().query("SELECT * FROM department")
    }

    getRoles() {
        return this.conn.promise().query("SELECT * FROM role")
    }

    getEmployees() {
        return this.conn.promise().query(`
        SELECT e.first_name AS first_name, e.last_name as last_name, r.title AS title, d.name AS department, r.salary AS salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager
        FROM department d
            LEFT JOIN role r ON d.id = r.department_id
            LEFT JOIN employee e ON r.id = e.role_id
            LEFT JOIN employee manager ON manager.id = e.manager_id
        WHERE e.first_name IS NOT NULL
        `)
    }

    getEmployee(employee_id) {
        return this.conn.promise().query(`
        SELECT e.first_name AS first_name, e.last_name AS last_name
        FROM employee e WHERE e.id = ?
        `, employee_id)
    }

    _getEmployees() {
        return this.conn.promise().query(`SELECT CONCAT(e.first_name, " ", e.last_name) AS name, e.id AS value FROM employee e`)
    }

    getManagers() {
        return this.conn.promise().query(`
        SELECT concat(e.first_name, " ", e.last_name) AS name, e.id AS value
        FROM employee e
        LEFT JOIN employee e2 ON e2.id = e.manager_id 
        WHERE e.manager_id  IS NULL
        `)
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

    updateEmployeeRole(employee_id, new_role_id) {
        return this.conn.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [new_role_id, employee_id])
    }

}

module.exports = new DB(connection);

// let db = new DB(connection);

// db.insertDepartment("Yo Momma").then( ([rows]) => console.table(rows) ).catch( err => console.log(err) )
// db.insertRole("Ass Eater", 100_000, 5).then( ([rows]) => console.table(rows) ).catch( err => console.log(err) )
// db.insertEmployee("Will", "K", 9).then( ([rows]) => console.table(rows) ).catch( err => console.log(err) )
// db.updateEmployeeRole(8, 6).then( ([rows]) => console.table(rows) ).catch( err => console.log(err) )

// db.getDepartments().then( ([rows]) => console.table(rows) ).catch( err => console.log(err) )
// db.getRoles().then( ([rows]) => console.table(rows) ).catch( err => console.log(err) )
// db.getEmployees().then( ([rows]) => console.table(rows) ).catch( err => console.log(err) )
// db.getManagers().then( ([rows]) => console.table(rows) ).catch( err => console.log(err) )

// db.getEmployees().then( ([rows]) => console.table(rows) ).catch( err => console.log(err) )

// connection.end()