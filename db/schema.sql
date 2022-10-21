DROP DATABASE IF EXISTS tracker_db;
CREATE DATABASE tracker_db;

USE tracker_db;

CREATE TABLE department (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,

    department_id INT UNSIGNED NOT NULL,
    INDEX dep_ind (department_id),
    
    CONSTRAINT fk_department
        FOREIGN KEY (department_id)
        REFERENCES department(id)
        ON DELETE CASCADE
);

CREATE TABLE employee (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),

    role_id INT UNSIGNED NOT NULL,
    INDEX role_ind (role_id),

    CONSTRAINT fk_role
        FOREIGN KEY (role_id)
        REFERENCES role(id)
        ON DELETE CASCADE,
    
    manager_id INT UNSIGNED, -- only have this if the employee isn't a manager, it should point to a manager
    INDEX man_ind (manager_id),

    CONSTRAINT fk_manager
    FOREIGN KEY (manager_id)
        REFERENCES employee(id)
        ON DELETE SET NULL
);