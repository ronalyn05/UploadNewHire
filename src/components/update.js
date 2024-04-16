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
                                            <span className="form-control">{}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="hranId">HRAN ID</label>
                                            <input type="text" className="form-control" placeholder="enter HRANID" name="hranId" onChange={handleInputChange}/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="dateHired">Date Hired</label>
                                            <input type="date" className="form-control" placeholder="Date Hired" name="dateHired" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="tenure">Tenure</label>
                                            <input type="text" className="form-control" placeholder="enter Tenure" name="tenure" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="empLevel">Employee Level</label>
                                            <input type="text" className="form-control" placeholder="enter employee Level" name="empLevel" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectCode">Project Code</label>
                                            <input type="text" className="form-control" placeholder="enter Project Code" name="projectCode" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectName">Project Name</label>
                                            <input type="text" className="form-control" placeholder="enter project name" name="projectName" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="designation">Designation</label>
                                            <input type="text" className="form-control" placeholder="enter designation" name="designation" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="department">Department</label>
                                              <input type="text" className="form-control" placeholder="enter department" name="department" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                   </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="productCode">Product Code</label>
                                              <input type="text" className="form-control" placeholder="enter product Code" name="productCode" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="prodDesc"> Product Description</label>
                                              <input type="text" className="form-control" placeholder="enter production description" name="prodDesc" onChange={handleInputChange} />      
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="employementStatus">Employment Status</label>
                                              <input type="text" className="form-control" placeholder="enter employement status" name="employementStatus" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="empStatus">Employee Status</label>
                                              <input type="text" className="form-control" placeholder="enter employee status" name="empStatus" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="workWeekType"> Work week type</label>
                                              <input type="text" className="form-control" placeholder="enter work Week Type" name="workWeekType" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="shift">Shift</label>
                                              <input type="text" className="form-control" placeholder="enter shift" name="shift" onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="workArrangement">Work Arrangement</label>
                                              <input type="text" className="form-control" placeholder="enter work arrangement" name="workArrangement" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="rateClass">Rate Class</label>
                                              <input type="text" className="form-control" placeholder="enter rate class" name="rateClass" onChange={handleInputChange} />      
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="rate">Rate</label>
                                              <input type="text" className="form-control" placeholder="enter rate" name="rate" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="managerId">Manager Id</label>
                                              <input type="text" className="form-control" placeholder="enter manager Id" name="managerId" onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="managerName">Manager Name</label>
                                              <input type="text" className="form-control" placeholder="enter manager name" name="managerName" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="pmpicid">PMPICID</label>
                                              <input type="text" className="form-control" placeholder="enter pmpicid" name="pmpicid" value={employeeData.ContactNumber} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="HRANID">Delivery Unit</label>
                                              <input type="text" className="form-control" placeholder="enter delivery unit" name="deliveryUnit" onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="duhid">DUHID</label>
                                              <input type="text" className="form-control" placeholder="enter duhid" name="duhid" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isManager">Is Manager</label>
                                              <input type="text" className="form-control" placeholder="is Manager" name="isManager" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isPmpic">Is PMPIC</label>
                                              <input type="text" className="form-control" placeholder="is Pmpic" name="isPmpic" onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isIndContributor">Is Individual Contributor</label>
                                              <input type="text" className="form-control" placeholder="is Individual Contributor" name="isIndContributor" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isActive">Is Active</label>
                                              <input type="text" className="form-control" placeholder="is Active" name="isActive" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="HRANType">HRAN Type</label>
                                              <input type="text" className="form-control" placeholder="enter HRAN Type" name="HRANType" onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="titoType">TITO Type</label>
                                              <input type="text" className="form-control" placeholder="enter tito type" name="titoType" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isDuHead">Is DU Head</label>
                                              <input type="text" className="form-control" placeholder="is Du Head" name="isDuHead" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="position">Position</label>
                                              <input type="text" className="form-control" placeholder="enter position" name="position" onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="positionLevel">Position Level</label>
                                              <input type="text" className="form-control" placeholder="enter position level" name="positionLevel" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="EmpID">Employee Id</label>
                                              <input type="text" className="form-control" readOnly={true} placeholder="Employee Id" name="EmpID" value={employeeData.EmployeeId} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Submit</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="project_Code" role="tabpanel" aria-labelledby="project_Code-tab">
                          {/* Project Code Form */}
                          <div className="container">
                            <form onSubmit={handleFormSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Project ID</label>
                                            <span className="form-control"> </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectCode">Project Code</label>
                                            <input type="text" className="form-control" placeholder="enter project code" name="projectCode" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectName">Project Name</label>
                                            <input type="text" className="form-control" placeholder="enter project name" name="projectName" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="tenure">Tenure</label>
                                            <input type="text" className="form-control" placeholder="enter tenure" name="tenure" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="empLevel">Employee Level</label>
                                            <input type="text" className="form-control" placeholder=" enter employee Level" name="empLevel" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="du_id">DUID</label>
                                            <input type="text" className="form-control" placeholder="enter DUID" name="du_id" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isActive">Is Active</label>
                                              <input type="text" className="form-control" placeholder="is Active" name="isActive" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Submit</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="Shift" role="tabpanel" aria-labelledby="Shift-tab">
                          {/* Project Code Form */}
                          <div className="container">
                            <form onSubmit={handleFormSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Shift ID</label>
                                            <span className="form-control"></span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectCode">Shift Code</label>
                                            <input type="text" className="form-control" placeholder="enter project code" name="shiftCode" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="tenure">Shift Type</label>
                                            <input type="text" className="form-control" placeholder="enter shift type" name="shiftType" onChange={handleInputChange} />
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
                                            <label htmlFor="projectName">Level Id</label>
                                            <input type="text" className="form-control" placeholder="enter level Id" name="levelId" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Submit</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="deliveryUnit" role="tabpanel" aria-labelledby="deliveryUnit-tab">
                          {/* Project Code Form */}
                          <div className="container">
                            <form onSubmit={handleFormSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>DUID</label>
                                            <span className="form-control"></span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectCode">DU Code</label>
                                            <input type="text" className="form-control" placeholder="enter DU Code" name="duCode" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectName">DU Name</label>
                                            <input type="text" className="form-control" placeholder="enter DU Name" name="duName" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="tenure">is Active</label>
                                            <input type="text" className="form-control" placeholder="is Active" name="isActive" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Submit</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="Department" role="tabpanel" aria-labelledby="Department-tab">
                          {/* Project Code Form */}
                          <div className="container">
                            <form onSubmit={handleFormSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Department ID</label>
                                            <span className="form-control"></span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectCode">Department Name</label>
                                            <input type="text" className="form-control" placeholder="enter department name" name="deptName" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectName">DUID</label>
                                            <input type="text" className="form-control" placeholder="enter DUID" name="duid" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Submit</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="address" role="tabpanel" aria-labelledby="address-tab">
                          {/* Project Code Form */}
                          <div className="container">
                          <form onSubmit={handleFormSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Address ID</label>
                                            <span className="form-control"></span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="houseNumber">House Number</label>
                                            <input type="text" className="form-control" placeholder="enter house number" name="houseNumber" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="completeAddress">Complete Address</label>
                                            <input type="text" className="form-control" placeholder="Enter Complete Address" name="completeAddress" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="brgy">Barangay</label>
                                            <input type="date" className="form-control" placeholder="Enter Barangay" name="brgy" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="municipality">City/Municipality</label>
                                            <input type="text" className="form-control" placeholder="Enter  City/Municipality" name="municipality" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="province">Province</label>
                                            <input type="text" className="form-control" placeholder="Enter Province" name="province" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="region">Region</label>
                                            <input type="text" className="form-control" placeholder="Enter Region" name="region" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="country">Country</label>
                                            <input type="text" className="form-control" placeholder="Enter Country" name="country" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="zipcode">Zip Code</label>
                                              <input type="text" className="form-control" placeholder="Enter Zip Code" name="zipcode" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="landMark">Land Mark</label>
                                            <input type="text" className="form-control" placeholder="Enter Land Mark" name="landMark" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="isPermanent">is Permanent</label>
                                            <input type="text" className="form-control" placeholder="is Permanent" name="isPermanent" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isEmergency">is Emergency</label>
                                              <input type="text" className="form-control" placeholder="is Emergency" name="isEmergency" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Submit</button>
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
                                            <label>Education ID</label>
                                            <span className="form-control">{employeeData.EmpID}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="educLevel">Education Level</label>
                                            <input type="text" className="form-control" placeholder="Enter Education Level" name="educLevel" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="degree">Degree</label>
                                            <input type="text" className="form-control" placeholder="Enter Degree" name="degree" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="majorCourse">Major course</label>
                                            <input type="text" className="form-control" placeholder="Enter Major Course" name="majorCourse" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="honorRank">Honor Rank</label>
                                            <input type="text" className="form-control" placeholder="Enter Honor Rank" name="honorRank" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="unitEarned"> </label>
                                            <input type="text" className="form-control" placeholder="Enter Unit Earned" name="unitEarned" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="dateFrom">Date From</label>
                                            <input type="date" className="form-control" placeholder="Enter date From" name="dateFrom" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                        <label htmlFor="dateTo">Date To</label>
                                            <input type="date" className="form-control" placeholder="Enter date To" name="dateTo" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="session">Session</label>
                                              <input type="text" className="form-control" placeholder="Enter Session" name="session" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="monthCompleted">Month Completed</label>
                                            <input type="text" className="form-control" placeholder="Enter Month Completed" name="monthCompleted" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                        <label htmlFor="completed">Completed</label>
                                            <input type="text" className="form-control" placeholder="Enter Completed" name="completed" onChange={handleInputChange} />
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
                                            <label>Contact ID</label>
                                            <span className="form-control"></span>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row justify-content-center">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                          <label htmlFor="contactNumber">Contact Number</label>
                                          <input type="tel" className="form-control" placeholder="Enter contact number" name="contactNumber" onChange={handleInputChange} />
                                      </div>
                                  </div>
                                    </div>
                                    <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectName">Employee Id</label>
                                            <input type="text" className="form-control" name="employeeId" readOnly={true} value={employeeData.EmployeeId} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <br/>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Submit</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="emergencyContact" role="tabpanel" aria-labelledby="emergencyContact-tab">
                          {/* Project Code Form */}
                          <div className="container">
                          <form onSubmit={handleFormSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Emergency Number ID</label>
                                            <span className="form-control"></span>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row justify-content-center">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                          <label htmlFor="contactNumber">Full Name</label>
                                          <input type="text" className="form-control" placeholder="Enter Full Name" name="contactFullname" onChange={handleInputChange} />
                                      </div>
                                  </div>
                                    </div>
                                <br/>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Submit</button>
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
                                            <span className="form-control"></span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="dependentFullname">Dependent Full Name</label>
                                            <input type="text" className="form-control" placeholder="enter dependent full name" name="dependentFullname" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="relationship">Relationhip</label>
                                            <input type="text" className="form-control" placeholder="enter relationship" name="relationship" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="dob">Date of Birth</label>
                                            <input type="date" className="form-control" placeholder="enter date of birth" name="dob" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="occupation">Occupation</label>
                                            <input type="text" className="form-control" placeholder="enter  occupation" name="occupation" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="address">Address</label>
                                            <input type="text" className="form-control" placeholder="Enter address" name="address" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="city">City</label>
                                            <input type="text" className="form-control" placeholder="Enter City" name="city" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="province">Province</label>
                                            <input type="text" className="form-control" placeholder="Enter Province" name="province" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="postalCode">Postal Code</label>
                                              <input type="text" className="form-control" placeholder="Enter Postal Code" name="postalCode" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="phoneNumber">Phone Number</label>
                                            <input type="tel" className="form-control" placeholder="Enter Phone Number" name="phoneNumber" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="beneficiary">Beneficiary</label>
                                            <input type="text" className="form-control" placeholder="Enter Beneficiary" name="beneficiary" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="beneficiaryDate">Beneficiary Date</label>
                                              <input type="text" className="form-control" placeholder="Enter Beneficiary Date" name="beneficiaryDate" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="insurance">Insurance</label>
                                            <input type="tel" className="form-control" placeholder="Enter Insurance" name="insurance" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="insuranceDate">Insurance Date</label>
                                            <input type="text" className="form-control" placeholder="Enter Insurance Date" name="insuranceDate" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="remarks">Remarks</label>
                                              <input type="text" className="form-control" placeholder="Enter Remarks" name="remarks" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="companyPaid">Company Paid</label>
                                            <input type="text" className="form-control" placeholder="Enter Company Paid" name="companyPaid" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="hmoProvider">HMO Provider</label>
                                            <input type="text" className="form-control" placeholder="Enter HMO Provider" name="hmoProvider" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="hmoPolicynum">HMO Policy Number</label>
                                              <input type="text" className="form-control" placeholder="Enter HMO Policy Number" name="hmoPolicynum" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="typeOfCoverage">Type of coverage</label>
                                            <input type="tel" className="form-control" placeholder="Enter Type of coverage" name="typeOfCoverage" onChange={handleInputChange} />
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
                                            <span className="form-control"></span>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectCode">Product Code</label>
                                            <input type="text" className="form-control" placeholder="enter Product Code" name="productCode" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectName">Product Description</label>
                                            <input type="text" className="form-control" placeholder="enter Product Description" name="productDescription" onChange={handleInputChange} />
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
