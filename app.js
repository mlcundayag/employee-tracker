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

figlet("Employee\n Manager", (err, data)=> {
    if(err) {
        outputErrorText('Something went wrong...');
        console.dir(err);
        return
    }
    outputWelcomeText(data)
});



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
