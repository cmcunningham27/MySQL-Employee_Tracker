//dependencies for app
const mysql = require("mysql");
const inquirer = require("inquirer");

//creates a connection to mysql, and tells which database to use
const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employees_DB"
});

//starts connection, to listen, and start the app
db.connect((err) => {
    if (err) throw err;
    startApp();
});

//Prompts the user with the initial question of what they wish to do first or next, then calls appropriate function
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

//Consoles joined tables with each employees information
const viewAllEmp = () => {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON (manager.id = employee.manager_id) INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) ORDER BY employee.id", (err, res) => {//joins
        if (err) throw err;
        console.table(res)
        startApp();
    });
};

//Consoles joined tables with each employees information, and groups them by the Departments
const viewEmpByDep = () => {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON (manager.id = employee.manager_id) INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) ORDER BY department.name", 
    (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    }); 
};

//Consoles joined tables with each employees information, and groups them by the Managers
const viewEmpByMan = () => {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON (manager.id = employee.manager_id) INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) ORDER BY manager.id", 
    (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
};

//Prompts the user to enter an employee's first and last name, calls whatRole function to prompt user to choose a role, calls the whatMan function to prompt user to choose a manager, and then creates the new employee row in the database
const addEmp = () => {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "firstName"
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "lastName"
            },
        ])
        .then((answer) => {
            db.query("INSERT INTO employee (first_name, last_name) VALUES (?, ?)",
            [
                answer.firstName,
                answer.lastName
            ],
            (err, res) => {
                if (err) throw err;
                whatRole(answer.firstName);
            });
        });
};

const whatRole = (firstName) => {
    db.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        const roleArray = [];
        res.forEach(({id, title}) => {
            const roles = `${id} ${title}`;
            roleArray.push(roles);
            
        }); 
        inquirer
            .prompt({
                type: "list",
                message: "What is the employee's role?",
                name: "empRole",
                choices: roleArray
            })
            .then((answer) => {
                const roleStr = answer.empRole;
                const roleId = roleStr.split(" ")[0];
                db.query("UPDATE employee SET ? WHERE ?", 
                [
                    {role_id: roleId},
                    {first_name: firstName}  
                ],
                (err, res) => {
                    if (err) throw err;
                    whichMan(firstName);
                });
            });
    });    
};

//Prompts the user to choose an employee they want to remove, then deletes that employee's row from the employee table
const removeEmp = () => {
    db.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        const empArray = [];
        res.forEach(({ first_name, last_name}) => {
            const name = `${first_name} ${last_name}`;
            empArray.push(name);
        });
        inquirer
            .prompt({
                type: "list",
                message: "Which employee do you wish to remove?",
                name: "empRemove",
                choices: empArray
            })
            .then((answer) => {
                const str = answer.empRemove;
                const firstWord = str.split(" ")[0];
                db.query("DELETE FROM employee where ?",
                {
                    first_name: firstWord
                },
                (err, res) => {
                    if (err) throw err;
                    console.table(`${ answer.empRemove} was removed!`);
                    startApp();
                });
            });
    });
};

//Prompts user to choose employee and which role they want them to have, then makes the change in the database for them
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

const whichRole = (firstName) => {
    db.query("SELECT * FROM role", (err, res) => {
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
                const roleSal = str.split(" ")[2];
                db.query("UPDATE employee SET ?, ? WHERE ?",
                [
                    {role_id: id},
                    {salary: roleSal},
                    {first_name: firstName}
                ],
                (err, res) => {
                    if (err) throw err;
                    console.log("Employee's role was changed!");
                    startApp();
                });
            });
    });
};

//Prompts user to choose employee and which employee they want to be their manager, then makes the change in the database for them
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

//Consoles the role table for the user to see
const viewAllRoles = () => {
    db.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
};

//Prompts the user to choose the title for a new role, the salary, and department id, then adds it as a new row in the role table
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

//Prompts the user to choose a role they wish to delete, then removes its row from the role table
const removeRole = () => {
    db.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        const roleArray = [];
        res.forEach(({ title}) => {
            const name = `${title}`;
            roleArray.push(name);
            return roleArray;
        });
        inquirer
            .prompt({
                type: "list",
                message: "Which role do you wish to remove?",
                name: "roleRemove",
                choices: roleArray
            })
            .then((answer) => {
                const str = answer.roleRemove;
                db.query("DELETE FROM role where ?",
                {
                    title: str
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`${ answer.roleRemove } was removed!`);
                    startApp();
                });
            });
    });
};

//Consoles the department table for the user
const viewAllDep = () => {
    db.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
};

//Prompts the user to add a department, then adds its row to the department table
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

//Prompts the user to choose a department to remove, then deletes its row from the department table
const removeDep = () => {
    db.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        const depArray = [];
        res.forEach(({name}) => {
            const depName = `${name}`;
            depArray.push(depName);
        });
        inquirer
            .prompt({
                type: "list",
                message: "Which department do you wish to remove?",
                name: "depRemove",
                choices: depArray
            })
            .then((answer) => {
                const str = answer.depRemove;
                db.query("DELETE FROM department where ?",
                {
                    name: str
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`${ answer.depRemove } was removed!`);
                    startApp();
                });
            });
    });
};

//
const viewDepBudget = () => {
    db.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        const depArray = [];
        res.forEach(({id, name}) => {
            const dep = `${id} ${name}`;
            depArray.push(dep);
        });
        inquirer   
            .prompt(
                {
                    type: "list",
                    message: "Which department's budget do you want?",
                    name: "depBudget",
                    choices: depArray
                }
            )
            .then((answer) => {
                const depStr = answer.depBudget;
                const depName = depStr.split(" ")[1];
                const depId = depStr.split(" ")[0];
                db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON (manager.id = employee.manager_id) INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) WHERE ?",
                [
                    {department_id: depId}
                ], 
                (err, res) => {
                    if (err) throw err;
                    const depSalary = [];
                    res.forEach(({salary}) => {
                        const eachSalary = parseInt(`${salary}`);
                        depSalary.push(eachSalary);
                    })
                    totalBudget(depSalary, depName);
                })
            })
    });
};

const totalBudget = (array, department) => {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }
    console.log(`The total budget for the ${department} department is ${sum}.`);
    startApp();
}

