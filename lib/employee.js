class Employee {
    constructor (id, firstName, lastName, title, salary, manager){
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.title = title;
        this.salary = salary;
        this.manager = manager;
    }
    getID() {
        return this.id;
    }
    getFirstName() {
        return this.firstName;
    }
    getLastName() {
        return this.lastName;
    }
    getTitle() {
        return this.title;
    }
    getSalary() {
        return this.salary;
    }
    getManager() {
        return this.manager
    }
}

module.exports = Employee