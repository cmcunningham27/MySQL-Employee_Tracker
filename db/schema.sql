DROP DATABASE IF EXISTS employees_DB;

CREATE DATABASE employees_DB;

USE employees_DB;

CREATE TABLE department(
	id INT auto_increment,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE role(
	id INT auto_increment,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2),
    department_id INT,
    PRIMARY KEY(id),
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee(
	id INT auto_increment,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) oON DELETE CASCADE,
    manager_id INT,
    CONSTRAINT fk_employee FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE,
    PRIMARY KEY(id),
);