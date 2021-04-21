const mysql = require("mysql");
const inquirer = require("inquirer");
const { ADDRGETNETWORKPARAMS } = require("node:dns");

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
                    console.log(`Invalid actions: ${ answer.action}`);
                    break;
            }
        });
};