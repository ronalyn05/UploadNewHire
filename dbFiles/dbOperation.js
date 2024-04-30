const config = require("./dbConfig");
const sql = require("mssql");
const xlsx = require("xlsx");

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
      .input("Password", Employee.Password)
      .input("Role", Employee.Role)
      .query(`
              INSERT INTO UserAccount (LastName, FirstName, MiddleName, Email, UserName, Password, Role)
              VALUES (@LastName, @FirstName, @MiddleName, @Email, @UserName, @Password, @Role)
          `);
    return employee;
  } catch (error) {
    console.error(error);
    throw new Error("Error inserting employee");
  }
};
//insertion of the list of employee data to multiple table
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
      .input("IsEmergency", validateAndConvertBit(newHire.IsEmergency)).query(`
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
      .input("Completed", newHire.Completed).query(`
    INSERT INTO Education (EmployeeId, EducationLevel, School, Degree, MajorCourse, HonorRank, UnitsEarned, DateFrom, 
      DateTo, Session, MonthCompleted, Completed)
      VALUES (@EmployeeId, @EducationLevel, @School, @Degree, @MajorCourse, @HonorRank, @UnitsEarned, @DateFrom, 
        @DateTo, @Session, @MonthCompleted, @Completed)
    `);
    // //Insert into EmergencyContact table
    // await pool
    //   .request()
    //   .input("EmployeeId", newHire.EmployeeId)
    //   .input("ContactId", newHire.ContactId)
    //   .input("EmContactFullName", newHire.EmContactFullName)
    //   .query(`
    //  INSERT INTO EmergencyContactNumber ( EmployeeId, EmContactFullName, ContactId)
    //  VALUES ( @EmployeeId, @EmContactFullName, @ContactId)
    //  `);

    // Insert into DeliveryUnit table
    await pool
      .request()
      // .input("DUID", newHire.DUID)
      .input("EmployeeId", newHire.EmployeeId)
      .input("DUCode", newHire.DUCode)
      .input("DUName", newHire.DUName)
      .input("Is_Active", validateAndConvertBit(newHire.Is_Active)).query(`
  INSERT INTO DeliveryUnit ( EmployeeId, DUCode, DUName, Is_Active)
  VALUES ( @EmployeeId, @DUCode, @DUName, @Is_Active)
`);
    // Insert into Project table
    await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("ProjectCode", newHire.ProjectCode)
      .input("ProjectName", newHire.ProjectName)
      .input("is_Active", validateAndConvertBit(newHire.is_Active)).query(`
    INSERT INTO Project(EmployeeId, DUID, ProjectCode, ProjectName, is_Active)
    SELECT @EmployeeId, DU.DUID, @ProjectCode, @ProjectName, @is_Active
    FROM DeliveryUnit DU
    WHERE DU.EmployeeId = @EmployeeId
`);

    //Insert into Shift table
    await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("ShiftCode", newHire.ShiftCode)
      .input("ShiftName", newHire.ShiftName)
      .input("LevelID", newHire.LevelID)
      .input("ShiftType", newHire.ShiftType).query(`
      INSERT INTO Shift ( EmployeeId, ShiftCode, ShiftName, LevelID, ShiftType)
      VALUES ( @EmployeeId, @ShiftCode, @ShiftName, @LevelID, @ShiftType)
      `);
    //insert into Department table
    await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("DUID", newHire.DUID)
      .input("DepartmentName", newHire.DepartmentName).query(`
      INSERT INTO Department (EmployeeId, DUID, DepartmentName)
      SELECT @EmployeeId, DU.DUID, @DepartmentName
    FROM DeliveryUnit DU
    WHERE DU.EmployeeId = @EmployeeId
      `);

    //INSERT INTO PRODUCT
    await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("ProdCode", newHire.ProdCode)
      .input("ProdDesc", newHire.ProdDesc).query(`
      INSERT INTO Product (EmployeeId, ProdCode, ProdDesc)
      VALUES (@EmployeeId, @ProdCode, @ProdDesc)`);
    // INSERT INTO DEPENDENT
    await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("FullName", newHire.FullName)
      .input("Relationship", newHire.Relationship)
      .input("DateOfBirth", newHire.DateOfBirth)
      .input("Occupation", newHire.Occupation)
      .input("Address", newHire.Address)
      .input("City", newHire.City)
      .input("DepProvince", newHire.DepProvince)
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
      .input("TypeOfCoverage", newHire.TypeOfCoverage).query(`
      INSERT INTO Dependent 
      (
        EmployeeId, FullName, Relationship, DateOfBirth, Occupation,
        Address, City, DepProvince, PostalCode, PhoneNum, Beneficiary,
        BeneficiaryDate, Insurance, InsuranceDate, Remarks, CompanyPaid,
        HMOProvider, HMOPolicyNumber, TypeOfCoverage
      )
      VALUES 
      (
        @EmployeeId, @FullName, @Relationship, @DateOfBirth, @Occupation,
        @Address, @City, @DepProvince, @PostalCode, @PhoneNum, @Beneficiary,
        @BeneficiaryDate, @Insurance, @InsuranceDate, @Remarks, @CompanyPaid,
        @HMOProvider, @HMOPolicyNumber, @TypeOfCoverage
      )`);
      //INSERTION OF EMPLOYEE INFORMATION
          // Insert into EmployeeInformation table with validated bit fields
    await pool
    .request()
    .input("EmployeeId", newHire.EmployeeId)
    .input("HRANID", newHire.HRANID)
    .input("DateHired", newHire.DateHired)
    .input("Tenure", newHire.Tenure)
    .input("EmployeeLevel", newHire.EmployeeLevel)
    .input("Designation", newHire.Designation)
    .input("Department", newHire.Department)
    .input("EmploymentStatus", newHire.EmploymentStatus)
    .input("EmployeeStatus", newHire.EmployeeStatus)
    .input("WorkWeekType", newHire.WorkWeekType)
    .input("WorkArrangement", newHire.WorkArrangement)
    .input("RateClass", newHire.RateClass)
    .input("Rate", newHire.Rate)
    .input("ManagerID", newHire.ManagerID)
    .input("ManagerName", newHire.ManagerName)
    .input("PMPICID", newHire.PMPICID)
    .input("PMPICIDName", newHire.PMPICIDName)
    .input("DUHID", newHire.DUHID)
    .input("DUHName", newHire.DUHName)
    .input("IsManager", validateAndConvertBit(newHire.IsManager))
    .input("IsPMPIC", validateAndConvertBit(newHire.IsPMPIC))
    .input(
      "IsIndividualContributor",
      validateAndConvertBit(newHire.IsIndividualContributor)
    )
    .input("IsActive", validateAndConvertBit(newHire.IsActive))
    .input("HRANType", newHire.HRANType)
    .input("TITOType", newHire.TITOType)
    .input("Position", newHire.Position)
    .input("PositionLevel", newHire.PositionLevel)
    .input("IsDUHead", validateAndConvertBit(newHire.IsDUHead))
    .query(`
    INSERT INTO EmployeeInfo (
      EmployeeId, ProjectId, DepartmentId, ProdId, ShiftId, DUID,
      HRANID, DateHired, Tenure, EmployeeLevel, Designation, EmploymentStatus, EmployeeStatus,
      WorkWeekType, WorkArrangement, RateClass, Rate, ManagerID, ManagerName, PMPICID,
      PMPICIDName, DUHID, DUHName, IsManager, IsPMPIC, IsIndividualContributor, IsActive,
      HRANType, TITOType, Position, PositionLevel, IsDUHead
    )
    SELECT 
      @EmployeeId, P.ProjectId, D.DepartmentId, Pr.ProdId, S.ShiftId, DU.DUID, 
      @HRANID, @DateHired, @Tenure, @EmployeeLevel, @Designation, @EmploymentStatus, 
      @EmployeeStatus, @WorkWeekType, @WorkArrangement, @RateClass, @Rate, 
      @ManagerID, @ManagerName, @PMPICID, @PMPICIDName, @DUHID, @DUHName, 
      @IsManager, @IsPMPIC, @IsIndividualContributor, @IsActive, @HRANType, 
      @TITOType, @Position, @PositionLevel, @IsDUHead
    FROM 
      Project P, Department D, Product Pr, Shift S,
      DeliveryUnit DU
    WHERE 
      P.EmployeeId = @EmployeeId
      AND D.EmployeeId = @EmployeeId
      AND Pr.EmployeeId = @EmployeeId
      AND S.EmployeeId = @EmployeeId
      AND DU.EmployeeId = @EmployeeId
  `);
    
    return "Data successfully uploaded.";
  } catch (error) {
    console.error("Error occurred while inserting new data:", error);
    throw new Error("Failed to insert new data.");
  }
};
//retrieve personal details
const getAllNewHireEmployees = async () => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(`
      SELECT EP.*, C.ContactNumber 
      FROM EmpPersonalDetails AS EP
      INNER JOIN Contact AS C ON EP.EmployeeId = C.EmployeeId
    `);
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
      SELECT 
      PD.*, EI.*, ADDRESS.*, CONTACT.*, EDUC.*, EMER.*, 
      PROJ.ProjectId AS ProjectId, PROJ.DUID AS ProjectDUID, PROJ.ProjectCode, 
      PROJ.ProjectName, PROJ.is_Active,
      DU.DUID AS DUID, DU.DUCode, DU.DUName AS DUName, DU.Is_Active,
      DEPT.DepartmentId, DEPT.DepartmentName, DEPT.DUID AS DeptDUID,
      PROD.*, DEPN.*, SHFT.*
      FROM EmpPersonalDetails AS PD
      INNER JOIN EmployeeInfo AS EI ON PD.EmployeeId = EI.EmployeeId
      INNER JOIN Address AS ADDRESS ON PD.EmployeeId = ADDRESS.EmployeeId
      INNER JOIN Contact AS CONTACT ON PD.EmployeeId = CONTACT.EmployeeId
      INNER JOIN Education AS EDUC ON PD.EmployeeId = EDUC.EmployeeId
      LEFT JOIN EmergencyContact AS EMER ON PD.EmployeeId = EMER.EmployeeId
      LEFT JOIN Project AS PROJ ON PD.EmployeeId = PROJ.EmployeeId
      LEFT JOIN Shift AS SHFT ON PD.EmployeeId = SHFT.EmployeeId
      LEFT JOIN DeliveryUnit AS DU ON PD.EmployeeId = DU.EmployeeId
      LEFT JOIN Department AS DEPT ON PD.EmployeeId = DEPT.EmployeeId
      LEFT JOIN Dependent AS DEPN ON PD.EmployeeId = DEPN.EmployeeId
      LEFT JOIN Product AS PROD ON PD.EmployeeId = PROD.EmployeeId
      WHERE PD.EmployeeId = @EmployeeId;
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
//update employee personal details  by id
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
              EmailAddress = @EmailAddress
          WHERE EmployeeId = @employeeId
        `);
        // Update the contact number in the Contact table first
    await pool
    .request()
    .input("EmployeeId", sql.VarChar, employeeId)
    .input("ContactNumber", sql.VarChar(255), updatedEmployeeData.ContactNumber)
    .query(`
      UPDATE Contact
      SET ContactNumber = @ContactNumber
      WHERE EmployeeId = @EmployeeId
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
      .input("Designation", sql.VarChar(255), updatedEmployeeData.Designation)
      .input("EmploymentStatus", sql.VarChar(255), updatedEmployeeData.EmploymentStatus)
      .input( "EmployeeStatus", sql.VarChar(255), updatedEmployeeData.EmployeeStatus)
      .input("WorkWeekType", sql.VarChar(255), updatedEmployeeData.WorkWeekType)
      .input( "WorkArrangement", sql.VarChar(255), updatedEmployeeData.WorkArrangement)
      .input("RateClass", sql.VarChar(255), updatedEmployeeData.RateClass)
      .input("Rate", sql.VarChar(255), updatedEmployeeData.Rate)
      .input("ManagerID", sql.VarChar(255), updatedEmployeeData.ManagerID)
      .input("ManagerName", sql.VarChar(255), updatedEmployeeData.ManagerName)
      .input("PMPICID", sql.VarChar(255), updatedEmployeeData.PMPICID)
      .input("PMPICIDName", sql.VarChar(255), updatedEmployeeData.PMPICIDName)
      .input("DUHID", sql.VarChar(255), updatedEmployeeData.DUHID)
      .input("DUHName", sql.VarChar(255), updatedEmployeeData.DUHName)
      .input("IsManager", sql.Bit, updatedEmployeeData.IsManager ? 1 : 0)
      .input("IsPMPIC", sql.Bit, updatedEmployeeData.IsPMPIC ? 1 : 0)
      .input("IsIndividualContributor", sql.Bit, updatedEmployeeData.IsIndividualContributor ? 1 : 0)
      .input("IsActive", sql.Bit, updatedEmployeeData.IsActive ? 1 : 0)
      .input("HRANType", sql.VarChar(255), updatedEmployeeData.HRANType)
      .input("TITOType", sql.VarChar(255), updatedEmployeeData.TITOType)
      .input("Position", sql.VarChar(255), updatedEmployeeData.Position)
      .input("IsDUHead", sql.Bit, updatedEmployeeData.IsDUHead ? 1 : 0)
      .input( "PositionLevel", sql.VarChar(255), updatedEmployeeData.PositionLevel)
      .query(`
          UPDATE EmployeeInfo 
          SET HRANID = @HRANID,
              DateHired = @DateHired,
              Tenure = @Tenure,
              EmployeeLevel = @EmployeeLevel,
              Designation = @Designation,
              EmploymentStatus = @EmploymentStatus,
              EmployeeStatus = @EmployeeStatus,
              WorkWeekType = @WorkWeekType,
              WorkArrangement = @WorkArrangement,
              RateClass = @RateClass,
              Rate = @Rate,
              ManagerID = @ManagerID,
              ManagerName = @ManagerName,
              PMPICID = @PMPICID,
              PMPICIDName = @PMPICIDName,
              DUHID = @DUHID,
              DUHName = @DUHName,
              IsManager = @IsManager,
              IsPMPIC = @IsPMPIC,
              IsIndividualContributor = @IsIndividualContributor,
              IsActive = @IsActive,
              HRANType = @HRANType,
              TITOType = @TITOType,
              Position = @Position,
              IsDUHead = @IsDUHead,
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
      .input(
        "CompleteAddress",
        sql.VarChar(255),
        updatedEmployeeData.CompleteAddress
      )
      .input("Barangay", sql.VarChar(255), updatedEmployeeData.Barangay)
      .input(
        "CityMunicipality",
        sql.VarChar(255),
        updatedEmployeeData.CityMunicipality
      )
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
//update employee project details
const updateEmployeeProjectById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("ProjectCode", sql.VarChar(255), updatedEmployeeData.ProjectCode)
      .input("ProjectName", sql.VarChar(255), updatedEmployeeData.ProjectName)
      .input("is_Active", sql.Bit, updatedEmployeeData.is_Active ? 1 : 0)
      .query(`
          UPDATE Project 
          SET ProjectCode = @ProjectCode,
          ProjectName = @ProjectName,
          is_Active = @is_Active
          WHERE EmployeeId = @EmployeeId
        `);

    return result;
  } catch (error) {
    console.error("Error updating employee project by ID:", error);
    throw error;
  }
};
//update employee education details
const updateEmployeeEducationById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("School", sql.VarChar(255), updatedEmployeeData.School)
      .input("EducationLevel", sql.VarChar(255), updatedEmployeeData.EducationLevel)
      .input("UnitsEarned", sql.VarChar(255), updatedEmployeeData.UnitsEarned)
      .input("Degree", sql.VarChar(255), updatedEmployeeData.Degree)
      .input("MajorCourse", sql.VarChar(255), updatedEmployeeData.MajorCourse)
      .input("HonorRank", sql.VarChar(255), updatedEmployeeData.HonorRank)
      .input("Session", sql.VarChar(255), updatedEmployeeData.Session)
      .input("DateFrom", sql.VarChar(255), updatedEmployeeData.DateFrom)
      .input("DateTo", sql.VarChar(255), updatedEmployeeData.DateTo)
      .input("MonthCompleted", sql.VarChar(255), updatedEmployeeData.MonthCompleted)
      .input("Completed", sql.VarChar(255), updatedEmployeeData.Completed)
      .query(`
          UPDATE Education 
          SET 
          School = @School,
          EducationLevel = @EducationLevel,
          Degree = @Degree,
          UnitsEarned =@UnitsEarned,
          MajorCourse = @MajorCourse,
          HonorRank = @HonorRank,
          Session = @Session,
          DateFrom = @DateFrom,
          DateTo = @DateTo,
          MonthCompleted = @MonthCompleted,
          Completed = @Completed
          WHERE EmployeeId = @EmployeeId
        `);

    return result;
  } catch (error) {
    console.error("Error updating employee eduaction by ID:", error);
    throw error;
  }
};
//update employee shift details
const updateEmployeeShiftById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("ShiftCode", sql.VarChar(255), updatedEmployeeData.ShiftCode)
      .input("ShiftName", sql.VarChar(255), updatedEmployeeData.ShiftName)
      .input("ShiftType", sql.VarChar(255), updatedEmployeeData.ShiftType)
      .input("LevelID", sql.VarChar(255), updatedEmployeeData.LevelID)
      .query(`
          UPDATE Shift 
          SET ShiftCode = @ShiftCode,
          ShiftName = @ShiftName,
          ShiftType = @ShiftType,
          LevelID = @LevelID
          WHERE EmployeeId = @EmployeeId
        `);

    return result;
  } catch (error) {
    console.error("Error updating employee shift by ID:", error);
    throw error;
  }
};
//update employee delivery unit details
const updateEmployeeDUById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("DUCode", sql.VarChar(255), updatedEmployeeData.DUCode)
      .input("DUName", sql.VarChar(255), updatedEmployeeData.DUName)
      .input("Is_Active", sql.Bit, updatedEmployeeData.Is_Active ? 1 : 0)
      .query(`
          UPDATE DeliveryUnit 
          SET DUCode = @DUCode,
          DUName = @DUName,
          Is_Active = @Is_Active
          WHERE EmployeeId = @EmployeeId
        `);

    return result;
  } catch (error) {
    console.error("Error updating employee delivery unit by ID:", error);
    throw error;
  }
};
//update employee department details
const updateEmployeeDepartmentById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("DepartmentName", sql.VarChar(255), updatedEmployeeData.DepartmentName)
      .query(`
          UPDATE Department 
          SET DepartmentName = @DepartmentName
          WHERE EmployeeId = @EmployeeId
        `);

    return result;
  } catch (error) {
    console.error("Error updating employee delivery unit by ID:", error);
    throw error;
  }
};
//update employee dependent details
const updateEmployeeDependentById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("FullName", sql.VarChar(255), updatedEmployeeData.FullName)
      .input("PhoneNum", sql.VarChar(255), updatedEmployeeData.PhoneNum)
      .input("Relationship", sql.VarChar(255), updatedEmployeeData.Relationship)
      .input("DateOfBirth", sql.VarChar(255), updatedEmployeeData.DateOfBirth)
      .input("Occupation", sql.VarChar(255), updatedEmployeeData.Occupation)
      .input("Address", sql.VarChar(255), updatedEmployeeData.Address)
      .input("City", sql.VarChar(255), updatedEmployeeData.City)
      .input("DepProvince", sql.VarChar(255), updatedEmployeeData.DepProvince)
      .input("PostalCode", sql.VarChar(255), updatedEmployeeData.PostalCode)
      .input("Beneficiary", sql.VarChar(255), updatedEmployeeData.Beneficiary)
      .input("BeneficiaryDate", sql.VarChar(255), updatedEmployeeData.BeneficiaryDate)
      .input("TypeOfCoverage", sql.VarChar(255), updatedEmployeeData.TypeOfCoverage)
      .input("Insurance", sql.VarChar(255), updatedEmployeeData.Insurance)
      .input("InsuranceDate", sql.VarChar(255), updatedEmployeeData.InsuranceDate)
      .input("Remarks", sql.VarChar(255), updatedEmployeeData.Remarks)
      .input("CompanyPaid", sql.VarChar(255), updatedEmployeeData.CompanyPaid)
      .input("HMOProvider", sql.VarChar(255), updatedEmployeeData.HMOProvider)
      .input("HMOPolicyNumber", sql.VarChar(255), updatedEmployeeData.HMOPolicyNumber)
      .query(`
          UPDATE Dependent 
          SET FullName = @FullName,
          PhoneNum = @PhoneNum,
          Relationship = @Relationship,
          DateOfBirth = @DateOfBirth,
          Occupation = @Occupation,
          Address = @Address,
          City = @City,
          DepProvince = @DepProvince,
          PostalCode = @PostalCode,
          Beneficiary = @Beneficiary,
          BeneficiaryDate = @BeneficiaryDate,
          TypeOfCoverage = @TypeOfCoverage,
          Insurance = @Insurance,
          InsuranceDate = @InsuranceDate,
          Remarks = @Remarks,
          CompanyPaid = @CompanyPaid,
          HMOProvider = @HMOProvider,
          HMOPolicyNumber = @HMOPolicyNumber
          WHERE EmployeeId = @EmployeeId
        `);

    return result;
  } catch (error) {
    console.error("Error updating employee delivery unit by ID:", error);
    throw error;
  }
};
//update employee product details
const updateProductById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("ProdCode", sql.VarChar(255), updatedEmployeeData.ProdCode)
      .input("ProdDesc", sql.VarChar(255), updatedEmployeeData.ProdDesc)
      .query(`
          UPDATE Product 
          SET ProdCode = @ProdCode,
          ProdDesc  = @ProdDesc
          WHERE EmployeeId = @EmployeeId
        `);

    return result;
  } catch (error) {
    console.error("Error updating employee delivery unit by ID:", error);
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
        .query("DELETE FROM EmployeeInfo WHERE EmployeeId = @EmployeeId");

      // Delete from Address table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM Address WHERE EmployeeId = @EmployeeId");

      // Delete from Education table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM Education WHERE EmployeeId = @EmployeeId");

      // Delete from EmergencyContact table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM EmergencyContact WHERE EmployeeId = @EmployeeId");

      // Delete from Project table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM Project WHERE EmployeeId = @EmployeeId");

      // Delete from Product table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM Product WHERE EmployeeId = @EmployeeId");

      // Delete from Dependent table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM Dependent WHERE EmployeeId = @EmployeeId");

      // Delete from Department table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM Department WHERE EmployeeId = @EmployeeId");

      // Delete from Shift table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM Shift WHERE EmployeeId = @EmployeeId");

      // Delete from DeliveryUnit table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM DeliveryUnit WHERE EmployeeId = @EmployeeId");

      // Delete from Contact table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM Contact WHERE EmployeeId = @EmployeeId");

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
//DELETE EMPLOYEE INFORMATION
const deleteEmpInfoById = async (empInfoId) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmpInfoID", sql.VarChar, empInfoId)
      .query("DELETE FROM EmployeeInfo WHERE EmpInfoID = @EmpInfoID");

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
  updateEmployeeAddressById,
  updateEmployeeProjectById,
  updateEmployeeEducationById,
  deleteEmpInfoById,
  updateEmployeeShiftById,
  updateEmployeeDUById,
  updateEmployeeDepartmentById,
  updateEmployeeDependentById,
  updateProductById, 
};
