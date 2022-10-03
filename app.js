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
const outputWelcomeText = (text)  => console.log(`\x1b[33m${text}\x1b[0m`);
const outputSuccessText = (text) => console.log(`\x1b[32m${text}\x1b[0m`);

const welcome = () => {
    figlet("Employee\n Manager", (err, data) => {
    if(err) {
        outputErrorText('Something went wrong...');
        console.dir(err);
        return
    }
    outputWelcomeText(data)
})
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
}

welcome()
mainMenu()




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
