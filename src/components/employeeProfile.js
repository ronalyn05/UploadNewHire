import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./navbar";
import TopNavbar from "./topnavbar";
import Footer from "./footer";

function EmployeeProfile() {
  const { employeeId } = useParams();
  const { state } = useLocation();
  const [employeeData, setEmployeeData] = useState({
    ProfilePhoto: "/img/user.png",
  });
  // const [password, setPassword] = useState('');
  // const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const employeeProfileRef = useRef(null);
  const [formData, setFormData] = useState({
    Password: "",
    Role: ""
  });

  useEffect(() => {
    if (state && state.employeeData) {
      setEmployeeData(state.employeeData);
      // setRole(state.employeeData.Role || '');
    } else {
      fetchEmployeeData(employeeId);
    }
  }, [employeeId, state]);

  const fetchEmployeeData = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:5000/retrieve/${employeeId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch employee data");
      }
      const data = await response.json();
      setEmployeeData(data);
      // setRole(data.Role || '');
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setErrorMessage("Error fetching employee data");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "green";
      case "Separated":
        return "red";
      case "Inactive - Maternity":
      case "Inactive - Sickness":
      case "Inactive - Absent with leave":
      case "Inactive - Absent Without Leave":
      case "Inactive - Suspension":
        return "gray";
      default:
        return "black";
    }
  };

  const statusColor = getStatusColor(employeeData.EmployeeStatus);

  const handleNavigateBack = () => {
    navigate(-1);
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
//function to reset the employee password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
  console.log(employeeId);
    try {
      const response = await fetch(`http://localhost:5000/update/password/${employeeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          EmployeeId: sessionStorage.getItem('employeeId'),
          Password: formData.password,
          
        }),
      });
  
      if (!response.ok) {
        const responseData = await response.json();
        setErrorMessage(responseData.error || 'Password Change Failed');
        return;
      }

      alert('Password has successfully changed!');

      //window reload
      window.location.reload();
      
      // navigate('/');
    } catch (error) {
      console.error("Password Change Failed", error);
      setErrorMessage(error.message || "Password Change Failed.");
    }
  };
  //function to update the employee role type
  const handleRoleUpdate = async (e) => {
    e.preventDefault();
  console.log(employeeId);
    try {
        const response = await fetch(`http://localhost:5000/update/role/${employeeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          EmployeeId: sessionStorage.getItem('employeeId'),
          Role: formData.role,
          
        }),
      });
  
      if (!response.ok) {
        const responseData = await response.json();
        setErrorMessage(responseData.error || 'Role Change Failed');
        return;
      }

      alert('Role has successfully changed!');

      //window reload
      window.location.reload();
      fetchEmployeeData();
      
      // navigate('/');
    } catch (error) {
      console.error("Role Change Failed", error);
      setErrorMessage(error.message || "Role Change Failed.");
    }
  };

  // const handleRoleUpdate = async (e) => {
  //   e.preventDefault();
  //   console.log(employeeId);
  //   console.log(formData);
  //   try {
  //     const response = await fetch(`http://localhost:5000/update/role/${employeeId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         EmployeeId: sessionStorage.getItem('employeeId'),
  //         Role: formData.role,
  //       }),
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to update role');
  //     }
  //     const updatedData = await response.json();
  //     setEmployeeData(updatedData);
  //     // Fetch updated employee data after role update
  //     await fetchEmployeeData(employeeId);
  //     alert('Role updated successfully');
  //   } catch (error) {
  //     console.error('Error updating role:', error);
  //     setErrorMessage('Error updating role');
  //   }
  // };

  if (!employeeData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div id="wrapper">
        <Navbar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <TopNavbar />
            <div className="container-fluid">
              <div>
                <button
                  className="update-button btn btn-xs mr-2"
                  onClick={handleNavigateBack}
                >
                  <i className="fas fa-arrow-left"></i> Back
                </button>
              </div>
              <br />
              <div className="row justify-content-center">
                <div className="col-xl-12 col-xl-12">
                  <div className="card shadow mb-12">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h5 className="m-0 font-weight-bold text-primary">
                        Employee Profile
                      </h5>
                    </div>
                    <div className="card-body" ref={employeeProfileRef}>
                      <div className="row">
                        <div className="col-md-4">
                          <div className="profile-container">
                            {employeeData.ProfilePhoto ? (
                              <img
                                src={employeeData.ProfilePhoto}
                                alt="Profile"
                                className="img-fluid rounded-circle profile-photo"
                              />
                            ) : (
                              <img
                                src="/img/user.png"
                                alt="Default Profile"
                                className="img-fluid rounded-circle profile-photo"
                              />
                            )}
                          </div>
                          <div className="row align-items-center text-center justify-content-center">
                            <div className="col-md-9">
                              <div className="form-group">
                                <label className="blueLabel labelWithSpacing">
                                  Employee ID:
                                </label>
                                <span className="textDecorationUnderline">
                                  {Array.isArray(employeeData.EmployeeId)
                                    ? employeeData.EmployeeId[0]
                                    : employeeData.EmployeeId}
                                </span>
                                <br />
                              </div>
                            </div>
                            <div className="col-md-9 ">
                              <div className="form-group">
                                <label className="blueLabel labelWithSpacing">
                                  Employee Status:
                                </label>
                                <span
                                  style={{
                                    color: statusColor,
                                    textDecoration: "underline",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {employeeData.EmployeeStatus}
                                </span>
                                <br />
                              </div>
                            </div>
                            <div className="col-md-9">
                              <div className="form-group">
                                <label className="blueLabel labelWithSpacing">
                                  Name:
                                </label>
                                <span className="valueCenter">
                                  {employeeData.EmployeeName}
                                </span>
                                <br />
                              </div>
                            </div>
                            <div className="col-md-9">
                              <div className="form-group">
                                <label className="blueLabel labelWithSpacing">
                                  Email Address:
                                </label>
                                <span className="valueCenter">
                                  {employeeData.EmailAddress}
                                </span>
                                <br />
                              </div>
                            </div>
                            <div className="col-md-9">
                              <div className="form-group">
                                <label className="blueLabel labelWithSpacing">
                                  Current Role Type:
                                </label>
                                <span className="valueCenter">
                                  {employeeData.Role}
                                </span>
                                <br />
                              </div>
                            </div>
                          </div>
                        </div>
                        <br />
                        <form className="user">
                          <div className="row justify-content-center">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Birth Date</label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.Birthdate}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Age</label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.Age}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="row justify-content-center">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Gender</label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.Gender}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Marital Status</label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.MaritalStatus}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="row justify-content-center">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Date Hired</label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.DateHired}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Level</label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.Level}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="row justify-content-center">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="EmploymentStatus">
                                  Employment Status
                                </label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.EmploymentStatus}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Work Arrangement</label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.WorkArrangement}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="row ">
                            <div className="col-md-12">
                              <div className="form-group">
                                <label>Position</label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.Position}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="row justify-content-center">
                            <div className="col-md-12">
                              <div className="form-group">
                                <label htmlFor="Shift">Shift</label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.ShiftName}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="row justify-content-center">
                            <div className="col-md-12">
                              <div className="form-group">
                                <label>Department</label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.DepartmentName}
                                </span>
                              </div>
                            </div>
                          </div>
                          <hr/>
                                  <h5 className='text-primary'>Change employee password / role type here</h5>
                                  <hr className="hr-change-Pass"/>
                                <br/>
                                <form>
                                  <div className="form-group">
                                  <label className="blueLabel labelWithSpacing">
                                  Reset Password
                                </label>
                                    <div className="d-flex align-items-center">
                                      <input 
                                        type="password" 
                                        className="form-control mr-2" 
                                        value={formData.password}
                                        placeholder="Reset Employee Password" 
                                        name="password" 
                                        onChange={handleInputChange}
                                      />
                                      <button type="submit" className="btn btn-primary" onClick={handlePasswordUpdate}>
                                      <i className="fas fa-pencil-alt"></i></button>
                                    </div>
                                  </div>
                                </form> 
                                <form>
                                  <div className="form-group">
                                  <label className="blueLabel labelWithSpacing">
                                  Update Role Type
                                </label>
                                    <div className="d-flex align-items-center">
                                    <select className= 'form-control mr-2' 
                                                    value={formData.role} name="Update Employee Role" onChange={handleInputChange}>
                                                      <option>Select Role Type</option>
                                                        <option value="HRAdmin">HRAdmin</option>
                                                        <option value="Employee">Employee</option>
                                                    </select>
                                      <button type="submit" className="btn btn-primary"  onClick={handleRoleUpdate}>
                                      <i className="fas fa-pencil-alt"></i></button>
                                    </div>
                                  </div>
                                </form>
                        </form>
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
    </div>
  );
}

export default EmployeeProfile;

