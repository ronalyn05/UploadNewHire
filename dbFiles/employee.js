class Employee {
    constructor(LastName, FirstName, MiddleName, Email, UserName, Password, Role) {
        this.UserId = null; // UserId will be auto-incremented by the database
        this.LastName = LastName;
        this.FirstName = FirstName;
        this.MiddleName = MiddleName;
        this.Email = Email;
        this.UserName = UserName;
        this.Password = Password;
        this.Role = Role;
        //this.ProfilePhoto = ProfilePhoto;
    }
}

module.exports = Employee;
