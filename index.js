const mysql = require("mysql");
const inquirer = require("inquirer");

const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employees_DB"
});

db.connect((err) => {
    if (err) throw err;
    startApp();
});

const startApp = () => {
    inquirer
        .prompt({
            type: "rawlist",
            message: "What would you like to do?",
            name: "action",
            choices: [
                "Exit",
                "View All Employees",
                "View All Employees by Department",
                "View All Employees By Manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "View All Roles",
                "Add Role",
                "Remove Role",
                "View All Departments",
                "Add Department",
                "Remove Department",
                "View Total Budget By Department"
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case "Exit":
                    db.end();
                    break;

                case "View All Employees":
                    viewAllEmp();
                    break;

                case "View All Employees by Department":
                    viewEmpByDep();
                    break;

                case "View All Employees By Manager":
                    viewEmpByMan();
                    break;

                case "Add Employee":
                    addEmp();
                    break;

                case "Remove Employee":
                    removeEmp();
                    break;

                case "Update Employee Role":
                    updateEmpRole();
                    break;

                case "Update Employee Manager":
                    updateEmpMan();
                    break;

                case "View All Roles":
                    viewAllRoles();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Remove Role":
                    removeRole();
                    break;

                case "View All Departments":
                    viewAllDep();
                    break;

                case "Add Department":
                    addDep();
                    break;

                case "Remove Department":
                    removeDep();
                    break;

                case "View Total Budget By Department":
                    viewDepBudget();
                    break;

                default:
                    console.log(`Invalid actions: ${ answer.action }`);
                    break;
            };
        });
};

const viewAllEmp = () => {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON (manager.id = employee.manager_id) INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) ORDER BY employee.id", (err, res) => {//joins
        if (err) throw err;
        console.table(res)
        startApp();
    });
};

const viewEmpByDep = () => {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON (manager.id = employee.manager_id) INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) ORDER BY department.name", 
    (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    }); 
};

const viewEmpByMan = () => {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON (manager.id = employee.manager_id) INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) ORDER BY manager.id", 
    (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
};

const addEmp = () => {
    // inquirer
    //     .prompt([
    //         {
    //             type: "input",
    //             message: "What is the employee's first name?",
    //             name: "firstName"
    //         },
    //         {
    //             type: "input",
    //             message: "What is the employee's last name?",
    //             name: "lastName"
    //         },
    //     ])
    //     .then((answer) => {
    //         db.query("INSERT INTO employee (first_name, last_name) VALUES (?, ?)",
    //         [
    //             answer.firstName,
    //             answer.lastName
    //         ]),
    //         (err, res) => {
    //             if (err) throw err;
    //             whatRole();
                
    //         }
    //     });
};

const removeEmp = () => {
    db.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        const empArray = [];
        res.forEach(({ first_name, last_name}) => {
            const name = `${first_name} ${last_name}`;
            empArray.push(name);
            return empArray;
        });
        inquirer
            .prompt({
                type: "list",
                message: "Which employee do you wish to remove?",
                name: "empRemove",
                choices: empArray
            })
            .then((answer) => {
                const str = answer.empManUpdate;
                const firstWord = str.split(" ")[0];
                db.query("DELETE * FROM employee where ?",
                {
                    first_name: firstWord
                },
                (err, res) => {
                    if (err) throw err;
                    console.table(res);
                });
            });
    });
};

const updateEmpRole = () => {
    db.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        const empArray = [];
        res.forEach(({ first_name, last_name}) => {
            const name = `${first_name} ${last_name}`;
            empArray.push(name);
            return empArray;
        });
        inquirer
            .prompt({
                type: "list",
                message: "Which employee's role do you want to update?",
                name: "empRoleUpdate",
                choices: empArray
            })
            .then((answer) => {
                const str = answer.empRoleUpdate;
                const firstWord = str.split(" ")[0];
                whichRole(firstWord);
            });
    });
};

const whichRole = (firstWord) => {
    db.query("SELECT * FROM role", 
        (err, res) => {
        if (err) throw err;
        const roleArray = [];
        res.forEach(({ id, title, salary}) => {
            const role = `${id} ${title} ${salary}`;
            roleArray.push(role);
        });
        inquirer
            .prompt({
                type: "list",
                message: "Which role do you want to set for the selected employee?",
                name: "role",
                choices: roleArray
            })
            .then((answer) => {
                const str = answer.role;
                const id = str.split(" ")[0];
                db.query("UPDATE employee SET ? WHERE ?",
                [
                    {role_id: id},
                    {first_name: firstWord}
                ],
                (err, res) => {
                    if (err) throw err;
                    console.log("Employee's role was changed!");
                    startApp();
                });
            });
        });
};

const updateEmpMan = () => {
    db.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        const empArray = [];
        res.forEach(({ first_name, last_name}) => {
            const name = `${first_name} ${last_name}`;
            empArray.push(name);
            return empArray;
        });
        inquirer
            .prompt({
                type: "list",
                message: "Which employee's manager do you want to update?",
                name: "empManUpdate",
                choices: empArray
            })
            .then((answer) => {
                const str = answer.empManUpdate;
                const firstWord = str.split(" ")[0];
                whichMan(firstWord);
            });
    });
};
        

const whichMan = (firstWord) => {
    db.query("SELECT * FROM employee", 
        (err, res) => {
        if (err) throw err;
        const manArray = [];
        res.forEach(({ id, first_name, last_name}) => {
            const name = `${id} ${first_name} ${last_name}`;
            manArray.push(name);
        });
        inquirer
            .prompt({
                type: "list",
                message: "Which employee do you want to set as manager for the selected employee?",
                name: "manager",
                choices: manArray
            })
            .then((answer) => {
                const str = answer.manager;
                const id = str.split(" ")[0];
                db.query("UPDATE employee SET ? WHERE ?",
                [
                    {manager_id: id},
                    {first_name: firstWord}
                ],
                (err, res) => {
                    if (err) throw err;
                    console.log("Employee's manager was changed!");
                    startApp();
                });
            });
        });
};

const viewAllRoles = () => {
    db.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        console.table(res);
    });
};

const addRole = () => {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What role do you want to add?",
                name: "newRole"
            },
            {
                type: "input",
                message: "What salary does this role have?",
                name: "newSalary"
            },
            {
                type: "input",
                message: "What is the department's number for this role?",
                name: "depID",
                validate: val => /[0-9]/i.test(val) ? true : `Must be a number`
            }
        ])
        .then ((answer) => {
            db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
            [
                answer.newRole,
                answer.newSalary,
                answer.depID
            ],
            (err, res) => {
                if (err) throw err;
                console.log(`The ${ answer.newRole } role with a salary of ${ answer.newSalary} has been added`);
                startApp();
            });
        });
};

const removeRole = () => {

};

const viewAllDep = () => {
    db.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
    });
};

const addDep = () => {
    inquirer
        .prompt({
            type: "input",
            message: "What is the name of the department you want to add?",
            name: "depName"
        })
        .then((answer) => {
            db.query("INSERT INTO department SET ?",
            {
                name: answer.depName
            },
            (err, res) => {
                if (err) throw err;
                console.log(`${answer.depName} department has been added!`);
                startApp();
            });
        });
};

const removeDep = () => {

};

const viewDepBudget = () => {

};

