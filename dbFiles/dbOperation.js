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
      .input("Email", sql.VarChar, Email)
      .input("Password", sql.VarChar, Password)
      .query("SELECT * FROM UserAccount WHERE Email = @Email");

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

const insertNewHire = async (newHire) => {
  try {
    let pool = await sql.connect(config);

    // Validate and convert bit fields
    const validateAndConvertBit = (value) => {
      if (value === "0" || value === "1") {
        return Boolean(parseInt(value));
      } else {
        throw new Error(
          "Invalid value for bit field. Please enter either '0' for 'yes' or '1' for 'no'."
        );
      }
    };

    // Insert into EmpPersonalDetails table
    await pool
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
      // .input("ContactNumber", newHire.ContactNumber)
      .input("EmailAddress", newHire.EmailAddress).query(`
        INSERT INTO EmpPersonalDetails (EmployeeId, EmployeeName, FirstName, MiddleName, LastName, MaidenName, 
          Birthdate, Age, BirthMonth, AgeBracket, Gender, MaritalStatus, SSS, PHIC, HDMF, TIN, EmailAddress) 
        VALUES (@EmployeeId, @EmployeeName, @FirstName, @MiddleName, @LastName, @MaidenName,
          @Birthdate, @Age, @BirthMonth, @AgeBracket, @Gender, @MaritalStatus, @SSS, @PHIC, @HDMF, @TIN, @EmailAddress)
      `);
      //insert contact number to Contact table
      await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("ContactNumber", newHire.ContactNumber)
      .query(`INSERT INTO Contact (EmployeeId, ContactNumber)
      VALUES (@EmployeeId, @ContactNumber)`);

    // Insert into EmployeeInformation table with validated bit fields
    await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("HRANID", newHire.HRANID)
      .input("DateHired", newHire.DateHired)
      .input("Tenure", newHire.Tenure)
      .input("EmployeeLevel", newHire.EmployeeLevel)
      .input("ProjectCode", newHire.ProjectCode)
      .input("ProjectName", newHire.ProjectName)
      .input("Designation", newHire.Designation)
      .input("Department", newHire.Department)
      .input("ProdCode", newHire.ProdCode)
      .input("ProdDesc", newHire.ProdDesc)
      .input("EmploymentStatus", newHire.EmploymentStatus)
      .input("EmployeeStatus", newHire.EmployeeStatus)
      .input("WorkWeekType", newHire.WorkWeekType)
      .input("Shift", newHire.Shift)
      .input("WorkArrangement", newHire.WorkArrangement)
      .input("RateClass", newHire.RateClass)
      .input("Rate", newHire.Rate)
      .input("ManagerID", newHire.ManagerID)
      .input("ManagerName", newHire.ManagerName)
      .input("PMPICID", newHire.PMPICID)
      .input("PMPICIDName", newHire.PMPICIDName)
      .input("DU", newHire.DU)
      .input("DUHID", newHire.DUHID)
      .input("DUHName", newHire.DUHName)
      .input("IsManager", validateAndConvertBit(newHire.IsManager))
      .input("IsPMPIC", validateAndConvertBit(newHire.IsPMPIC))
      .input("IsIndividualContributor", validateAndConvertBit(newHire.IsIndividualContributor))
      .input("IsActive", validateAndConvertBit(newHire.IsActive))
      .input("HRANType", newHire.HRANType)
      .input("TITOType", newHire.TITOType)
      .input("Position", newHire.Position)
      .input("PositionLevel", newHire.PositionLevel)
      .input("IsDUHead", validateAndConvertBit(newHire.IsDUHead)).query(`
        INSERT INTO EmployeeInformation (EmployeeId, HRANID, DateHired, Tenure, EmployeeLevel, ProjectCode,
          ProjectName, Designation, Department, ProdCode, ProdDesc, EmploymentStatus, EmployeeStatus,
          WorkWeekType, Shift, WorkArrangement, RateClass, Rate, ManagerID, ManagerName, PMPICID,
          PMPICIDName, DU, DUHID, DUHName, IsManager, IsPMPIC, IsIndividualContributor, IsActive,
          HRANType, TITOType, Position, PositionLevel, IsDUHead)
        VALUES (@EmployeeId, @HRANID, @DateHired, @Tenure, @EmployeeLevel, @ProjectCode, @ProjectName, 
          @Designation, @Department, @ProdCode, @ProdDesc, @EmploymentStatus, @EmployeeStatus, @WorkWeekType, 
          @Shift, @WorkArrangement, @RateClass, @Rate, @ManagerID, @ManagerName, @PMPICID, @PMPICIDName, @DU, 
          @DUHID, @DUHName, @IsManager, @IsPMPIC, @IsIndividualContributor, @IsActive, @HRANType, @TITOType, 
          @Position, @PositionLevel, @IsDUHead)
      `);
      // Insert into Address table
    await pool
    .request()
    .input("EmployeeId", newHire.EmployeeId)
    .input("HouseNumber", newHire.HouseNumber)
    .input("CompleteAddress", newHire.CompleteAddress)
    .input("Barangay", newHire.Barangay)
    .input("CityMunicipality", newHire.CityMunicipality)
    .input("Province", newHire.Province)
    .input("Region", newHire.Region)
    .input("Country", newHire.Country)
    .input("Zipcode", newHire.Zipcode)
    .input("LandMark", newHire.LandMark)
    .input("IsPermanent", validateAndConvertBit(newHire.IsPermanent))
    .input("IsEmergency", validateAndConvertBit(newHire.IsEmergency))
    .query(`
      INSERT INTO Address (EmployeeId, HouseNumber, CompleteAddress, Barangay, CityMunicipality, Province, 
        Region, Country, Zipcode, LandMark, IsPermanent, IsEmergency) 
      VALUES (@EmployeeId, @HouseNumber, @CompleteAddress, @Barangay, @CityMunicipality, @Province,
        @Region, @Country, @Zipcode, @LandMark, @IsPermanent, @IsEmergency)
    `);
    //insert into Education table
    await pool
    .request()
    .input("EmployeeId", newHire.EmployeeId)
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
    .input("Completed", newHire.Completed)
    .query(`
    INSERT INTO Education (EmployeeId, EducationLevel, School, Degree, MajorCourse, HonorRank, UnitsEarned, DateFrom, 
      DateTo, Session, MonthCompleted, Completed)
      VALUES (@EmployeeId, @EducationLevel, @School, @Degree, @MajorCourse, @HonorRank, @UnitsEarned, @DateFrom, 
        @DateTo, @Session, @MonthCompleted, @Completed)
    `);
     //Insert into EmergencyContact table
     await pool
     .request()
     .input("EmployeeId", newHire.EmployeeId)
     .input("EmContactFullName", newHire.EmContactFullName)
     .input("EmContactPhoneNumber", newHire.EmContactPhoneNumber)
     .input("EmContactHouseNo", newHire.EmContactHouseNo)
     .input("EmContactCompleteAddress", newHire.EmContactCompleteAddress)
     .input("EmContactBarangay", newHire.EmContactBarangay)
     .input("EmContactCityMunicipality", newHire.EmContactCityMunicipality)
     .input("EmContactProvince", newHire.EmContactProvince)
     .input("EmContactRegion", newHire.EmContactRegion)
     .input("EmContactCountry", newHire.EmContactCountry)
     .input("EmContactZipcode", newHire.EmContactZipcode)
     .input("Is_Permanent",validateAndConvertBit(newHire.Is_Permanent))
     .input("Is_Emergency", validateAndConvertBit(newHire.Is_Emergency))
     .query(`
     INSERT INTO EmergencyContact ( EmployeeId, EmContactFullName, EmContactPhoneNumber, EmContactHouseNo, EmContactCompleteAddress, 
      EmContactBarangay, EmContactCityMunicipality, EmContactProvince, EmContactRegion, EmContactCountry, EmContactZipcode
      Is_Permanent, Is_Emergency)
     VALUES ( @EmployeeId, @EmContactFullName, @EmContactPhoneNumber, @EmContactHouseNo, @EmContactCompleteAddress, @EmContactBarangay, 
      @EmContactCityMunicipality, @EmContactProvince, @EmContactRegion, @EmContactCountry, @EmContactZipcode
      @Is_Permanent, @Is_Emergency)
     `);
    //Insert into Project table
    await pool
    .request()
    .input("EmployeeId", newHire.EmployeeId)
    .input("DUID", newHire.DUID)
    .input("ProjectCode", newHire.ProjectCode)
    .input("ProjectName", newHire.ProjectName)
    .input("IsActive", validateAndConvertBit(newHire.IsActive))
    .query(`
    INSERT INTO Project( EmployeeId, DUID, ProjectCode, ProjectName, DUID, IsActive)
    VALUES ( @EmployeeId, @DUID, @ProjectCode, @ProjectName, @IsActive)
    `);
    //Insert into DeliveryUnit table
    await pool
    .request()
    .input("EmployeeId", newHire.EmployeeId)
    .input("DUCode", newHire.DUCode)
    .input("DUName", newHire.DUName)
    .input("IsActive", validateAndConvertBit(newHire.IsActive))
    .query(`
    INSERT INTO DeliveryUnit ( EmployeeId, DUCode, DUName, IsActive)
    VALUES ( @EmployeeId, @DUCode, @DUName, @IsActive)
    `);
      //Insert into Shift table
      await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("ShiftCode", newHire.ShiftCode)
      .input("ShiftName", newHire.ShiftName)
      .input("LevelID", newHire.LevelID)
      .input("ShiftType", newHire.ShiftType)
      .query(`
      INSERT INTO Shift ( EmployeeId, ShiftCode, ShiftName, LevelID, ShiftType)
      VALUES ( @EmployeeId, @ShiftCode, @ShiftName, @LevelID, @ShiftType)
      `);
      //insert into Department table
      await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("DUID", newHire.DUID)
      .input("DepartmentName", newHire.DepartmentName)
      .query(`
      INSERT INTO Department (EmployeeId, DUID, DepartmentName)
      VALUES (@EmployeeId, @DUID, @DepartmentName)`);
      //INSERT INTO PRODUCT
      await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("ProdId", newHire.ProdId)
      .input("ProdCode", newHire.ProdCode)
      .input("ProdDesc", newHire.ProdDesc)
      .query(`
      INSERT INTO Product (EmployeeId, ProdId, ProdCode, ProdDesc)
      VALUES (@EmployeeId, @ProdId, @ProdCode, @ProdDesc)`);
      // INSERT INTO DEPENDENT
      await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("FullName", newHire.FullName)
      .input("Relationship", newHire.Relationship)
      .input("BirthofDate", newHire.BirthofDate)
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
      .query(`
      INSERT INTO Dependents (
        EmployeeId, FullName, Relationship, BirthofDate, Occupation,
        Address, City, Province, PostalCode, PhoneNum, Beneficiary,
        BeneficiaryDate, Insurance, InsuranceDate, Remarks, CompanyPaid,
        HMOProvider, HMOPolicyNumber, TypeOfCoverage
      )
      VALUES (
        @EmployeeId, @FullName, @Relationship, @BirthofDate, @Occupation,
        @Address, @City, @Province, @PostalCode, @PhoneNum, @Beneficiary,
        @BeneficiaryDate, @Insurance, @InsuranceDate, @Remarks, @CompanyPaid,
        @HMOProvider, @HMOPolicyNumber, @TypeOfCoverage
      )`);





    return "Data successfully uploaded.";
  } catch (error) {
    console.error("Error occurred while inserting new hire data:", error);
    throw new Error("Failed to insert new hire data.");
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
      .query(`
        SELECT PD.*, EI.*, ADDRESS.*
        FROM EmpPersonalDetails AS PD
        INNER JOIN EmployeeInformation AS EI ON PD.EmployeeId = EI.EmployeeId
        INNER JOIN Address AS ADDRESS ON PD.EmployeeId = ADDRESS.EmployeeId
        WHERE PD.EmployeeId = @EmployeeId
      `);

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
      .input("MaritalStatus", sql.VarChar(255), updatedEmployeeData.MaritalStatus)
      .input("SSS", sql.VarChar(255), updatedEmployeeData.SSS)
      .input("PHIC", sql.VarChar(255), updatedEmployeeData.PHIC)
      .input("HDMF", sql.VarChar(255), updatedEmployeeData.HDMF)
      .input("TIN", sql.VarChar(255), updatedEmployeeData.TIN)
      // .input("HRANID", sql.VarChar(255), updatedEmployeeData.HRANID)
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
//update employee info by id
const updateEmployeeInfoById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await // Add inputs for other fields similarly
    pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("HRANID", sql.VarChar(255), updatedEmployeeData.HRANID)
      .input("DateHired", sql.Date, updatedEmployeeData.DateHired)
      .input("Tenure", sql.VarChar(255), updatedEmployeeData.Tenure)
      .input("EmployeeLevel", sql.VarChar(255), updatedEmployeeData.EmployeeLevel)
      .input("ProjectCode", sql.VarChar(255), updatedEmployeeData.ProjectCode)
      .input("ProjectName", sql.VarChar(255), updatedEmployeeData.ProjectName)
      .input("Designation", sql.VarChar(255), updatedEmployeeData.Designation)
      .input("Department", sql.VarChar(255), updatedEmployeeData.Department)
      .input("ProdCode", sql.VarChar(255), updatedEmployeeData.ProdCode)
      .input("ProdDesc", sql.VarChar(255), updatedEmployeeData.ProdDesc)
      .input("EmploymentStatus", sql.VarChar(255), updatedEmployeeData.EmploymentStatus)
      .input("EmployeeStatus", sql.VarChar(255), updatedEmployeeData.EmployeeStatus)
      .input("WorkWeekType", sql.VarChar(255), updatedEmployeeData.WorkWeekType)
      .input("Shift", sql.VarChar(255), updatedEmployeeData.Shift)
      .input("WorkArrangement", sql.VarChar(255), updatedEmployeeData.WorkArrangement)
      .input("RateClass", sql.VarChar(255), updatedEmployeeData.RateClass)
      .input("Rate", sql.VarChar(255), updatedEmployeeData.Rate)
      .input("ManagerID", sql.VarChar(255), updatedEmployeeData.ManagerID)
      .input("ManagerName", sql.VarChar(255), updatedEmployeeData.ManagerName)
      .input("PMPICID", sql.VarChar(255), updatedEmployeeData.PMPICID)
      .input("PMPICIDName", sql.VarChar(255), updatedEmployeeData.PMPICIDName)
      .input("DUHID", sql.VarChar(255), updatedEmployeeData.DUHID)
      .input("DUHName", sql.VarChar(255), updatedEmployeeData.DUHName)
      .input("HRANType", sql.VarChar(255), updatedEmployeeData.HRANType)
      .input("TITOType", sql.VarChar(255), updatedEmployeeData.TITOType)
      .input("Position", sql.VarChar(255), updatedEmployeeData.Position)
      .input("PositionLevel", sql.VarChar(255), updatedEmployeeData.PositionLevel)
      .query(`
          UPDATE EmployeeInformation 
          SET HRANID = @HRANID,
              DateHired = @DateHired,
              Tenure = @Tenure,
              EmployeeLevel = @EmployeeLevel,
              ProjectCode = @ProjectCode,
              ProjectName = @ProjectName,
              Designation = @Designation,
              Department = @Department,
              ProdCode = @ProdCode,
              ProdDesc = @ProdDesc,
              EmploymentStatus = @EmploymentStatus,
              EmployeeStatus = @EmployeeStatus,
              WorkWeekType = @WorkWeekType,
              Shift = @Shift,
              WorkArrangement = @WorkArrangement,
              RateClass = @RateClass,
              Rate = @Rate,
              ManagerID = @ManagerID,
              ManagerName = @ManagerName,
              PMPICID = @PMPICID,
              PMPICIDName = @PMPICIDName,
              DUHID = @DUHID,
              DUHName = @DUHName,
              HRANType = @HRANType,
              TITOType = @TITOType,
              Position = @Position,
              PositionLevel = @PositionLevel
          WHERE EmployeeId = @EmployeeId
        `);

    return result;
  } catch (error) {
    console.error("Error updating employee information by ID:", error);
    throw error;
  }
};
//update employee address by id
const updateEmployeeAddressById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("HouseNumber", sql.VarChar(255), updatedEmployeeData.HouseNumber)
      .input("CompleteAddress", sql.VarChar(255), updatedEmployeeData.CompleteAddress)
      .input("Barangay", sql.VarChar(255), updatedEmployeeData.Barangay)
      .input("CityMunicipality", sql.VarChar(255), updatedEmployeeData.CityMunicipality)
      .input("Province", sql.VarChar(255), updatedEmployeeData.Province)
      .input("Region", sql.VarChar(255), updatedEmployeeData.Region)
      .input("Country", sql.VarChar(255), updatedEmployeeData.Country)
      .input("Zipcode", sql.VarChar(255), updatedEmployeeData.Zipcode)
      .input("Landmark", sql.VarChar(255), updatedEmployeeData.Landmark)
      .input("IsPermanent", sql.Bit, updatedEmployeeData.IsPermanent ? 1 : 0) // Convert boolean to 0 or 1
      .input("IsEmergency", sql.Bit, updatedEmployeeData.IsEmergency ? 1 : 0) // Convert boolean to 0 or 1
      .query(`
          UPDATE Address 
          SET HouseNumber = @HouseNumber,
              CompleteAddress = @CompleteAddress,
              Barangay = @Barangay,
              CityMunicipality = @CityMunicipality,
              Province = @Province,
              Region = @Region,
              Country = @Country,
              Zipcode = @Zipcode,
              Landmark = @Landmark,
              IsPermanent = @IsPermanent,
              IsEmergency = @IsEmergency
          WHERE EmployeeId = @EmployeeId
        `);

    return result;
  } catch (error) {
    console.error("Error updating employee address by ID:", error);
    throw error;
  }
};

//delete employee data
const deleteEmployeeById = async (employeeId) => {
  try {
    let pool = await sql.connect(config);
    const transaction = new sql.Transaction(pool);

    try {
      // Begin a transaction
      await transaction.begin();

      // Delete from EmployeeInformation table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM EmployeeInformation WHERE EmployeeId = @EmployeeId");

      // Delete from Address table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM Address WHERE EmployeeId = @EmployeeId");

      // Delete from EmpPersonalDetails table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM EmpPersonalDetails WHERE EmployeeId = @EmployeeId");

      // Commit the transaction if all DELETE operations succeed
      await transaction.commit();

      // Return success message or result
      return { message: "Employee deleted successfully" };
    } catch (error) {
      // Rollback the transaction if any DELETE operation fails
      await transaction.rollback();
      console.error("Error deleting employee:", error);
      throw error; // handle or rethrow the error as necessary
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};
//delete all records from multiple table
const deleteAllRecords = async () => {
  try {
    let pool = await sql.connect(config);
    const transaction = new sql.Transaction(pool);

    try {
      // Begin a transaction
      await transaction.begin();

      // Delete all records from Address table
      await transaction.request().query("DELETE FROM Address");

      // Delete all records from EmployeeInformation table
      await transaction.request().query("DELETE FROM EmployeeInformation");

      // Delete all records from EmpPersonalDetails table
      await transaction.request().query("DELETE FROM EmpPersonalDetails");

      // Commit the transaction if all DELETE operations succeed
      await transaction.commit();

      // Return success message or result
      return { message: "All records deleted successfully" };
    } catch (error) {
      // Rollback the transaction if any DELETE operation fails
      await transaction.rollback();
      console.error("Error deleting records:", error);
      throw error; // handle or rethrow the error as necessary
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};



// const deleteEmployeeById = async (employeeId) => {
//   try {
//     let pool = await sql.connect(config);
//     let result = await pool
//       .request()
//       .input("EmployeeId", sql.VarChar, employeeId)
//       .query("DELETE FROM EmpPersonalDetails WHERE EmployeeId = @EmployeeId");

//     return result;
//   } catch (error) {
//     console.error("Error deleting employee:", error);
//     throw error;
//   }
// };

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
  updateEmployeeInfoById,
  updateEmployeeAddressById
};
