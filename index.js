const inquirer = require("inquirer");

const employee = require("./lib/Employee");
const department = require("./lib/Department");
const role = require("./lib/Role");
let sqldb = require("./async_query");
const cTable = require("console.table");

const roles = [];
const departments = [];
const employees = [];


// Connect to database
const db = new sqldb(
    {
        host: 'localhost',
        user: 'root',
        // MySQL password
        password: 'Rek8801853%',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
);


/*
Asynchronous queries to the SQL database
*/
async function getManagerNames() {
    let query = "SELECT * FROM employee WHERE manager_id IS NULL";
    const rows = await db.query(query);
    //console.log("number of rows returned " + rows.length);
    let employeeNames = [];
    for (const employee of rows) {
        employeeNames.push(employee.first_name + " " + employee.last_name);
    }
    return employeeNames;
}

async function viewAllDepartments() {
    let query = "SELECT * FROM department";
    const rows = await db.query(query);
    console.table(rows);
}

async function viewAllRoles() {
    let query = "SELECT * FROM roles";
    const rows = await db.query(query);
    console.table(rows);
}

async function viewAllEmployees() {
    let query = "SELECT * FROM employee";
    const rows = await db.query(query);
    console.table(rows);
}

async function addDepartment() {
    const department = await getDepartment();
    let args = [department.name];
    let query = "INSERT INTO department (name) VALUES (?)";
    const rows = await db.query(query, args);
    console.table(rows);
}

async function addRole() {
    const role = await getRole();
    let departmentId = await getDepartmentId(role.name);
    let args = [role.title, role.salary, departmentId];
    let query = "INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)";
    const rows = await db.query(query, args);
    console.table(rows);
}

async function getDepartmentNames() {
    let query = "SELECT name FROM department";
    const rows = await db.query(query);
    let departmentNames = [];
    for (const department of rows) {
        departmentNames.push(department.name);
    }
    console.log(departmentNames);
    return departmentNames;
}

async function getDepartmentId(name) {
    let query = "SELECT ID FROM department WHERE department.name = ?";
    let args = [name];
    const rows = await db.query(query, args);
    let departmentId = rows[0].ID;
    return departmentId;
}
    



async function mainChoice() {
    return inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "action",
                choices: [
                    "View all departments",
                    "View all roles",
                    "View all employees",
                    "Add a department",
                    "Add a role",
                    "Add a employee",
                    "Update employee role",
                    "Log out"
                ]
            }
        ])
}

async function main() {
    let done = false;
    while (!done) {
        const prompt = await mainChoice();

        switch (prompt.action) {
            case 'View all departments': {
                await viewAllDepartments();
                break;
            }
            case 'View all roles': {
                await viewAllRoles();
                break;
            }
            case 'View all employees': {
                await viewAllEmployees();
                break;
            }
            case 'Add a department': {
                await addDepartment();
                break;
            }
            case 'Add a role': {
                await addRole();
                break;
            }

        }
    }
}


async function getDepartment() {
    return inquirer
        .prompt([{
            message: "Department name: ",
            name: "name"
        }])
}


async function getRole() {
    const departmentNames = await getDepartmentNames();
    return inquirer
        .prompt([{
            message: "Title: ",
            name: "title"
        },

        {
            message: "Salary: ",
            name: "salary"
        },

        {
            type: "list",
            message: "Department: ",
            name: "name",
            choices: departmentNames
            

        }]);
}

main();











