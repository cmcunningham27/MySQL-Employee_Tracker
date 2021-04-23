drop database if exists employees_DB;

create database employees_DB;

use employees_DB;

create table department(
	id int auto_increment,
    name varchar(30) not null,
    primary key(id)
);

create table role(
	id int auto_increment,
    title varchar(30) not null,
    salary decimal(10, 2),
    department_id int,
    primary key(id),
    constraint fk_department foreign key (department_id) references department(id) on delete cascade
);

create table employee(
	id int auto_increment,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int not null,
    constraint fk_role foreign key (role_id) references role(id) on delete cascade,
    manager_id int null,
    constraint fk_employee foreign key (manager_id) references employee(id) on delete set null,
    primary key(id),
);