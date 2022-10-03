//import classes
const Department = require('./lib/department');
const Role = require('./lib/role');
const Employee = require('./lib/employee');

//import dependencies
const inquirer = require('inquirer');
const mySQL = require('mysql2');
const consoleTable = require('console.table');
const figlet = require('figlet');

//terminal color output style
const outputErrorText = (text) => console.log(`\x1b[31m${text}\x1b[0m`);
const outputWelcomeText = (text) => console.log(`\x1b[33m${text}\x1b[0m`);
const outputSuccessText = (text) => console.log(`\x1b[32m${text}\x1b[0m`);

//establish sql database connection
const db = mySQL.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_tracker_db'
},
    outputSuccessText('Connected to database')
);

//render welcome sign using figlet
const welcome = () => {
    figlet("Employee\nTracker", function (err, data) {
        if (err) {
            outputErrorText('Something went wrong...');
            console.dir(err);
            return
        }
        outputWelcomeText(data)
        db
        mainMenu()
    })
    return
};

//create query for the main menu
const mainMenu = () => {
    return inquirer
        .prompt([
            {
                type: "list",
                name: "menu",
                message: `\x1b[33mWhat would you like to do?\x1b[0m`,
                choices: [
                    'View All Employees',
                    'Add an Employee',
                    'Update an Employee',
                    'Remove an Employee',
                    'View All Roles',
                    'Add a Role',
                    'Update a Role',
                    'Remove a Role',
                    'View All Departments',
                    'Add a Department',
                    'Update a Department',
                    'Remove a Department',
                    'Exit'
                ]
            }
        ])
        .then((answer) => {
            const { menu } = answer;
            if (menu === 'View All Employees') {
                viewEmployees();
            }
            if (menu === 'Add an Employee') {
                addEmployee();
            }
            if (menu === 'Update an Employee') {
                updateEmployee();
            }
            if (menu === 'Remove an Employee') {
                removeEmployee();
            }
            if (menu === 'View All Roles') {
                viewRoles();
            }
            if (menu === 'Add a Role') {
                addRole();
            }
            if (menu === 'Update a Role') {
                updateRole();
            }
            if (menu === 'Remove a Role') {
                removeRole();
            }
            if (menu === 'View All Departments') {
                viewDepartments();
            }
            if (menu === 'Add a Department') {
                addDepartment();
            }
            if (menu === 'Update a Department') {
                updateDepartment();
            }
            if (menu === 'Remove a Department') {
                removeDepartment();
            }
            if (menu === 'Exit') {
                outputSuccessText('Success!\nThanks for using Employee Tracker! 😀 ');
            }
        })
}

const viewEmployees = () => {
    db.query(`SELECT
        employee.id, 
        employee.first_name, 
        employee.last_name,
        role.title,
        department.name AS 'department',
        role.salary,
        CONCAT(manager.first_name, ' ', manager.last_name) AS 'manager'
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id`, (err, results) => {
        console.log("\n\n");
        console.table(results);
        mainMenu()
    })
}



welcome()



//What would you like to do?
// view all employees
// update employee role
// view all roles
// add role
// view all departments
// add department

// view all department


// all roles
// id
// title
// department
// salary

// all employees
// id
// first name
// last name
// title
// sales
// salary
// manager

// add department [input]
// = added [input] to database

// add role [input]
// -name
// -salary
// -dapartment

// add employee
// -first name
// -last name
// -role
// -manager
