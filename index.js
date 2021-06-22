const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'employee_db'
});

// function to start inquirer prompt
const start = () => {
    inquirer
        .prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'selections',
            choices: [
                'View Employees',
                'View Departments',
                'View Roles',
                'Add Employees',
                'Remove Employees',
                'Update Employee Role',
                'Update Employee Manager'
            ]
        })
        .then((answer) => {
            switch (answer.selections) {
                case 'View Employees':
                    viewEmployees();
                    break;
                case 'View Departments':
                    viewDepartments();
                    break;
                case 'View Roles':
                    viewRoles();
                    break;
                default:
                    connection.end();
                    break;
            }
        });
};


// function to view all employees 
const viewEmployees = () => {
    console.log('Viewing all employees...\n');
    connection.query(`
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department
    FROM employees
    INNER JOIN roles
    ON employees.role_id = roles.id
    INNER JOIN departments 
    ON roles.department_id = departments.id`,
        (err, results) => {
            if (err) throw (err);
            console.table(results);
            start();
        });
};

// function to view all departments
const viewDepartments = () => {
    console.log('Viewing departments...\n');
    connection.query(`
    SELECT * FROM departments`,
        (err, results) => {
            if (err) throw (err);
            console.table(results);
            start();
        })
};

// function to view all roles
const viewRoles = () => {
    console.log('Viewing roles...\n');
    connection.query(`
    SELECT roles.id, roles.title, departments.name AS department, roles.salary
    FROM departments
    INNER JOIN roles
    ON departments.id = roles.department_id`,
        (err, results) => {
            if (err) throw (err);
            console.table(results);
            start();
        })
};


connection.connect((err) => {
    if (err) throw err;
    start();
});