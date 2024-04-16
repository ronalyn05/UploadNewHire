const config = require('./dbConfig');
const sql = require('mssql');
const xlsx = require('xlsx');
// const Employee = require('./employee');
// const NewHireEmp = require('./newHireEmp');

//Display the list
const getEmployees = async (Email, Password) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool.request()
        .input('Email', sql.VarChar, Email)
        .input('Password', sql.VarChar, Password)
        .query('SELECT * FROM UserAccount WHERE Email = @Email AND Password = @Password');
    
      return result.recordset;
    } catch (error) {
      throw error;
    }
  };

//insert user account to USER ACCOUNT table
const insertEmployee = async (Employee) => {
    try {
        let pool = await sql.connect(config);
        let employee = await pool.request()
            .input('UserName', Employee.UserName)
            .input('LastName', Employee.LastName)
            .input('FirstName', Employee.FirstName)
            .input('MiddleName', Employee.MiddleName)
            .input('Email', Employee.Email)
            .input('Password', Employee.Password)
            .query(`
                INSERT INTO UserAccount ( LastName, FirstName, MiddleName, Email, Password, UserName)
                VALUES ( @LastName, @FirstName, @MiddleName, @Email, @Password, @UserName)
            `); 
        return employee;
    } catch (error) {
        console.log(error);
    }
}

//store user account to Employee table
const insertNewHire = async (newHire) => {
    try {
        let pool = await sql.connect(config);
        let newemployee = await pool.request()
            .input('EmployeeId', newHire.EmployeeId)
            .input('EmployeeName', newHire.EmployeeName)
            .input('FirstName', newHire.FirstName)
            .input('MiddleName', newHire.MiddleName)
            .input('LastName', newHire.LastName)
            .input('MaidenName', newHire.MaidenName)
            .input('Birthdate', newHire.Birthdate)
            .input('Age', newHire.Age)
            .input('BirthMonth', newHire.BirthMonth)
            .input('AgeBracket', newHire.AgeBracket)
            .input('Gender', newHire.Gender)
            .input('MaritalStatus', newHire.MaritalStatus)
            .input('SSS', newHire.SSS)
            .input('PHIC', newHire.PHIC)
            .input('HDMF', newHire.HDMF)
            .input('TIN', newHire.TIN)
            // .input('AddressID', newHire.EmpAddressID)
            .input('HRANID', newHire.HRANID)
            .input('ContactNumber', newHire.ContactNumber)
            .input('EmailAddress', newHire.EmailAddress)
            .query(`
            INSERT INTO EmpPersonalDetails (EmployeeId, EmployeeName, FirstName, MiddleName, LastName, MaidenName, 
                Birthdate, Age, BirthMonth, AgeBracket, Gender,
                MaritalStatus, SSS, PHIC, HDMF, TIN, HRANID, ContactNumber, 
                EmailAddress) 
            VALUES (@EmployeeId, @EmployeeName, @FirstName, @MiddleName, @LastName, @MaidenName,
                    @Birthdate, @Age, @BirthMonth, @AgeBracket, @Gender, @MaritalStatus,
                    @SSS, @PHIC, @HDMF, @TIN, @HRANID, @ContactNumber, @EmailAddress)
        `); 
            
        return newemployee;
    } catch (error) {
        console.log(error);
    }
}
// Retrieve all new hire employees from the database
const getAllNewHireEmployees = async () => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM EmpPersonalDetails');
        return result.recordset;
    } catch (error) {
        console.error('Error fetching new hire employees:', error);
        throw error;
    }
};
// Retrieve employee by ID from the database
const getEmployeeById = async (employeeId) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .input('EmployeeId', sql.VarChar, employeeId)
            .query('SELECT * FROM EmpPersonalDetails WHERE EmployeeId = @EmployeeId');

        if (result.recordset.length === 0) {
            return null; // Return null if employee with given ID is not found
        }
        
        return result.recordset[0]; // Return the first employee found with the given ID
    } catch (error) {
        console.error('Error fetching employee by ID:', error);
        throw error;
    }
};

const updateEmployeeById = async (employeeId, updatedEmployeeData) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool.request()
        .input('EmployeeId', sql.VarChar, employeeId)
        .input('EmployeeName', sql.VarChar(255), updatedEmployeeData.EmployeeName)
        .input('LastName', sql.VarChar(255), updatedEmployeeData.LastName)
        .input('FirstName', sql.VarChar(255), updatedEmployeeData.FirstName)
        .input('MiddleName', sql.VarChar(255), updatedEmployeeData.MiddleName)
        .input('MaidenName', sql.VarChar(255), updatedEmployeeData.MaidenName)
        .input('Birthdate', sql.VarChar(255), updatedEmployeeData.Birthdate)
        .input('Age', sql.VarChar(255), updatedEmployeeData.Age)
        .input('BirthMonth', sql.VarChar(255), updatedEmployeeData.BirthMonth)
        .input('AgeBracket', sql.VarChar(255), updatedEmployeeData.AgeBracket)
        .input('Gender', sql.VarChar(255), updatedEmployeeData.Gender)
        .input('MaritalStatus', sql.VarChar(255), updatedEmployeeData.MaritalStatus)
        .input('SSS', sql.VarChar(255), updatedEmployeeData.SSS)
        .input('PHIC', sql.VarChar(255), updatedEmployeeData.PHIC)
        .input('HDMF', sql.VarChar(255), updatedEmployeeData.HDMF)
        .input('TIN', sql.VarChar(255), updatedEmployeeData.TIN)
        .input('HRANID', sql.VarChar(255), updatedEmployeeData.HRANID)
        .input('ContactNumber', sql.VarChar(255), updatedEmployeeData.ContactNumber)
        .input('EmailAddress', sql.VarChar(255), updatedEmployeeData.EmailAddress)
        
        .query(`
          UPDATE EmpPersonalDetails 
          SET EmployeeId = @EmployeeId,
              EmployeeName = @EmployeeName,
              LastName = @LastName, 
              FirstName = @FirstName,
              MiddleName = @MiddleName,
              MaidenName = @MaidenName, 
              Birthdate = @Birthdate,
              Age = @Age,
              BirthMonth = @BirthMonth,
              AgeBracket = @AgeBracket,
              Gender = @Gender,
              MaritalStatus = @MaritalStatus,
              SSS = @SSS,
              PHIC = @PHIC,
              HDMF = @HDMF,
              TIN = @TIN,
              HRANID = @HRANID, 
              ContactNumber = @ContactNumber,
              EmailAddress = @EmailAddress
          WHERE EmployeeId = @employeeId
        `);
  
      return result;
    } catch (error) {
      console.error('Error updating employee by ID:', error);
      throw error;
    }
  };
//route to delete employee by ID from the database
  const deleteEmployeeById = async (employeeId) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('EmployeeId', sql.VarChar, employeeId)
            .query('DELETE FROM EmpPersonalDetails WHERE EmployeeId = @EmployeeId');

        return result;
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
    
};


module.exports = {
    insertEmployee, 
    getEmployees ,
    insertNewHire,
    getAllNewHireEmployees,
    updateEmployeeById,
    getEmployeeById,
    deleteEmployeeById
};