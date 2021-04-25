INSERT INTO department 
    (name)
VALUES 
    ("Sales"), 
    ("Engineering"), 
    ("Finance"), 
    ("Legal");

INSERT INTO role 
    (title, salary, department_id)
VALUES 
    ("Sales Lead", 100000, 1), 
    ("Salesperson", 80000, 1), 
    ("Lead Engineer", 150000, 2), 
    ("Software Engineer", 120000, 2), 
    ("Account Manager", 155000, 3), 
    ("Accountant", 125000, 3), 
    ("Legal Team Lead", 250000, 4), 
    ("Lawyer", 190000, 4);

INSERT INTO employee 
    (first_name, last_name, role_id, manager_id)
VALUES 
    ("Zachary", "Franklin", 1, null),
    ("Danielle", "Scherf", 3, null),
    ("Greg", "Hamilton", 5, null), 
    ("Cassandra", "Cunningham", 7, null), 
    ("Hannah", "McDermonte", 2, 1), 
    ("Ken", "Fredrickson", 8, 4), 
    ("Michelle", "Obama", 4, 2), 
    ("Barry", "Pai", 6, 3);

