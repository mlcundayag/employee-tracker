class Department {
    constructor (name, id) {
        this.name = name;
        this.id = id;
    }
    getName() {
        return this.name;
    }
    getID() {
        return this.id
    }
}

module.exports = Department