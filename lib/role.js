class Role {
    constructor (title, salary, department_id) {
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
    }

    getTitle() {
        return this.title
    }

    getSalary() {
        return this.salary
    }

    getDepartment_id() {
        return this.department_id
    }

}