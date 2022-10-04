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
                    'View All Departments',
                    'View All Roles',
                    'View All Employees',
                    'View Employees By Manager',
                    'View Employees By Department',
                    'View Department Budget',
                    'Add a Department',
                    'Add a Role',
                    'Add an Employee',
                    'Update a Department',
                    'Update a Role',
                    'Update an Employee',
                    'Remove a Department',
                    'Remove a Role',
                    'Remove an Employee',
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
            //Bonus view employee by manager
            if (menu === 'View Employees By Manager') {
                viewbyManager();
            }
            //Bonus view employee by department
            if (menu === 'View Employees By Department') {
                viewbyDepartment();
            }
            //Bonus view department budget
            if (menu === 'View Department Budget') {
                viewBudget();
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
        role.salary AS 'salary ($)',
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

//updating employee
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
        db.query(`SELECT * FROM role;`, (err, roleResults) => {
            if (err) outputErrorText(err);
            const roleList = [];
            roleResults.forEach(({ title, id }) => {
                roleList.push({
                    name: title,
                    value: id
                });
            });
            //BONUS: update manager - render manager list
            db.query(`SELECT * FROM employee;`, (err, managerResults) => {
                if (err) outputErrorText(err);
                const managerList = [{
                    name: 'None',
                    value: 0
                }];
                managerResults.forEach(({ first_name, last_name, id }) => {
                    managerList.push({
                        name: `${first_name} ${last_name}`,
                        value: id
                    })
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
                        },
                        //BONUS: update manager - choose from the list
                        {
                            type: "list",
                            name: "updateManager",
                            message: `\x1b[33mPlease select their new manager...\x1b[0m`,
                            choices: managerList
                        }
                    ])
                    .then(data => {
                        let managerID = data.updateManager !== 0 ? data.updateManager : null;
                        db.query(`UPDATE employee SET ? WHERE ?`, [
                            {
                                role_id: data.updateTitle,
                                manager_id: managerID
                            },
                            {
                                id: data.updateEmployee
                            }
                        ], (err, res) => {
                            if (err) throw err;
                            outputSuccessText(`successfully updated this employee's role and manager`);
                            viewEmployees()
                        })
                    })
            })
        })
    })
}

//delete an employee
const removeEmployee = () => {
    db.query(`SELECT * FROM employee`, (err, results) => {
        if (err) outputErrorText(err);
        const employeeList = [];
        results.forEach(({ first_name, last_name, id }) => {
            employeeList.push({
                name: `${first_name} ${last_name}`,
                value: id
            });
        });
        const increment = () => {
            db.query(`ALTER TABLE employee AUTO_INCREMENT = 1;`, (err, res) => {
                if (err) throw err;
            })
        }
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "delEmployee",
                    message: `\x1b[33mWhich employee do you want to remove?\x1b[0m`,
                    choices: employeeList
                }
            ])
            .then(data => {
                db.query(`DELETE FROM employee WHERE id = ?`,
                    [data.delEmployee]
                    , (err, res) => {
                        if (err) throw err;
                        outputSuccessText(`successfully remove employee ${data.delEmployee}`);
                        increment();
                        viewEmployees();
                    })
            })
    })
}

//view all roles 
const viewRoles = () => {
    db.query(`SELECT 
        role.id,
        role.title,
        department.name AS 'department',
        role.salary AS 'salary ($)'
        FROM role
        LEFT JOIN department ON role.department_id = department.id`, (err, results) => {
        console.log("\n\n");
        console.table(results);
        mainMenu()
    })
}

//adding a role
const addRole = () => {
    //generate department list
    db.query(`SELECT department.id, department.name
            FROM department;`, (err, deptResults) => {
        if (err) outputErrorText(err);
        const deptList = [];
        deptResults.forEach(({ id, name }) => {
            deptList.push({
                name: name,
                value: id
            });
        });
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: `\x1b[33mWhat is the role's title?\x1b[0m`,
                },
                {
                    type: "input",
                    name: "salary",
                    message: `\x1b[33mHow much is the role's salary?\x1b[0m (don't include dollar sign and commas)`,
                    validate: function (name) {
                        if (isNaN(name) || (!name)) {
                            outputErrorText("Please enter role's salary (don't include dollar sign and commas)...")
                        } else {
                            return true
                        }
                    }
                },
                {
                    type: "list",
                    name: "department",
                    message: `\x1b[33mWhich department does the role belong to?\x1b[0m`,
                    choices: deptList
                }
            ])
            .then(data => {
                db.query(`INSERT INTO role SET ?`, {
                    title: data.title,
                    salary: data.salary,
                    department_id: data.department
                }, (err, res) => {
                    if (err) throw err;
                    outputSuccessText(`successfully added ${data.title} with a salary of ${data.salary} and id ${res.insertId}`);
                    viewRoles();
                })
            })
    })
}

//updating a role
const updateRole = () => {
    //generate role list
    db.query(`SELECT * FROM role;`, (err, roleResults) => {
        if (err) outputErrorText(err);
        const roleList = [];
        roleResults.forEach(({ title, id }) => {
            roleList.push({
                name: title,
                value: id
            })
        });
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "updateRole",
                    message: `\x1b[33mWhich title do you want to update salary?\x1b[0m`,
                    choices: roleList
                },
                {
                    type: "input",
                    name: "updateSalary",
                    message: `\x1b[33mPlease enter their new salary...\x1b[0m (don't include dollar sign and commas)`,
                    validate: function (name) {
                        if (isNaN(name) || (!name)) {
                            outputErrorText("Please enter role's salary (don't include dollar sign and commas)...")
                        } else {
                            return true
                        }
                    }
                }
            ])
            .then(data => {
                db.query(`UPDATE role SET ? WHERE ?`, [
                    {
                        salary: data.updateSalary
                    },
                    {
                        id: data.updateRole
                    }
                ], (err, res) => {
                    if (err) throw err;
                    outputSuccessText(`successfully updated role's salary with ${data.updateSalary}`);
                    viewRoles()
                })
            })
    })
}

//remove a role
const removeRole = () => {
    db.query(`SELECT * FROM role`, (err, results) => {
        if (err) outputErrorText(err);
        const roleList = [];
        results.forEach(({ title, id }) => {
            roleList.push({
                name: title,
                value: id
            })
        });
        const increment = () => {
            db.query(`ALTER TABLE role AUTO_INCREMENT = 1;`, (err, res) => {
                if (err) throw err;
            });
        }
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "delRole",
                    message: `\x1b[33mWhich role do you want to remove?\x1b[0m`,
                    choices: roleList
                }
            ])
            .then(data => {
                db.query(`DELETE FROM role WHERE id = ?`,
                    [data.delRole],
                    (err, res) => {
                        outputSuccessText(`successfully remove role ${data.delRole}`);
                        increment();
                        viewRoles();
                    })
            })
    })
}

//view all departments
const viewDepartments = () => {
    db.query(`SELECT department.id, department.name AS 'department' FROM department`, (err, res) => {
        console.log("\n\n");
        console.table(res);
        mainMenu()
    })
}

//add a department
const addDepartment = () => {
    inquirer
        .prompt([{
            type: "input",
            name: "depName",
            message: `\x1b[33mWhat is the name of the department?\x1b[0m`,
        }])
        .then(data => {
            db.query(`INSERT INTO department SET ?`, { name: data.depName }, (err, res) => {
                if (err) throw err;
                outputSuccessText(`successfully added ${data.depName} with id ${res.insertId}`);
                viewDepartments();
            })
        })
}

//update department name
const updateDepartment = () => {
    //generate department list
    db.query(`SELECT * FROM department;`, (err, depResult) => {
        if (err) outputErrorText(err);
        const deptList = [];
        depResult.forEach(({ name, id }) => {
            deptList.push({
                name: name,
                value: id
            })
        });
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "updateDept",
                    message: `\x1b[33mWhich department do you want to update name?\x1b[0m`,
                    choices: deptList
                },
                {
                    type: "input",
                    name: "newNameDept",
                    message: `\x1b[33mPlease enter new name for this department...\x1b[0m`,
                }
            ])
            .then(data => {
                db.query(`UPDATE department SET ? WHERE ?`, [
                    {
                        name: data.newNameDept
                    },
                    {
                        id: data.updateDept
                    }
                ], (err, res) => {
                    if (err) throw err;
                    outputSuccessText(`successfully change department name to ${data.newNameDept}`);
                    viewDepartments()
                })
            })
    })
}

//delete department 
const removeDepartment = () => {
    db.query(`SELECT * FROM department`, (err, results) => {
        if (err) outputErrorText(err);
        const deptList = [];
        results.forEach(({ name, id }) => {
            deptList.push({
                name: name,
                value: id
            })
        });
        const increment = () => {
            db.query(`ALTER TABLE department AUTO_INCREMENT = 1;`, (err, res) => {
                if (err) throw err;
            });
        }
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "delDept",
                    message: `\x1b[33mWhich department do you want to remove?\x1b[0m`,
                    choices: deptList
                }
            ])
            .then(data => {
                db.query(`DELETE FROM department WHERE id = ?`, [data.delDept], (err, res) => {
                    if (err) throw err;
                    outputSuccessText(`successfully remove department ${data.delDept}`);
                    increment();
                    viewDepartments();
                })
            })
    })
}

//BONUS: view by employee by manager
const viewbyManager = () => {
    db.query(`SELECT * FROM employee;`, (err, mgrResults) => {
        if(err)outputErrorText(err);
        const mgrList = [];
        mgrResults.forEach(({ first_name, last_name, id}) => {
            mgrList.push({
                name: `${first_name} ${last_name}`,
                value: id
            });
        });
        inquirer
        .prompt([
            {
                type: "list",
                name: "viewMgr",
                message: `\x1b[33mPlease select manager...\x1b[0m`,
                choices: mgrList
            }
        ])
        .then((data) => {
            db.query(`SELECT
            CONCAT(manager.first_name, ' ', manager.last_name) AS 'manager',
            employee.first_name, 
            employee.last_name,
            role.title,
            department.name AS 'department',
            role.salary AS 'salary ($)'
            FROM employee
            LEFT JOIN role ON employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee manager ON employee.manager_id = manager.id
            WHERE manager.id = ${data.viewMgr}`, (err, res) => {
                if (err) throw err;
                outputSuccessText(`You are viewing employees by manager`);
                console.log("\n");
                console.table(res);
                mainMenu()
            })
        })
    })
}

//BONUS: view employees by department
const viewbyDepartment = () => {
    db.query(`SELECT * FROM department;`, (err, deptRes) => {
        if(err)outputErrorText(err);
        const deptList = [];
        deptRes.forEach(({ name, id }) =>{
            deptList.push({
                name: name,
                value: id
            })
        })
        inquirer
        .prompt([
            {
                type: "list",
                name: "viewbyDept",
                message: `\x1b[33mPlease select dept...\x1b[0m`,
                choices: deptList
            }
        ])
        .then((data) => {
            db.query(`SELECT
            department.name AS 'department',
            employee.first_name, 
            employee.last_name,
            role.title,
            role.salary AS 'salary ($)',
            CONCAT(manager.first_name, ' ', manager.last_name) AS 'manager'
            FROM employee
            LEFT JOIN role ON employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee manager ON employee.manager_id = manager.id
            WHERE department.id = ${data.viewbyDept}`, (err, res) => {
                if (err) throw err;
                outputSuccessText(`You are viewing employees by department`);
                console.log("\n");
                console.table(res);
                mainMenu()
            })
        })
    })
}

//BONUS: view department budget 
const viewBudget = () => {
    db.query(`SELECT * FROM department;`, (err, deptRes) => {
        if(err) outputErrorText(err);
        const deptList = [];
        deptRes.forEach(({ name, id }) =>{
            deptList.push({
                name: name,
                value: id
            })
        })
        inquirer
        .prompt([
            {
                type: "list",
                name: "budget",
                message: `\x1b[33mPlease select department...\x1b[0m`,
                choices: deptList
            }
        ])
        .then(data => {
            db.query(`SELECT
            department.name AS 'department',
            SUM(role.salary) AS 'budget'
            FROM employee
            LEFT JOIN role ON employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee manager ON employee.manager_id = manager.id
            WHERE department.id = ${data.budget}`, (err, res) => {
                if (err) throw err;
                outputSuccessText(`You are viewing department budget`);
                console.log("\n");
                console.table(res);
                mainMenu()
            })
        })
    })
}

welcome()
