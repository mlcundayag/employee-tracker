class Role{
    constructor (id, title, department, salary){
        this.id = id;
        this.title = title;
        this.department = department;
        this.salary = salary;
    }
    getID() {
        return this.id;
    }
    getTitle() {
        return this.title;
    }
    getDepartment(){
        return this.department;
    }
    getSalary(){
        return this.salary;
    }
}

module.exports = Role