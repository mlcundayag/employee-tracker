//import dependencies
const inquirer = require('inquirer');
const mySQL = require('mysql2');
require('console.table');
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

db.connect(function (err) {
    if (err) throw err;
})


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
        .then((data) => {
            const { menu } = data;
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
                db.end()
            }
        })
}

//View all employees
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

// // example code, does not work, remove 
// function viewDepartments() {
//     db.findAllDepartments()
//     .then(([rows]) => {
//         let dapartments = rows
//         console.log(departments)
//     })
//     .then(() => loadMorePrompts())
// }


//adding an employee
const addEmployee = () => {
    //generate roles list
    db.query(`SELECT role.id, role.title
            FROM role;`, (err, roleResults) => {
        if (err) outputErrorText(err);
        const roleList = [];
        roleResults.forEach(({ id, title }) => {
            roleList.push({
                name: title,
                value: id
            });
        });
        //generate managers list
        db.query(`SELECT * FROM employee;`, (err, manResults) => {
            if (err) outputErrorText(err);
            const managerList = [{
                name: 'None',
                value: 0
            }];
            manResults.forEach(({ first_name, last_name, id }) => {
                managerList.push({
                    name: `${first_name} ${last_name}`,
                    value: id
                });
            });

            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "firstName",
                        message: `\x1b[33mWhat is the employee's first name?\x1b[0m`,
                    },
                    {
                        type: "input",
                        name: "lastName",
                        message: `\x1b[33mWhat is the employee's last name?\x1b[0m`,
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: `\x1b[33mWhat is the employee's role?\x1b[0m`,
                        choices: roleList
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: `\x1b[33mWho is the employee's manager?\x1b[0m`,
                        choices: managerList
                    }
                ])
                .then(data => {
                    let managerID = data.manager !== 0 ? data.manager : null;
                    db.query('INSERT INTO employee SET ?', {
                        first_name: data.firstName,
                        last_name: data.lastName,
                        role_id: data.role,
                        manager_id: managerID
                    }, (err, res) => {
                        if (err) throw err;
                        outputSuccessText(`successfully inserted employee ${data.firstName} ${data.lastName} with id ${res.insertId}`);
                        viewEmployees()
                    })
                })
        });
    })
}

const updateEmployee = () => {
    //generate employee list
    db.query(`SELECT * FROM employee;`, (err, employeeResults) => {
        if (err) outputErrorText(err);
        const employeeList = [];
        employeeResults.forEach(({ first_name, last_name, id }) => {
            employeeList.push({
                name: `${first_name} ${last_name}`,
                value: id
            });
        });
        //generate role list
        db.query(`SELECT * FROM ROLE;`, (err, roleResults) => {
            if (err) outputErrorText(err);
            const roleList = [];
            roleResults.forEach(({ title, id }) => {
                roleList.push({
                    name: title,
                    value: id
                });
            });
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "updateEmployee",
                        message: `\x1b[33mWhich employee do you want to update title?\x1b[0m`,
                        choices: employeeList
                    },
                    {
                        type: "list",
                        name: "updateTitle",
                        message: `\x1b[33mPlease select their new title...\x1b[0m`,
                        choices: roleList
                    }
                ])
                .then(data => {
                    db.query(`UPDATE employee SET ? WHERE ?`, [
                        {
                            role_id: data.updateTitle
                        },
                        {
                            id: data.updateEmployee
                        }
                    ], (err, res) => {
                        if (err) throw err;
                        outputSuccessText(`successfully updated employee ${data.updateEmployee} role with ${data.updataTitle}`);
                        viewEmployees()
                    })
                })
        })
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
