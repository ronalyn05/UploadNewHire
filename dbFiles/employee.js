class Employee {
    constructor(LastName, FirstName, MiddleName, Email, UserName, Password) {
        this.UserId = null; // UserId will be auto-incremented by the database
        this.LastName = LastName;
        this.FirstName = FirstName;
        this.MiddleName = MiddleName;
        this.Email = Email;
        this.UserName = UserName;
        this.Password = Password;
        //this.ProfilePhoto = ProfilePhoto;
    }
}

module.exports = Employee;
