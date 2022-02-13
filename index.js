const inquirer = require("inquirer");


let sqldb = require("./async_query");
const cTable = require("console.table");

const roles = [];
const departments = [];
const employees = [];

var exit = false;

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
async function viewAllDepartments() {
    let query = "SELECT department.id, department.name as 'department' FROM department";
    const rows = await db.query(query);
    console.table(rows);
}


async function viewAllRoles() {
    let query = "SELECT roles.id, roles.title, roles.salary, department.name as 'department' FROM roles JOIN department ON roles.department_id = department.id";
    const rows = await db.query(query);
    console.table(rows);
}

async function viewAllEmployees() {
    let query = "SELECT e.id, CONCAT(e.last_name, ', ',e.first_name) AS 'Employee', roles.title, e.manager_id from employee e JOIN roles on e.role_id = roles.id";
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
    let departmentId = await findDepartmentId(role.name);
    let args = [role.title, role.salary, departmentId];
    let query = "INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)";
    const rows = await db.query(query, args);
    console.table(rows);
}

async function findAllDepartmentNames() {
    let query = "SELECT name FROM department";
    const rows = await db.query(query);
    let departmentNames = [];
    for (const department of rows) {
        departmentNames.push(department.name);
    }
    return departmentNames;
}

async function findDepartmentId(name) {
    let query = "SELECT id FROM department WHERE department.name = ?";
    let args = [name];
    const rows = await db.query(query, args);
    let departmentId = rows[0].id;
    return departmentId;
};

async function addEmployee() {
    const newEmployee = await getEmployee();
    let roleId = await findRoleId(newEmployee.role);
    let managerId = await findEmployeeId(newEmployee.manager);
    let args = [newEmployee.first_name, newEmployee.last_name, roleId, managerId];
    let query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
    const rows = await db.query(query, args);
    console.table(rows);
};

async function updateEmployee() {
    const EmployeeToUpdate = await getEmployeeToUpdate();
    const employeeId = await findEmployeeId(EmployeeToUpdate.fullname)
    const replacingRole = await getEmployeeNewRole(employeeId);
    const replacingManager = await getEmployeeNewManager(employeeId)
    let roleId = await findRoleId(replacingRole.role);
    let managerId = await findEmployeeId(replacingManager.fullName)
    let args = [roleId, managerId, employeeId];
    let query = "UPDATE employee SET role_id=?, manager_id=? WHERE employee.id=?";
    const rows = await db.query(query, args);
    console.table(rows);
};

async function findAllManagerFullNames() {
    let query = "SELECT first_name, last_name FROM employee WHERE manager_id is null";
    const rows = await db.query(query);
    let managerNames = [];
    for (const manager of rows) {
        managerNames.push(manager.last_name + ", " + manager.first_name,);
    }
    managerNames.push("No Manager");
    return managerNames;
}

async function findEmployeeManagerId(id) {
    let query = "SELECT manager_id FROM employee WHERE employee.id = ?";
    let args = [id];
    const rows = await db.query(query, args);
    let managerId = rows[0].id;
    return id;
}

async function findEmployeeFullName(id) {
    let query = "SELECT first_name, last_name FROM employee WHERE employee.id = ?";
    let args = [id];
    const rows = await db.query(query, args);
    let employeeNames = [];
    for (const employee of rows) {
        employeeNames.push(employee.last_name + ", " + employee.first_name,);
    }
    return employeeNames[0];
}


async function findAllEmployeeFullNames() {
    let query = "SELECT first_name, last_name FROM employee";
    const rows = await db.query(query);
    let employeeNames = [];
    for (const employee of rows) {
        employeeNames.push(employee.last_name + ", " + employee.first_name,);
    }
    return employeeNames;
}

async function findAllRoleTitles() {
    let query = "SELECT title FROM roles";
    const rows = await db.query(query);
    let roleTitles = [];
    for (const role of rows) {
        roleTitles.push(role.title);
    }
    return roleTitles;
}

async function findRoleId(role) {
    let query = "SELECT id FROM roles WHERE roles.title = ?";
    let args = [role];
    const rows = await db.query(query, args);
    let roleId = rows[0].id;
    return roleId;
}


async function findEmployeeId(fullName) {

    let query = "SELECT id FROM employee WHERE first_name = ? AND last_name = ?";
    let allName = fullName.split(", ").reverse();
    if (fullName === "No Manager") return null;
    const rows = await db.query(query, allName);
    let managerId = rows[0].id;
    return managerId;
}

async function exitApp() {
    exit = true;
    const close = await db.close();
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
                    "Add an employee",
                    "Update an employee role",
                    "Exit"
                ]
            }
        ])
}

async function main() {
    while (!exit) {
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

            case 'Add an employee': {
                await addEmployee();
                break;
            }
            case 'Update an employee role': {
                await updateEmployee();
                break;
            }
            case 'Exit': {
                await exitApp();
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
    const departmentNames = await findAllDepartmentNames();
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

async function changeManager() {
    return inquirer
        .prompt([
            {
                type: "list",
                message: "Also need to assing a new Manager?",
                name: "action",
                choices: [
                    "Yes",
                    "No"
                ]
            }
        ])
}

async function getEmployeeNewManager(id) {
    const currentManagerId = await findEmployeeManagerId(id);
    const currentManagerFullName = await findEmployeeFullName(currentManagerId)
    let obj = {
        fullName: currentManagerFullName
    };
    const managerNames = await findAllManagerFullNames();
    const change = await changeManager();
    if (change.action === 'Yes') {
        return inquirer
            .prompt([{
                type: "list",
                message: "Manager: ",
                name: "fullName",
                choices: managerNames
            }]);
    } else return obj;
};



async function getEmployee() {
    const managerNames = await findAllManagerFullNames();
    const roleTitles = await findAllRoleTitles();
    return inquirer
        .prompt([{
            message: "First Name: ",
            name: "first_name"
        },

        {
            message: "Last Name: ",
            name: "last_name"
        },

        {
            type: "list",
            message: "Role: ",
            name: "role",
            choices: roleTitles
        },
        {
            type: "list",
            message: "Manager: ",
            name: "manager",
            choices: managerNames
        }]);
}

async function getEmployeeToUpdate() {
    const employeeNames = await findAllEmployeeFullNames()
    return inquirer
        .prompt([{
            type: "list",
            message: "Employee: ",
            name: "fullname",
            choices: employeeNames
        }]);
}

async function getEmployeeNewRole(id) {
    const roleTitles = await findAllRoleTitles();
    return inquirer
        .prompt([{
            type: "list",
            message: "New Role: ",
            name: "role",
            choices: roleTitles
        }]);
}





main();











