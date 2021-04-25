DROP DATABASE IF EXISTS employees_DB;

CREATE DATABASE employees_DB;

USE employees_DB;

CREATE TABLE department(
	id int auto_increment,
    name varchar(30) not null,
    primary key(id)
);

CREATE TABLE role(
	id int auto_increment,
    title varchar(30) not null,
    salary decimal(10, 2),
    department_id int,
    primary key(id),
    constraint fk_department foreign key (department_id) references department(id) on delete set null
);

CREATE TABLE employee(
	id int auto_increment,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int,
    constraint fk_role foreign key (role_id) references role(id) on delete set null,
    manager_id int,
    constraint fk_employee foreign key (manager_id) references employee(id) on delete set null,
    primary key(id),
);