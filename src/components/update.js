import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import TopNavbar from './topnavbar';
import Footer from './footer';
import '../App.css';

 function UpdateEmployeeInfo() {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [employeeData, setEmployeeData] = useState({
    EmployeeId: '',
    EmployeeName: '',
    LastName: '',
    FirstName: '',
    MiddleName: '',
    MaidenName: '',
    Birthdate: '',
    Age: '',
    BirthMonth: '',
    AgeBracket: '',
    Gender: '',
    MaritalStatus: '',
    SSS: '',
    PHIC: '',
    HDMF: '',
    TIN: '',
    // HRANID: '',
    ContactNumber: '',
    EmailAddress: ''
  });
  const [initialEmployeeData, setInitialEmployeeData] = useState({});

// Function to format date as 'MM/DD/YYYY'
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${month}/${day}/${year}`;
};
//FETCHING EMPLOYEE DATA
useEffect(() => {
    // Fetch employee data based on employeeId
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/retrieve/${employeeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }
        const data = await response.json();
      
        // Store the initial employee data
        setInitialEmployeeData(data);
  
        // Convert birthdate string to formatted date
        data.Birthdate = formatDate(data.Birthdate);
        data.DateHired = formatDate(data.DateHired);
  
        // To convert all the capital letters in a string to title case (capitalize the first letter of each word)
        function convertToTitleCase(str) {
          return str.toLowerCase().replace(/\b\w/g, function (char) {
            return char.toUpperCase();
          });
        }
  
        // Convert names to title case before setting in state
        const formattedData = {
          ...data,
          EmployeeName: convertToTitleCase(data.EmployeeName),
          FirstName: convertToTitleCase(data.FirstName),
          MiddleName: convertToTitleCase(data.MiddleName),
          LastName: convertToTitleCase(data.LastName),
          BirthMonth: convertToTitleCase(data.BirthMonth),
          MaritalStatus: convertToTitleCase(data.MaritalStatus),
          Gender: convertToTitleCase(data.Gender),
        };
  
        setEmployeeData(formattedData);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setErrorMessage('Error fetching employee data');
      }
    };
  
    fetchEmployeeData();
  }, [employeeId]);

//HANDLES INPUT TO UPDATE DATA
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: value
    });
  };
  //UPDATE EMPLOYEE PERSONAL DETAILS
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/updateEmployee/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
      });
      if (!response.ok) {
        throw new Error('Failed to update employee');
      }
  
      // Retrieve the name of the employee from employeeData
      const { FirstName, LastName } = employeeData;
      const employeeName = `${FirstName} ${LastName}`;
  
      // Compare initial employeeData with updated employeeData
      const updatedFields = [];
      Object.entries(employeeData).forEach(([key, value]) => {
        if (value !== initialEmployeeData[key]) {
          updatedFields.push(key);
        }
      });
  
      // Generate success message based on updated fields
      let successMessage;
      if (updatedFields.length === 0) {
        successMessage = `No information has been updated for ${employeeName}.`;
      } else {
        successMessage = `Employee ${employeeName} has successfully updated ${updatedFields.join(', ')}!`;
      }
  
      // Display the success message
      alert(successMessage);
  
      // Navigate to report.js
      navigate("/reports");
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };
  //UPDATE EMPLOYEE INFORMATION
    const handleFormEmpInfoSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        
        try {
        const response = await fetch(`http://localhost:5000/updateEmployeeInfo/${employeeId}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeData)
        });
    
        if (!response.ok) {
            throw new Error('Failed to update employee');
        }
    
        // // Success message
        // alert('Employee information updated successfully!');
            // Retrieve the name of the employee from employeeData
      const { FirstName, LastName } = employeeData;
      const employeeName = `${FirstName} ${LastName}`;
  
      // Compare initial employeeData with updated employeeData
      const updatedFields = [];
      Object.entries(employeeData).forEach(([key, value]) => {
        if (value !== initialEmployeeData[key]) {
          updatedFields.push(key);
        }
      });
  
      // Generate success message based on updated fields
      let successMessage;
      if (updatedFields.length === 0) {
        successMessage = `No information has been updated for ${employeeName}.`;
      } else {
        successMessage = `Employee ${employeeName} has successfully updated ${updatedFields.join(', ')}!`;
      }
  
      // Display the success message
      alert(successMessage);

       // Navigate to report.js
       navigate("/reports");
  
        } catch (error) {
        console.error('Error updating employee information:', error);
        }
    };
      //UPDATE ADDRESS DETAILS
      const handleAddressFormSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        
        try {
        const response = await fetch(`http://localhost:5000/updateEmployeeAddress/${employeeId}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeData)
        });
    
        if (!response.ok) {
            throw new Error('Failed to update employee address');
        }
    
        // // Success message
        // alert('Employee information updated successfully!');
            // Retrieve the name of the employee from employeeData
      const { FirstName, LastName } = employeeData;
      const employeeName = `${FirstName} ${LastName}`;
  
      // Compare initial employeeData with updated employeeData
      const updatedFields = [];
      Object.entries(employeeData).forEach(([key, value]) => {
        if (value !== initialEmployeeData[key]) {
          updatedFields.push(key);
        }
      });
  
      // Generate success message based on updated fields
      let successMessage;
      if (updatedFields.length === 0) {
        successMessage = `No information has been updated for ${employeeName} address.`;
      } else {
        successMessage = `Employee ${employeeName} has successfully updated ${updatedFields.join(', ')}!`;
      }
  
      // Display the success message
      alert(successMessage);

       // Navigate to report.js
       navigate("/reports");
  
        } catch (error) {
        console.error('Error updating employee address:', error);
        }
    };
    //UPDATE PROJECT CODE
  const handleProjectFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/updateProject/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
      });
      if (!response.ok) {
        throw new Error('Failed to update project details');
      }
  
      // Retrieve the name of the employee from employeeData
      const { FirstName, LastName } = employeeData;
      const employeeName = `${FirstName} ${LastName}`;
  
      // Compare initial employeeData with updated employeeData
      const updatedFields = [];
      Object.entries(employeeData).forEach(([key, value]) => {
        if (value !== initialEmployeeData[key]) {
          updatedFields.push(key);
        }
      });
  
      // Generate success message based on updated fields
      let successMessage;
      if (updatedFields.length === 0) {
        successMessage = `No information has been updated for ${employeeName}.`;
      } else {
        successMessage = `Employee ${employeeName} has successfully updated ${updatedFields.join(', ')}!`;
      }
  
      // Display the success message
      alert(successMessage);
  
      // Navigate to report.js
      navigate("/reports");
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };
  

  if (!employeeData) {
    return <div>Loading...</div>;
  }

    return (
      <div id="wrapper">
          <Navbar />
          <div id="content-wrapper" className="d-flex flex-column">
              <div id="content">
                <TopNavbar />
              <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-xl-12 col-xl-9">
              <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <ul className="nav nav-tabs nav-fill">
                      <li className="nav-item">
                          <a className="nav-link active " id="personalDetails-tab" data-toggle="tab" href="#personalDetails" role="tab" aria-controls="personalDetails" aria-selected="false">Employee Personal Details</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link" id="employmentInfo-tab" data-toggle="tab" href="#employmentInfo" role="tab" aria-controls="employmentInfo" aria-selected="false">Employment Information</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link " id="project_Code-tab" data-toggle="tab" href="#project_Code" role="tab" aria-controls="project_Code" aria-selected="false">Project Code</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link " id="Shift-tab" data-toggle="tab" href="#Shift" role="tab" aria-controls="Shift" aria-selected="false">Shift</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link " id="deliveryUnit-tab" data-toggle="tab" href="#deliveryUnit" role="tab" aria-controls="deliveryUnit" aria-selected="false">Delivery Unit</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link " id="Department-tab" data-toggle="tab" href="#Department" role="tab" aria-controls="Department" aria-selected="false">Department</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link " id="address-tab" data-toggle="tab" href="#address" role="tab" aria-controls="address" aria-selected="false">Address</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link " id="education-tab" data-toggle="tab" href="#education" role="tab" aria-controls="education" aria-selected="false">Education</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link " id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Contact</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link " id="emergencyContact-tab" data-toggle="tab" href="#emergencyContact" role="tab" aria-controls="emergencyContact" aria-selected="false">Emergency Contact</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link " id="dependent-tab" data-toggle="tab" href="#dependent" role="tab" aria-controls="dependent" aria-selected="false">Dependent</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link " id="product-tab" data-toggle="tab" href="#product" role="tab" aria-controls="product" aria-selected="false">Product</a>
                      </li>
                  </ul>
                  </div>
                 <br/>
                  <div className="tab-content">
                      <div className="tab-pane fade show active" id="personalDetails" role="tabpanel" aria-labelledby="personalDetails-tab">
                          {/* Personal Details Form */}
                        <div className="container">
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        {successMessage && <div className="alert alert-success">{successMessage}</div>}
                            <form onSubmit={handleFormSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Employee ID</label>
                                            <span className="form-control">{Array.isArray(employeeData.EmployeeId) ? employeeData.EmployeeId[0] : employeeData.EmployeeId}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="emailAddress">Email Address</label>
                                            <input type="text" className="form-control" value={employeeData.EmailAddress} onChange={handleInputChange} name="EmailAddress" />
                                        </div>
                                    </div>
                                    {/* <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="contactNumber">Contact Number</label>
                                            <input type="text" className="form-control" value={employeeData.ContactNumber} onChange={handleInputChange} name="ContactNumber"/>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="name">Name</label>
                                            <input type="text" className="form-control" value={employeeData.EmployeeName} onChange={handleInputChange} name="EmployeeName"/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="lastName">Last Name</label>
                                            <input type="text" className="form-control" value={employeeData.LastName} onChange={handleInputChange} name="LastName"/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="firstName">First Name</label>
                                            <input type="text" className="form-control" value={employeeData.FirstName} onChange={handleInputChange} name="FirstName"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="middleName">Middle Name</label>
                                            <input type="text" className="form-control" value={employeeData.MiddleName} onChange={handleInputChange} name="MiddleName"/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="maidenName">Maiden Name</label>
                                            <input type="text" className="form-control" value={employeeData.MaidenName} onChange={handleInputChange} name="MaidenName"/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="birthdate">Birthdate</label>
                                              <input type="text" className="form-control" value={employeeData.Birthdate} onChange={handleInputChange} name="Birthdate"/>
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="age">Age</label>
                                              <input type="number" className="form-control" value={employeeData.Age} onChange={handleInputChange} name="Age"/>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="birthMonth">Birth Month</label>
                                              <input type="text" className="form-control" value={employeeData.BirthMonth} onChange={handleInputChange} name="BirthMonth"/>      
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="ageBracket">Age Bracket</label>
                                              <input type="text" className="form-control" value={employeeData.AgeBracket} onChange={handleInputChange} name="AgeBracket"/>
                                              </div>
                                            </div>

                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="gender">Gender</label>
                                              <input type="text" className="form-control" value={employeeData.Gender} onChange={handleInputChange} name="Gender"/>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="maritalStatus">Marital Status</label>
                                              <input type="text" className="form-control" value={employeeData.MaritalStatus} onChange={handleInputChange} name="MaritalStatus"/>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="SSS">SSS No.</label>
                                              <input type="text" className="form-control" value={employeeData.SSS} onChange={handleInputChange} name="SSS"/>     
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="PHIC">PHIC</label>
                                              <input type="text" className="form-control" value={employeeData.PHIC} onChange={handleInputChange} name="PHIC"/>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="HDMF">HDMF</label>
                                              <input type="text" className="form-control" value={employeeData.HDMF} onChange={handleInputChange} name="HDMF"/>      
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="TIN">TIN</label>
                                              <input type="text" className="form-control" value={employeeData.TIN} onChange={handleInputChange} name="TIN"/>
                                              </div>
                                            </div>
                                </div>
                                {/* <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="HRANID">HRANID</label>
                                              <input type="text" className="form-control" value={employeeData.HRANID} onChange={handleInputChange} name="HRANID"/>     
                                              </div>
                                            </div>
                                        </div> */}
                                <button type="submit" className="btn btn-primary d-block mx-auto">Save Changes</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="employmentInfo" role="tabpanel" aria-labelledby="employmentInfo-tab">
                          {/* Employment Information Form */}
                          <div className="container">
                            <form onSubmit={handleFormEmpInfoSubmit}>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="EmpID">Employee Id</label>
                                              <input type="text" className="form-control" value={Array.isArray(employeeData.EmployeeId) ? employeeData.EmployeeId[0] : employeeData.EmployeeId} readOnly={true} placeholder="Employee Id" name="EmpID" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="hranId">HRAN ID</label>
                                            <input type="text" className="form-control" value={employeeData.HRANID} placeholder="enter HRANID" name="HRANID" onChange={handleInputChange}/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="dateHired">Date Hired</label>
                                            <input type="text" className="form-control" readOnly={true} value={employeeData.DateHired} placeholder="Date Hired" name="DateHired" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="tenure">Tenure</label>
                                            <input type="text" className="form-control" value={employeeData.Tenure} onChange={handleInputChange} name="Tenure"/> 
                                            {/* <input type="text" className="form-control" value={employeeData.Tenure} placeholder="enter Tenure" name="tenure" onChange={handleEmpInfoChange} /> */}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="empLevel">Employee Level</label>
                                            <input type="text" className="form-control" readOnly={true} value={employeeData.EmployeeLevel} placeholder="enter employee Level" name="EmployeeLevel" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectCode">Project Code</label>
                                            <input type="text" className="form-control" readOnly={true} value={employeeData.ProjectCode} placeholder="enter Project Code" name="projectcode" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectName">Project Name</label>
                                            <input type="text" className="form-control" value={employeeData.ProjectName} readOnly={true} name="ProjectName" />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="designation">Designation</label>
                                            <input type="text" className="form-control" value={employeeData.Designation} placeholder="enter designation" name="Designation" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="department">Department</label>
                                              <input type="text" className="form-control" readOnly={true} value={employeeData.DepartmentName} name="Department" />
                                              </div>
                                            </div>
                                   </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="productCode">Product Code</label>
                                              <input type="text" className="form-control" readOnly={true} value={employeeData.ProdCode} name="ProductCode"  />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="prodDesc"> Product Description</label>
                                              <input type="text" className="form-control" readOnly={true} value={employeeData.ProdDesc} name="ProdDesc" />      
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="employementStatus">Employment Status</label>
                                              <input type="text" className="form-control" value={employeeData.EmploymentStatus} placeholder="enter employement status" name="EmployementStatus" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="empStatus">Employee Status</label>
                                              <input type="text" className="form-control text-success" value={employeeData.EmployeeStatus} placeholder="enter employee status" name="EmpStatus" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="workWeekType"> Work week type</label>
                                              <input type="text" className="form-control" value={employeeData.WorkWeekType} placeholder="enter work Week Type" name="WorkWeekType" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="shift">Shift</label>
                                              <input type="text" className="form-control" value={employeeData.ShiftName} readOnly={true} name="Shift" />     
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="workArrangement">Work Arrangement</label>
                                              <input type="text" className="form-control" value={employeeData.WorkArrangement} placeholder="enter work arrangement" name="WorkArrangement" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="rateClass">Rate Class</label>
                                              <input type="text" className="form-control" value={employeeData.RateClass} placeholder="enter rate class" name="RateClass" onChange={handleInputChange} />      
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="rate">Rate</label>
                                              <input type="text" className="form-control" readOnly={true} value={employeeData.Rate} placeholder="enter rate" name="Rate" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="managerId">Manager Id</label>
                                              <input type="text" className="form-control" readOnly={true} value={employeeData.ManagerID} placeholder="enter manager Id" name="ManagerId" onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="managerName">Manager Name</label>
                                              <input type="text" className="form-control" value={employeeData.ManagerName} placeholder="enter manager name" name="ManagerName" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="pmpicid">PMPICID</label>
                                              <input type="text" className="form-control" readOnly={true} value={employeeData.PMPICID} placeholder="enter pmpicid" name="Pmpicid" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="pmpicIdName">PMPICID Name</label>
                                              <input type="text" className="form-control" value={employeeData.PMPICIDName} placeholder="enter PMPICID Name" name="PmpicIdName" onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="du">Delivery Unit</label>
                                              <input type="text" className="form-control" value={employeeData.DUName} readOnly={true} name="DeliveryUnit" />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="duhid">DUHID</label>
                                              <input type="text" className="form-control" readOnly={true} value={employeeData.DUHID} placeholder="enter duhid" name="Duhid" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="duhName">DUH Name</label>
                                              <input type="text" className="form-control" value={employeeData.DUHName} placeholder="enter DUH Name" name="DuhName" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isManager">Is Manager</label>
                                              <input type="text" className="form-control" value={employeeData.IsManager} readOnly={true} placeholder="is Manager" name="IsManager" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isPmpic">Is PMPIC</label>
                                              <input type="text" className="form-control" value={employeeData.IsPMPIC} readOnly={true} placeholder="is Pmpic" name="IsPmpic" onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isIndContributor">Is Individual Contributor</label>
                                              <input type="text" className="form-control" value={employeeData.IsIndividualContributor} readOnly={true} placeholder="is Individual Contributor" name="IsIndContributor" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isActive">Is Active</label>
                                              <input type="text" className="form-control" value={employeeData.IsActive} readOnly={true} placeholder="is Active" name="IsActive" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isDuHead">Is DU Head</label>
                                              <input type="text" className="form-control" value={employeeData.IsDUHead} readOnly={true} placeholder="is Du Head" name="IsDuHead" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="HRANType">HRAN Type</label>
                                              <input type="text" className="form-control" value={employeeData.HRANType} placeholder="enter HRAN Type" name="HRANTYPE" onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="titoType">TITO Type</label>
                                              <input type="text" className="form-control" value={employeeData.TITOType} placeholder="enter tito type" name="TitoType" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="position">Position</label>
                                              <input type="text" className="form-control" value={employeeData.Position} placeholder="enter position" name="Position" onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="positionLevel">Position Level</label>
                                              <input type="text" className="form-control" value={employeeData.PositionLevel} placeholder="enter position level" name="PositionLevel" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                               
                                <button type="submit" className="btn btn-primary d-block mx-auto">Save Changes</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="project_Code" role="tabpanel" aria-labelledby="project_Code-tab">
                          {/* Project Code Form */}
                          <div className="container">
                            <form onSubmit={handleProjectFormSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Project ID</label>
                                            <span className="form-control">{employeeData.ProjectId} </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectCode">Project Code</label>
                                            <input type="text" className="form-control" value={employeeData.ProjectCode} placeholder="enter project code" name="ProjectCode" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectName">Project Name</label>
                                            <input type="text" className="form-control" value={employeeData.ProjectName} placeholder="enter project name" name="ProjectName" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="duid">DUID</label>
                                            <span className="form-control">{employeeData.ProjectDUID}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isActive">Is Active</label>
                                              <input type="text" className="form-control" value={employeeData.is_Active} placeholder="is Active" name="isActive" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                    
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Save Changes</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="Shift" role="tabpanel" aria-labelledby="Shift-tab">
                          {/* Project Code Form */}
                          <div className="container">
                            <form onSubmit={handleFormSubmit}>
                                <div className="row justify-content-center">
                                    {/* <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Shift ID</label>
                                            <span className="form-control">value={Array.isArray(employeeData.ShiftId  ) ? employeeData.DUID[0] : employeeData.DUID} </span>
                                        </div>
                                    </div> */}
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectCode">Shift Code</label>
                                            <input type="text" className="form-control" value={employeeData.ShiftCode} placeholder="enter project code" name="shiftCode" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectCode">Shift Name</label>
                                            <input type="text" className="form-control" value={employeeData.ShiftName} placeholder="enter project code" name="shiftCode" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="tenure">Shift Type</label>
                                            <input type="text" className="form-control" value={employeeData.ShiftType} placeholder="enter shift type" name="shiftType" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectName">Level Id</label>
                                            <input type="text" className="form-control" value={employeeData.LevelID} placeholder="enter level Id" name="levelId" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                
                                    </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Submit</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="deliveryUnit" role="tabpanel" aria-labelledby="deliveryUnit-tab">
                          {/* Delivery Unit Form */}
                          <div className="container">
                            <form onSubmit={handleFormSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>DUID</label>
                                            <span className="form-control">{employeeData.DUID}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectCode">DU Code</label>
                                            <input type="text" className="form-control" readOnly={true} value={employeeData.DUCode} placeholder="enter DU Code" name="duCode" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectName">DU Name</label>
                                            <input type="text" className="form-control" value={employeeData.DUName} placeholder="enter DU Name" name="duName" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>is Active</label>
                                            <input type="text" className="form-control" readOnly={true} value={employeeData.Is_Active} placeholder="is Active" name="Is_Active" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Save Changes </button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="Department" role="tabpanel" aria-labelledby="Department-tab">
                          {/* Department Form */}
                          <div className="container">
                            <form onSubmit={handleFormSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Department ID</label>
                                            <span className="form-control">{employeeData.DepartmentId}</span>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="deptname">Department Name</label>
                                            <input type="text" className="form-control" value={employeeData.DepartmentName} placeholder="enter department name" name="DepartmentName" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >DUID</label>
                                            <span className="form-control">{employeeData.DeptDUID}</span>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Save Changes</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="address" role="tabpanel" aria-labelledby="address-tab">
                          {/* Address Form */}
                          <div className="container">
                          <form onSubmit={handleAddressFormSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Employee ID</label>
                                            <input type="text" className="form-control" readOnly={true} value={Array.isArray(employeeData.EmployeeId) ? employeeData.EmployeeId[0] : employeeData.EmployeeId} onChange={handleInputChange} />                                        
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="houseNumber">House Number</label>
                                            <input type="text" className="form-control"  placeholder="enter house number" value={employeeData.HouseNumber} name="HouseNumber" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="completeAddress">Complete Address</label>
                                            <input type="text" className="form-control" placeholder="Enter Complete Address" name="CompleteAddress" value={employeeData.CompleteAddress} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="brgy">Barangay</label>
                                            <input type="text" className="form-control" placeholder="Enter Barangay" name="Barangay" value={employeeData.Barangay} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="cityMunicipality">City / Municipality</label>
                                            <input type="text" className="form-control" placeholder="Enter City/Municipality" name="CityMunicipality" value={employeeData.CityMunicipality} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="province">Province</label>
                                            <input type="text" className="form-control" placeholder="Enter Province" name="Province" value={employeeData.Province} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="region">Region</label>
                                            <input type="text" className="form-control" placeholder="Enter Region" name="Region" value={employeeData.Region} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="country">Country</label>
                                            <input type="text" className="form-control" placeholder="Enter Country" name="Country" value={employeeData.Country} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="zipcode">Zip Code</label>
                                              <input type="text" className="form-control" placeholder="Enter Zip Code" name="Zipcode" value={employeeData.ZipCode} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="landmark">Land Mark</label>
                                            <input type="text" className="form-control" placeholder="Enter Land Mark" name="Landmark" value={employeeData.Landmark} onChange={handleInputChange} />
                                            {/* <input type="text" className="form-control" placeholder="Enter Land Mark" name="landmark" value={employeeData.Landmark} onChange={handleInputChange} /> */}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="isPermanent">is Permanent</label>
                                            <input type="text" className="form-control" placeholder="is Permanent" readOnly={true} name="IsPermanent" value={employeeData.IsPermanent} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isEmergency">is Emergency</label>
                                              <input type="text" className="form-control" placeholder="is Emergency" readOnly={true} name="IsEmergency" value={employeeData.IsEmergency} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Save Changes</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="education" role="tabpanel" aria-labelledby="education-tab">
                          {/* Project Code Form */}
                          <div className="container">
                            <form onSubmit={handleFormSubmit}>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="unitEarned"> School </label>
                                            <input type="text" className="form-control" value={employeeData.School} placeholder="Enter Unit Earned" name="unitEarned" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="educLevel">Education Level</label>
                                            <input type="text" className="form-control" value={employeeData.EducationLevel} placeholder="Enter Education Level" name="educLevel" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="degree">Degree</label>
                                            <input type="text" value={employeeData.Degree} className="form-control" placeholder="Enter Degree" name="degree" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="majorCourse">Major course</label>
                                            <input type="text" className="form-control" value={employeeData.MajorCourse} placeholder="Enter Major Course" name="majorCourse" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="honorRank">Honor Rank</label>
                                            <input type="text" className="form-control" value={employeeData.HonorRank} placeholder="Enter Honor Rank" name="honorRank" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="session">Session</label>
                                              <input type="text" className="form-control" value={employeeData.Session} placeholder="Enter Session" name="session" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="dateFrom">Date From</label>
                                            <input type="text" className="form-control" value={employeeData.DateFrom} placeholder="Enter date From" name="dateFrom" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                        <label htmlFor="dateTo">Date To</label>
                                            <input type="text" className="form-control" value={employeeData.DateTo} placeholder="Enter date To" name="dateTo" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="monthCompleted">Month Completed</label>
                                            <input type="text" className="form-control" value={employeeData.MonthCompleted} placeholder="Enter Month Completed" name="monthCompleted" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    
                                    <div className="col-md-4">
                                        <div className="form-group">
                                        <label htmlFor="completed">Completed</label>
                                            <input type="text" className="form-control" value={employeeData.Completed} placeholder="Enter Completed" name="completed" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Submit</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                          {/* Contact Form */}
                          <div className="container">
                          <form onSubmit={handleFormSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Employee Id</label>
                                            <span className="form-control">{Array.isArray(employeeData.EmployeeId) ? employeeData.EmployeeId[0] : employeeData.EmployeeId}</span>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row justify-content-center">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                          <label >Contact Number</label>
                                          <input type="tel" className="form-control" value={employeeData.ContactNumber} placeholder="Enter contact number" name="ContactNumber" onChange={handleInputChange} />
                                      </div>
                                  </div>
                                    </div>
                                  
                                <br/>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Save Changes</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="emergencyContact" role="tabpanel" aria-labelledby="emergencyContact-tab">
                          {/* Emergency Contact Form */}
                          <div className="container">
                          <form onSubmit={handleFormSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Full Name</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactFullName} placeholder="Enter full name" name="ecFullname" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                          <label>Phone Number</label>
                                          <input type="text" className="form-control" value={employeeData.EmContactPhoneNumber} placeholder="Enter contact number" name="ecPhoneNumber" onChange={handleInputChange} />
                                      </div>
                                  </div>
                                  <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Complete Address</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactCompleteAddress} placeholder="Enter complete address" name="ecCompleteAddress" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>House Number</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactHouseNo} placeholder="Enter house number" name="housenumber" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Barangay</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactBarangay} placeholder="Enter Barangay" name="ecBrgy" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                  <div className="col-md-4">
                                        <div className="form-group">
                                            <label>City / Municipality</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactCityMunicipality} placeholder="Enter city/municipality" name="ecMunicipalityCity" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Province</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactProvince} placeholder="Enter province" name="ecProvince" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Region</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactRegion} placeholder="Enter Region" name="ecRegion" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                  <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Country</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactCountry} placeholder="Enter Country" name="ecCountry" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Zip Code</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactZipcode} placeholder="Enter zip code" name="ecZipCode" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Is Permanent</label>
                                            <input type="text" className="form-control" readOnly={true} value={employeeData.Is_Permanent} name="ecIs_Permanent" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                  <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Is Emergency</label>
                                            <input type="text" className="form-control" readOnly={true} value={employeeData.Is_Emergency} name="ecIs_Emergency" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    </div>
                                <br/>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Save Changes</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="dependent" role="tabpanel" aria-labelledby="dependent-tab">
                          {/* Project Code Form */}
                          <div className="container">
                            <form onSubmit={handleFormSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Dependent ID</label>
                                            <span className="form-control">{employeeData.DependentID}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Dependent Full Name</label>
                                            <input type="text" className="form-control" value={employeeData.FullName} placeholder="enter dependent full name" name="dependentFullname" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Relationship</label>
                                            <input type="text" className="form-control" value={employeeData.Relationship} placeholder="enter relationship" name="relationship" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Date of Birth</label>
                                            <input type="text" className="form-control" value={employeeData.DateOfBirth} placeholder="enter date of birth" name="dob" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Occupation</label>
                                            <input type="text" className="form-control" value={employeeData.Occupation} placeholder="enter  occupation" name="occupation" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Address</label>
                                            <input type="text" className="form-control" value={employeeData.Address} placeholder="Enter address" name="address" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>City</label>
                                            <input type="text" className="form-control" value={employeeData.City} placeholder="Enter City" name="city" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Province</label>
                                            <input type="text" className="form-control" value={employeeData.Province} placeholder="Enter Province" name="province" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label >Postal Code</label>
                                              <input type="text" className="form-control" value={employeeData.PostalCode} placeholder="Enter Postal Code" name="postalCode" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Phone Number</label>
                                            <input type="text" className="form-control" value={employeeData.PhoneNum} placeholder="Enter Phone Number" name="phoneNumber" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Beneficiary</label>
                                            <input type="text" className="form-control" value={employeeData.Beneficiary} placeholder="Enter Beneficiary" name="beneficiary" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label >Beneficiary Date</label>
                                              <input type="text" className="form-control" value={employeeData.BeneficiaryDate} placeholder="Enter Beneficiary Date" name="beneficiaryDate" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Insurance</label>
                                            <input type="tel" className="form-control" value={employeeData.Insurance} placeholder="Enter Insurance" name="insurance" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Insurance Date</label>
                                            <input type="text" className="form-control" value={employeeData.InsuranceDate} placeholder="Enter Insurance Date" name="insuranceDate" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label >Remarks</label>
                                              <input type="text" className="form-control" value={employeeData.Remarks} placeholder="Enter Remarks" name="remarks" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Company Paid</label>
                                            <input type="text" className="form-control" value={employeeData.CompanyPaid} placeholder="Enter Company Paid" name="companyPaid" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >HMO Provider</label>
                                            <input type="text" className="form-control" value={employeeData.HMOProvider} placeholder="Enter HMO Provider" name="hmoProvider" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label >HMO Policy Number</label>
                                              <input type="text" className="form-control" value={employeeData.HMOPolicyNumber} placeholder="Enter HMO Policy Number" name="hmoPolicynum" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Type of coverage</label>
                                            <input type="text" className="form-control" value={employeeData.TypeOfCoverage} placeholder="Enter Type of coverage" name="typeOfCoverage" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Submit</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="product" role="tabpanel" aria-labelledby="product-tab">
                          {/* Project Code Form */}
                          <div className="container">
                            <form onSubmit={handleFormSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Product ID</label>
                                            <span className="form-control"> {employeeData.ProdId} </span>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Product Code</label>
                                            <input type="text" className="form-control" value={employeeData.ProdCode} placeholder="enter Product Code" name="ProductCode" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Product Description</label>
                                            <input type="text" className="form-control" value={employeeData.ProdDesc} placeholder="enter Product Description" name="productDescription" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <br/>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Submit</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                  </div>
              </div>
              </div>
              </div>
              </div>
              </div>
              <Footer />
          </div>
      </div>
  );
}

export default UpdateEmployeeInfo;