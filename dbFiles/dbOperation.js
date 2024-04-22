const config = require("./dbConfig");
const sql = require("mssql");
const xlsx = require("xlsx");
// const Employee = require('./employee');
// const NewHireEmp = require('./newHireEmp');

//Display the list
// const getEmployees = async (Email, Password) => {
//   try {
//     let pool = await sql.connect(config);
//     let result = await pool
//       .request()
//       .input("Email", sql.VarChar, Email)
//       .input("Password", sql.VarChar, Password)
//       //  .query('SELECT * FROM UserAccount WHERE Email = @Email AND Password = @Password');
//       .query(
//         "SELECT UserId, FirstName, LastName, UserName, Email, MiddleName, ProfilePhoto FROM UserAccount WHERE Email = @Email AND Password = @Password"
//       );

//     return result.recordset;
//   } catch (error) {
//     throw error;
//   }
// };
const getEmployees = async (Email, Password) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input('Email', sql.VarChar, Email)
      .input('Password', sql.VarChar, Password)
      .query('SELECT * FROM UserAccount WHERE Email = @Email');

    return result.recordset;
  } catch (error) {
    throw error;
  }
};
// insert user account to USER ACCOUNT table
const insertEmployee = async (Employee) => {
  try {
    let pool = await sql.connect(config);
    let employee = await pool
      .request()
      .input("LastName", Employee.LastName)
      .input("FirstName", Employee.FirstName)
      .input("MiddleName", Employee.MiddleName)
      .input("Email", Employee.Email)
      .input("UserName", Employee.UserName)
      .input("Password", Employee.Password).query(`
              INSERT INTO UserAccount (LastName, FirstName, MiddleName, Email, UserName, Password)
              VALUES (@LastName, @FirstName, @MiddleName, @Email, @UserName, @Password)
          `);
    return employee;
  } catch (error) {
    console.error(error);
    throw new Error("Error inserting employee");
  }
};

//store user account to Employee table
const insertNewHire = async (newHire) => {
  try {
    let pool = await sql.connect(config);
    let newemployee = await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("EmployeeName", newHire.EmployeeName)
      .input("FirstName", newHire.FirstName)
      .input("MiddleName", newHire.MiddleName)
      .input("LastName", newHire.LastName)
      .input("MaidenName", newHire.MaidenName)
      .input("Birthdate", newHire.Birthdate)
      .input("Age", newHire.Age)
      .input("BirthMonth", newHire.BirthMonth)
      .input("AgeBracket", newHire.AgeBracket)
      .input("Gender", newHire.Gender)
      .input("MaritalStatus", newHire.MaritalStatus)
      .input("SSS", newHire.SSS)
      .input("PHIC", newHire.PHIC)
      .input("HDMF", newHire.HDMF)
      .input("TIN", newHire.TIN)
      .input("HRANID", newHire.HRANID)
      .input("ContactNumber", newHire.ContactNumber)
      .input("EmailAddress", newHire.EmailAddress).query(`
            INSERT INTO EmpPersonalDetails (EmployeeId, EmployeeName, FirstName, MiddleName, LastName, MaidenName, 
                Birthdate, Age, BirthMonth, AgeBracket, Gender,
                MaritalStatus, SSS, PHIC, HDMF, TIN, HRANID, ContactNumber, 
                EmailAddress) 
            VALUES (@EmployeeId, @EmployeeName, @FirstName, @MiddleName, @LastName, @MaidenName,
                    @Birthdate, @Age, @BirthMonth, @AgeBracket, @Gender, @MaritalStatus,
                    @SSS, @PHIC, @HDMF, @TIN, @HRANID, @ContactNumber, @EmailAddress)
        `);

    // Insert employee info into EmployeeInfo table
    let employeeInfo = await pool
      .request()
      .input("HRANID", newHire.HRANID)
      .input("DateHired", newHire.DateHired)
      .input("Tenure", newHire.Tenure)
      .input("HRANID", newHire.HRANID)
      .input("DateHired", newHire.EmployeeLevel)
      .input("Tenure", newHire.ProjectCode)
      .input("HRANID", newHire.ProjectName)
      .input("DateHired", newHire.Designation)
      .input("Tenure", newHire.Department)
      .input("HRANID", newHire.ProdCode)
      .input("DateHired", newHire.ProdDesc)
      .input("Tenure", newHire.EmployementStatus)
      .input("HRANID", newHire.EmployeeStatus)
      .input("DateHired", newHire.WorkWeekType)
      .input("Tenure", newHire.Shift)
      .input("HRANID", newHire.WorkArrangement)
      .input("DateHired", newHire.RateClass)
      .input("Tenure", newHire.Rate)
      .input("HRANID", newHire.ManagerID)
      .input("DateHired", newHire.ManagerName)
      .input("Tenure", newHire.PMPICID)
      .input("HRANID", newHire.DU)
      .input("DateHired", newHire.DUHID)
      .input("Tenure", newHire.DUHName)
      .input("DateHired", newHire.IsManager)
      .input("Tenure", newHire.IsPMPIC)
      .input("HRANID", newHire.IsIndividualContributor)
      .input("DateHired", newHire.IsActive)
      .input("Tenure", newHire.HRANType)
      .input("HRANID", newHire.TITOType)
      .input("DateHired", newHire.Position)
      .input("Tenure", newHire.PositionLevel)
      .input("HRANID", newHire.EmpID)
      .input("DateHired", newHire.IsDUHead).query(`
      INSERT INTO EmployeeInformation (HRANID, DateHired, Tenure, EmployeeLevel, ProjectCode,
        ProjectName, Designation, Department, ProdCode, ProdDesc, EmployementStatus, EmployeeStatus,
        WorkWeekType, Shift, WorkArrangement, RateClass, Rate, ManagerID, ManagerName, PMPICID,
        PMPICIDName, DU, DUHID, DUHName, IsManager, IsPMPIC, IsIndividualContributor, IsActive,
        HRANType, TITOType, Position, PositionLevel, EmpID, IsDUHead
        )
      VALUES (@HRANID, @DateHired, @Tenure, @EmployeeLevel, @ProjectCode,
        @ProjectName, @Designation, @Department, @ProdCode, @ProdDesc, @EmployementStatus, @EmployeeStatus,
        @WorkWeekType, @Shift, @WorkArrangement, @RateClass, @Rate, @ManagerID, @ManagerName, @PMPICID,
        @PMPICIDName, @DU, @DUHID, @DUHName, @IsManager, @IsPMPIC, @IsIndividualContributor, @IsActive,
        @HRANType, @TITOType, @Position, @PositionLevel, @EmpID, @IsDUHead)
    `);
    //insert data in ProjectCode tbl
    let projectCode = await pool
      .request()
      .input("ProjectCode", newHire.ProjectCode)
      .input("ProjectName", newHire.ProjectName)
      .input("DUID", newHire.DUID)
      .input("IsActive", newHire.IsActive).query(`
      INSERT INTO ProjectCode (ProjectCode, ProjectName, DUID, IsActive)
      VALUES (@ProjectCode, @ProjectName, @DUID, @IsActive)
    `);
    //insert data in Shift tbl
    let shift = await pool
      .request()
      .input("ShiftCode", newHire.ShiftCode)
      .input("ShiftName", newHire.ShiftName)
      .input("LevelID", newHire.LevelID)
      .input("ShiftType", newHire.ShiftType).query(`
      INSERT INTO Shift (ShiftCode, ShiftName, LevelID, ShiftType)     
      VALUES (@ShiftCode, @ShiftName, @LevelID, @ShiftType)
    `);
    //insert data in Delivery Unit tbl
    let deliveryUnit = await pool
      .request()
      .input("DUCode", newHire.DUCode)
      .input("DUName", newHire.DUName)
      .input("IsActive", newHire.IsActive).query(`
      INSERT INTO Shift (DUCode, DUName, IsActive)   
      VALUES (@DUCode, @DUName, @IsActive)
    `);
    //insert data in Department tbl
    let department = await pool
      .request()
      .input("DepartmentName", newHire.DepartmentName)
      .input("DUID", newHire.DUID).query(`
        INSERT INTO Shift (DepartmentName, DUIDe)   
        VALUES (@DepartmentName, @DUID)
      `);
    //insert data in Department tbl
    let address = await pool
      .request()
      .input("HouseNumber", newHire.HouseNumber)
      .input("CompleteAddress", newHire.CompleteAddress)
      .input("Barangay", newHire.Barangay)
      .input("CityMunicipality", newHire.CityMunicipality)
      .input("Province", newHire.Province)
      .input("Region", newHire.Region)
      .input("Country", newHire.Country)
      .input("ZipCode", newHire.ZipCode)
      .input("Landmark", newHire.Landmark)
      .input("IsPermanent", newHire.IsPermanent)
      .input("IsEmergency", newHire.IsEmergency)
      .input("EmpID", newHire.EmpID).query(`
      INSERT INTO Department ( HouseNumber, CompleteAddress, Barangay, CityMunicipality,
        Province, Region, Country, ZipCode, Landmark, IsPermanent, IsEmergency, EmpID)   
      VALUES (@HouseNumber, @CompleteAddress, @Barangay, @CityMunicipality, @Province, @Region,
        @Country, @ZipCode, @Landmark, @IsPermanent, @IsEmergency, @EmpID)
    `);
    //insert data in Address tbl
    let education = await pool
      .request()
      .input("EducationLevel", newHire.EducationLevel)
      .input("School", newHire.School)
      .input("Degree", newHire.Degree)
      .input("MajorCourse", newHire.MajorCourse)
      .input("HonorRank", newHire.HonorRank)
      .input("UnitsEarned", newHire.UnitsEarned)
      .input("DateFrom", newHire.DateFrom)
      .input("DateTo", newHire.DateTo)
      .input("Session", newHire.Session)
      .input("MonthCompleted", newHire.MonthCompleted)
      .input("IsEmergency", newHire.Completed)
      .input("EmpID", newHire.EmpID).query(`
                INSERT INTO Address ( EducationLevel, School, Degree, MajorCourse,
                  HonorRank, UnitsEarned, DateFrom, DateTo, Session, MonthCompleted, Completed, EmpID)   
                VALUES (@EducationLevel, @School, @Degree, @MajorCourse, @HonorRank, @UnitsEarned,
                  @DateFrom, @DateTo, @Session, @MonthCompleted, @Completed, @EmpID)
              `);
    //insert data in Contact tbl
    let contact = await pool
      .request()
      .input("ContactNumber", newHire.ContactNumber)
      .input("EmpID", newHire.EmpID).query(`
      INSERT INTO Contact (ContactNumber, EmpID)   
      VALUES (@ContactNumber, @EmpID)
    `);
    //insert data in EmergencyContactNumber tbl
    let emergencyContact = await pool
      .request()
      .input("FullName", newHire.FullName)
      .input("AddressID", newHire.AddressID)
      .input("ContactId", newHire.ContactId)
      .input("EmpID", newHire.EmpID).query(`
                    INSERT INTO EmergencyContactNumber (FullName, AddressID, ContactId, EmpID)   
                    VALUES (@FullName, @AddressID, @ContactId, @EmpID)
                  `);
        //insert data in Dependent tbl
        let dependent = await pool
        .request()
        .input("FullName", newHire.FullName)
        .input("Relationship", newHire.Relationship)
        .input("BIrthDate", newHire.BIrthDate)
        .input("Occupation", newHire.Occupation)
        .input("Address", newHire.Address)
        .input("City", newHire.City)
        .input("Province", newHire.Province)
        .input("PostalCode", newHire.PostalCode)
        .input("PhoneNum", newHire.PhoneNum)
        .input("Beneficiary", newHire.Beneficiary)
        .input("BeneficiaryDate", newHire.BeneficiaryDate)
        .input("Insurance", newHire.Insurance)
        .input("InsuranceDate", newHire.InsuranceDate)
        .input("Remarks", newHire.Remarks)
        .input("CompanyPaid", newHire.CompanyPaid)
        .input("HMOProvider", newHire.HMOProvider)
        .input("HMOPolicyNumber", newHire.HMOPolicyNumber)
        .input("TypeOfCoverage", newHire.TypeOfCoverage)
        .input("EmpID", newHire.EmpID).query(`
                  INSERT INTO Dependent ( FullName, Relationship, BIrthDate, Occupation,
                    Address, City, Province, PostalCode, PhoneNum, Beneficiary, BeneficiaryDate, 
                    Insurance, InsuranceDate, Remarks, CompanyPaid, HMOProvider, HMOPolicyNumber
                    TypeOfCoverage, EmpID)   
                  VALUES (@FullName, @Relationship, @BIrthDate, @Occupation, @Address, @City,
                    @Province, @PostalCode, @PhoneNum, @Beneficiary, @BeneficiaryDate, @Insurance,
                    @InsuranceDate, @Remarks, @CompanyPaid, @HMOProvider, @HMOPolicyNumber
                    @TypeOfCoverage, @EmpID)
                `);
    //insert data in Product tbl
    let product = await pool
      .request()
      .input("ProdCode", newHire.ProdCode)
      .input("ProdDesc", newHire.ProdDesc).query(`
      INSERT INTO Product (ProdCode, ProdDesc)   
      VALUES (@ProdCode, @ProdDesc)
    `);
                
    return {
      newemployee,
      employeeInfo,
      projectCode,
      shift,
      deliveryUnit,
      department,
      address,
      education,
      contact,
      emergencyContact,
      dependent,
      product
    };

    // return newemployee;
  } catch (error) {
    console.log(error);
  }
};
// Retrieve all new hire employees from the database
const getAllNewHireEmployees = async () => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query("SELECT * FROM EmpPersonalDetails");
    return result.recordset;
  } catch (error) {
    console.error("Error fetching new hire employees:", error);
    throw error;
  }
};
// Retrieve all users account from the database
const getAllUserAccount = async () => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query("SELECT * FROM UserAccount");
    return result.recordset;
  } catch (error) {
    console.error("Error fetching users account:", error);
    throw error;
  }
};
// Retrieve employee by ID from the database
const getEmployeeById = async (employeeId) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .query("SELECT * FROM EmpPersonalDetails WHERE EmployeeId = @EmployeeId");

    if (result.recordset.length === 0) {
      return null; // Return null if employee with given ID is not found
    }

    return result.recordset[0]; // Return the first employee found with the given ID
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    throw error;
  }
};

const updateEmployeeById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("EmployeeName", sql.VarChar(255), updatedEmployeeData.EmployeeName)
      .input("LastName", sql.VarChar(255), updatedEmployeeData.LastName)
      .input("FirstName", sql.VarChar(255), updatedEmployeeData.FirstName)
      .input("MiddleName", sql.VarChar(255), updatedEmployeeData.MiddleName)
      .input("MaidenName", sql.VarChar(255), updatedEmployeeData.MaidenName)
      .input("Birthdate", sql.VarChar(255), updatedEmployeeData.Birthdate)
      .input("Age", sql.VarChar(255), updatedEmployeeData.Age)
      .input("BirthMonth", sql.VarChar(255), updatedEmployeeData.BirthMonth)
      .input("AgeBracket", sql.VarChar(255), updatedEmployeeData.AgeBracket)
      .input("Gender", sql.VarChar(255), updatedEmployeeData.Gender)
      .input(
        "MaritalStatus",
        sql.VarChar(255),
        updatedEmployeeData.MaritalStatus
      )
      .input("SSS", sql.VarChar(255), updatedEmployeeData.SSS)
      .input("PHIC", sql.VarChar(255), updatedEmployeeData.PHIC)
      .input("HDMF", sql.VarChar(255), updatedEmployeeData.HDMF)
      .input("TIN", sql.VarChar(255), updatedEmployeeData.TIN)
      .input("HRANID", sql.VarChar(255), updatedEmployeeData.HRANID)
      .input(
        "ContactNumber",
        sql.VarChar(255),
        updatedEmployeeData.ContactNumber
      )
      .input("EmailAddress", sql.VarChar(255), updatedEmployeeData.EmailAddress)
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
    console.error("Error updating employee by ID:", error);
    throw error;
  }
};
//route to delete employee by ID from the database
const deleteEmployeeById = async (employeeId) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .query("DELETE FROM EmpPersonalDetails WHERE EmployeeId = @EmployeeId");

    return result;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};
//route to delete employee by ID from the database
const deleteUsersById = async (userId) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("UserId", sql.VarChar, userId)
      .query("DELETE FROM UserAccount WHERE UserId = @UserId");

    return result;
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error;
  }
};
// Function to retrieve personal details by UserId
const getPersonalDetailsByUserId = async (UserId) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("UserId", sql.Int, UserId)
      .query(
        `SELECT LastName, FirstName, MiddleName, Email, UserName, ISNULL(ProfilePhoto, '/img/user.png') AS ProfilePhoto FROM UserAccount WHERE UserId = @UserId`
      );

    if (result.recordset.length === 0) {
      return null; // Return null if employee with given ID is not found
    }

    return result.recordset[0]; // Return the first employee found with the given ID
  } catch (error) {
    console.error("Error retrieving personal details:", error);
    throw error;
  }
};
// // Function to retrieve userId from the database
// const getUserData = async (query) => {
//     try {
//       const pool = await sql.connect(config); // Assuming 'config' is your database configuration
//       const result = await pool.request().query(query);
//       return result.recordset;
//     } catch (error) {
//       console.error('Error retrieving userId from database:', error);
//       throw error;
//     }
//   };
// Function to retrieve user data from the database based on userId
const getUserData = async (userId) => {
  try {
    // Connect to the database
    const pool = await sql.connect(config);

    // SQL query to fetch user data based on userId
    const query = `
      SELECT 
        UserId, FirstName, LastName, UserName, Email, MiddleName, ISNULL(ProfilePhoto, '/img/user.png') AS ProfilePhoto 
      FROM 
        UserAccount 
      WHERE 
        UserId = @userId
    `;

    // Execute the query with the provided userId
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query(query);

    // If user data found, return it
    if (result.recordset.length > 0) {
      return result.recordset[0];
    } else {
      // If no user data found for the provided userId, return null
      return null;
    }
  } catch (error) {
    // Log any errors that occur during the database operation
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// // Function to update profile photo by UserId
// const updateProfilePhoto = async (userId, profilePhoto) => {
//   try {
//     const pool = await sql.connect(config); // Using already configured connection
//     const request = pool.request();

//     const query = `UPDATE UserAccount SET ProfilePhoto = @ProfilePhoto WHERE UserId = @UserId`;
//     request.input("UserId", sql.Int, userId);
//     request.input("ProfilePhoto", sql.VarChar, profilePhoto);

//     await request.query(query);
//     console.log("Profile photo updated successfully");
//   } catch (err) {
//     console.error("Error updating profile photo:", err);
//     throw err;
//   }
// };
// Function to update profile photo by UserId
const updateProfilePhoto = async (userId, profilePhoto) => {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    const query = `UPDATE UserAccount SET ProfilePhoto = @ProfilePhoto WHERE UserId = @UserId`;
    request.input("UserId", sql.Int, userId);
    request.input("ProfilePhoto", sql.VarChar, profilePhoto);

    await request.query(query);
    console.log("Profile photo updated successfully");
  } catch (err) {
    console.error("Error updating profile photo:", err);
    throw err;
  }
};
// Database operation to update users details
const updatePersonalDetails = async (userId, updatedDetails) => {
  try {
    const { FirstName, LastName, MiddleName, Email, UserName } = updatedDetails;
    const pool = await sql.connect(); // Using already configured connection
    const request = pool.request();

    const query = `
      UPDATE UserAccount 
      SET 
        FirstName = @FirstName,
        LastName = @LastName,
        MiddleName = @MiddleName,
        Email = @Email,
        UserName = @UserName
      WHERE UserId = @UserId
    `;
    request.input("UserId", sql.Int, userId);
    request.input("FirstName", sql.VarChar, FirstName);
    request.input("LastName", sql.VarChar, LastName);
    request.input("MiddleName", sql.VarChar, MiddleName);
    request.input("Email", sql.VarChar, Email);
    request.input("UserName", sql.VarChar, UserName);

    const result = await request.query(query); // Execute the query
    console.log("Personal details updated successfully");
    return result;
  } catch (err) {
    console.error("Error updating personal details:", err);
    throw err;
  }
};

module.exports = {
  insertEmployee,
  getEmployees,
  insertNewHire,
  getAllNewHireEmployees,
  updateEmployeeById,
  getEmployeeById,
  deleteEmployeeById,
  updateProfilePhoto,
  updatePersonalDetails,
  getPersonalDetailsByUserId,
  getAllUserAccount,
  getUserData,
  deleteUsersById,
};
