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
    Aender: '',
    MaritalStatus: '',
    SSS: '',
    PHIC: '',
    HDMF: '',
    TIN: '',
    HRANID: '',
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

      setEmployeeData(data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      setErrorMessage('Error fetching employee data');
    }
  };

  fetchEmployeeData();
}, [employeeId]);

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: value
    });
  };

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
                          <a className="nav-link " id="projectCode-tab" data-toggle="tab" href="#projectCode" role="tab" aria-controls="projectCode" aria-selected="false">Project Code</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link " id="shift-tab" data-toggle="tab" href="#shift" role="tab" aria-controls="shift" aria-selected="false">Shift</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link " id="deliveryUnit-tab" data-toggle="tab" href="#deliveryUnit" role="tab" aria-controls="deliveryUnit" aria-selected="false">Delivery Unit</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link " id="department-tab" data-toggle="tab" href="#department" role="tab" aria-controls="department" aria-selected="false">Department</a>
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
                                            <span className="form-control">{employeeData.EmployeeId}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="emailAddress">Email Address</label>
                                            <input type="text" className="form-control" value={employeeData.EmailAddress} onChange={handleInputChange} name="EmailAddress" />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="contactNumber">Contact Number</label>
                                            <input type="text" className="form-control" value={employeeData.ContactNumber} onChange={handleInputChange} name="ContactNumber"/>
                                        </div>
                                    </div>
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
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="HRANID">HRANID</label>
                                              <input type="text" className="form-control" value={employeeData.HRANID} onChange={handleInputChange} name="HRANID"/>     
                                              </div>
                                            </div>
                                            {/* <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="contactNumber">Contact Number</label>
                                              <input type="text" className="form-control" id="contactNumber" name="contactNumber" value={employeeData.ContactNumber} onChange={handleInputChange} />
                                              </div>
                                            </div> */}
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Save Changes</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="employmentInfo" role="tabpanel" aria-labelledby="employmentInfo-tab">
                          {/* Employment Information Form */}
                          <div className="container">
                            <form onSubmit={handleFormSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Employee Info ID</label>
                                            <span className="form-control">{employeeData.EmpID}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="hranId">HRAN ID</label>
                                            <input type="text" className="form-control" id="hranId" name="hranId" value={employeeData.EmailAddress} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="dateHired">Date Hired</label>
                                            <input type="text" className="form-control" id="dateHired" name="dateHired" value={employeeData.ContactNumber} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="tenure">Tenure</label>
                                            <input type="text" className="form-control" id="tenure" name="tenure" value={employeeData.Name} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="empLevel">Employee Level</label>
                                            <input type="text" className="form-control" id="empLevel" name="empLevel" value={employeeData.LastName} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectCode">Project Code</label>
                                            <input type="text" className="form-control" id="projectCode" name="projectCode" value={employeeData.FirstName} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectName">Project Name</label>
                                            <input type="text" className="form-control" id="projectName" name="projectName" value={employeeData.MiddleName} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="designation">Designation</label>
                                            <input type="text" className="form-control" id="designation" name="designation" value={employeeData.MaidenName} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="department">Department</label>
                                              <input type="text" className="form-control" id="department" name="department" value={employeeData.Birthdate} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                   </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="productCode">Product Code</label>
                                              <input type="text" className="form-control" id="productCode" name="productCode" value={employeeData.Age} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="prodDesc"> Product Description</label>
                                              <input type="text" className="form-control" id="prodDesc" name="prodDesc" value={employeeData.BirthMonth} onChange={handleInputChange} />      
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="employementStatus">Employment Status</label>
                                              <input type="text" className="form-control" id="employementStatus" name="employementStatus" value={employeeData.AgeBracket} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="empStatus">Employee Status</label>
                                              <input type="text" className="form-control" id="empStatus" name="empStatus" value={employeeData.Gender} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="workWeekType"> Work week type</label>
                                              <input type="text" className="form-control" id="workWeekType" name="workWeekType" value={employeeData.MaritalStatus} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="shift">Shift</label>
                                              <input type="text" className="form-control" id="shift" name="shift" value={employeeData.SSS} onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="workArrangement">Work Arrangement</label>
                                              <input type="text" className="form-control" id="workArrangement" name="workArrangement" value={employeeData.PHIC} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="rateClass">Rate Class</label>
                                              <input type="text" className="form-control" id="rateClass" name="rateClass" value={employeeData.HDMF} onChange={handleInputChange} />      
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="rate">Rate</label>
                                              <input type="text" className="form-control" id="rate" name="rate" value={employeeData.TIN} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="managerId">Manager Id</label>
                                              <input type="text" className="form-control" id="managerId" name="managerId" value={employeeData.HRANID} onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="managerName">Manager Name</label>
                                              <input type="text" className="form-control" id="managerName" name="managerName" value={employeeData.ContactNumber} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="pmpicid">PMPICID</label>
                                              <input type="text" className="form-control" id="pmpicid" name="pmpicid" value={employeeData.ContactNumber} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="HRANID">Delivery Unit</label>
                                              <input type="text" className="form-control" id="HRANID" name="HRANID" value={employeeData.HRANID} onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="duhid">DUHID</label>
                                              <input type="text" className="form-control" id="duhid" name="duhid" value={employeeData.ContactNumber} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isManager">Is Manager</label>
                                              <input type="text" className="form-control" id="isManager" name="isManager" value={employeeData.ContactNumber} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isPmpic">Is PMPIC</label>
                                              <input type="text" className="form-control" id="isPmpic" name="isPmpic" value={employeeData.HRANID} onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isIndContributor">Is Individual Contributor</label>
                                              <input type="text" className="form-control" id="isIndContributor" name="isIndContributor" value={employeeData.ContactNumber} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isActive">Is Active</label>
                                              <input type="text" className="form-control" id="isActive" name="isActive" value={employeeData.ContactNumber} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="HRANType">HRAN Type</label>
                                              <input type="text" className="form-control" id="HRANType" name="HRANType" value={employeeData.HRANID} onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="titoType">TITO Type</label>
                                              <input type="text" className="form-control" id="titoType" name="titoType" value={employeeData.ContactNumber} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isDuHead">Is DU Head</label>
                                              <input type="text" className="form-control" id="isDuHead" name="isDuHead" value={employeeData.ContactNumber} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="position">Position</label>
                                              <input type="text" className="form-control" id="position" name="position" value={employeeData.HRANID} onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="positionLevel">Position Level</label>
                                              <input type="text" className="form-control" id="positionLevel" name="positionLevel" value={employeeData.ContactNumber} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="EmpID">Employee Id</label>
                                              <input type="text" className="form-control" id="EmpID" name="EmpID" value={employeeData.EmpID} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                {/* <button type="submit" className="btn btn-primary d-block mx-auto">Submit</button> */}
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="projectCode" role="tabpanel" aria-labelledby="projectCode-tab">
                          {/* Project Code Form */}
                          <div className="container">
                            <form onSubmit={handleFormSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Project ID</label>
                                            <span className="form-control">{employeeData.EmmployeeId}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectCode">Project Code</label>
                                            <input type="text" className="form-control" id="projectCode" name="projectCode" value={employeeData.EmailAddress} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectName">Project Name</label>
                                            <input type="text" className="form-control" id="projectName" name="projectName" value={employeeData.MiddleName} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="tenure">Tenure</label>
                                            <input type="text" className="form-control" id="tenure" name="tenure" value={employeeData.EmployeeName} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="empLevel">Employee Level</label>
                                            <input type="text" className="form-control" id="empLevel" name="empLevel" value={employeeData.LastName} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectCode">Project Code</label>
                                            <input type="text" className="form-control" id="projectCode" name="projectCode" value={employeeData.FirstName} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectName">Project Name</label>
                                            <input type="text" className="form-control" id="projectName" name="projectName" value={employeeData.MiddleName} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="du_id">DUID</label>
                                            <input type="text" className="form-control" id="du_id" name="du_id" value={employeeData.MaidenName} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isActive">Is Active</label>
                                              <input type="text" className="form-control" id="isActive" name="isActive" value={employeeData.ContactNumber} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Submit</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="shift" role="tabpanel" aria-labelledby="shift-tab">
                          {/* Project Code Form */}
                          <div className="container">
                            <form onSubmit={handleFormSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Project ID</label>
                                            <span className="form-control">{employeeData.EmpID}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectCode">Project Code</label>
                                            <input type="text" className="form-control" id="projectCode" name="projectCode" value={employeeData.EmailAddress} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectName">Project Name</label>
                                            <input type="text" className="form-control" id="projectName" name="projectName" value={employeeData.MiddleName} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="tenure">Tenure</label>
                                            <input type="text" className="form-control" id="tenure" name="tenure" value={employeeData.Name} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="empLevel">Employee Level</label>
                                            <input type="text" className="form-control" id="empLevel" name="empLevel" value={employeeData.LastName} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectCode">Project Code</label>
                                            <input type="text" className="form-control" id="projectCode" name="projectCode" value={employeeData.FirstName} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectName">Project Name</label>
                                            <input type="text" className="form-control" id="projectName" name="projectName" value={employeeData.MiddleName} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="du_id">DUID</label>
                                            <input type="text" className="form-control" id="du_id" name="du_id" value={employeeData.MaidenName} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isActive">Is Active</label>
                                              <input type="text" className="form-control" id="isActive" name="isActive" value={employeeData.ContactNumber} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Submit</button>
                            </form>
                        </div>
                      <br/>
                      </div>

                      {/* Add more tab content here */}
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
