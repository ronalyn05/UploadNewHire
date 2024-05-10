import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./navbar";
import TopNavbar from "./topnavbar";
import Footer from "./footer";
import axios from "axios";
import jsPDF from "jspdf";

function EmployeeProfile() {
  const { employeeId } = useParams();
  const { state } = useLocation();
  const [employeeData, setEmployeeData] = useState({
    ProfilePhoto: "/img/user.png",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [dependents, setDependents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (state && state.employeeData) {
      setEmployeeData(state.employeeData);
    } else {
      // Fetch employee data based on employeeId
      fetchEmployeeData(employeeId);
    }
  }, [employeeId, state]);

  const fetchEmployeeData = async () => {
    console.log("Employee Data:", employeeData);
    try {
      const response = await fetch(
        `http://localhost:5000/retrieve/${employeeId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch employee data");
      }
      const data = await response.json();
      setEmployeeData(data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setErrorMessage("Error fetching employee data");
    }
  };

  useEffect(() => {
    fetchDependents(); // Call fetchDependents when component mounts or employeeId changes
  }, [employeeId]);

  // Function to fetch dependent data
  const fetchDependents = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/retrieve/dependents/${employeeId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch dependent data");
      }
      const data = await response.json();
      setDependents(data); // Assuming data is an array of dependents
    } catch (error) {
      console.error("Error fetching dependent data:", error);
      setErrorMessage("Error fetching dependent data");
    }
  };

  const handleNavigateBack = () => {
    // Go back to the previous page in history
    navigate(-1); // Navigate back one step in history (equivalent to pressing the browser's back button)
  };
   //handles the downloaf of pdf file
   const handleDownloadPDF = () => {
    if (!employeeData) return;

    const doc = new jsPDF();
    let y = 20;

    doc.setFillColor(65, 105, 225); // background color (royal blue)
    doc.setTextColor(255); // White text color
    doc.setFontSize(16);

    const rectWidth = 190; // Width of the rectangle
    const textWidth = doc.getStringUnitWidth("PERSONAL DETAILS") * 16; // Calculate text width based on font size
    const xPosition = (rectWidth - textWidth) / 2 + 4; // Calculate x-coordinate to center the text within the rectangle

    doc.rect(4, y - 10, rectWidth, 15, "F"); // Draw a filled rectangle for the background
    doc.text("PERSONAL DETAILS", xPosition, y); // Centered text
    y += 20;

    const employeeInfo = [
      { label: "Employee ID:", value: employeeData.EmployeeId },
      { label: "Name:", value: employeeData.EmployeeName },
      { label: "First Name:", value: employeeData.FirstName },
      { label: "Middle Name:", value: employeeData.MiddleName },
      { label: "Last Name:", value: employeeData.LastName },
      { label: "Maiden Name:", value: employeeData.MaidenName },
      { label: "Birthdate:", value: employeeData.Birthdate },
      { label: "Age:", value: employeeData.Age },
      { label: "Birth Month:", value: employeeData.BirthMonth },
      { label: "Age Bracket:", value: employeeData.AgeBracket },
      { label: "Gender:", value: employeeData.Gender },
      { label: "Marital Status:", value: employeeData.MaritalStatus },
      { label: "SSS:", value: employeeData.SSS },
      { label: "PHIC:", value: employeeData.PHIC },
      { label: "HDMF:", value: employeeData.HDMF },
      { label: "TIN:", value: employeeData.TIN },
      { label: "Contact Number:", value: employeeData.ContactNumber },
      { label: "Email Address:", value: employeeData.EmailAddress },
    ];

    doc.setFontSize(12);
    doc.setTextColor(0);

    employeeInfo.forEach(({ label, value }) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 80, y);
      y += 10;
    });

    doc.save("employee_details.pdf");
  };

  if (!employeeData) {
    return <div>Loading...</div>;
  }

  // const profilePhotoUrl = employeeData.ProfilePhoto || defaultProfilePhoto;

  return (
    <div>
      <div id="wrapper">
        <Navbar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <TopNavbar />
            <div className="container-fluid">
              <div>
                {/* Button to navigate back */}
                <button
                  className="update-button btn btn-xs mr-2"
                  onClick={handleNavigateBack}
                >
                  <i className="fas fa-arrow-left"></i> Back
                </button>
              </div>
              <br />
              <div className="row justify-content-center">
                <div className="col-xl-12 col-lg-12">
                  <div className="card shadow mb-4">
                  <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h5 className="m-0 font-weight-bold text-primary">Employee Profile</h5>
                    <div className="d-flex align-items-center">
                        <button
                        className="update-button btn btn-xs mr-2"
                        onClick={handleDownloadPDF}
                        >
                        <i className="fas fa-arrow-down"></i> Download Record
                        </button>
                    </div>
                    </div>
                    <div className="card-body">
                      <div className="row font-weight-bold">
                        {/* Profile Container */}
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
                                src="/img/user.png" // Default profile photo
                                alt="Default Profile"
                                className="img-fluid rounded-circle profile-photo"
                              />
                            )}
                          </div>
                          <div className="row justify-content-center">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label className="blueLabel labelWithSpacing">
                                  Employee ID:
                                </label>
                                <span className="valueBadge">
                                  {Array.isArray(employeeData.EmployeeId)
                                    ? employeeData.EmployeeId[0]
                                    : employeeData.EmployeeId}
                                </span>
                                <br />
                              </div>
                            </div>
                            <div className="col-md-6">
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
                          </div>
                          <div className="col-md-12 border">
                            <div className="profile-info">
                              <h5 className="m-0 font-weight-bold text-primary textDecorationUnderline">
                                PERSONAL DETAILS
                              </h5>
                              <br />
                              <div className="row justify-content-center">
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="blueLabel labelWithSpacing">
                                      First Name:
                                    </label>
                                    <span className="valueCenter">
                                      {employeeData.FirstName}
                                    </span>
                                    <br />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="blueLabel labelWithSpacing">
                                      Middle Name:
                                    </label>
                                    <span className="valueCenter">
                                      {employeeData.MiddleName}
                                    </span>
                                    <br />
                                  </div>
                                </div>
                              </div>
                              <div className="row justify-content-center">
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="blueLabel labelWithSpacing">
                                      Last Name:
                                    </label>
                                    <span className="valueCenter">
                                      {employeeData.LastName}
                                    </span>
                                    <br />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="blueLabel labelWithSpacing">
                                      Maiden Name:
                                    </label>
                                    <span className="valueCenter">
                                      {employeeData.MaidenName}
                                    </span>
                                    <br />
                                  </div>
                                </div>
                              </div>
                              <div className="row justify-content-center">
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="blueLabel labelWithSpacing">
                                      Birthdate:
                                    </label>
                                    <span className="valueCenter">
                                      {employeeData.Birthdate}
                                    </span>
                                    <br />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="blueLabel labelWithSpacing">
                                      Age:
                                    </label>
                                    <span>{employeeData.Age}</span>
                                    <br />
                                  </div>
                                </div>
                              </div>
                              <div className="row justify-content-center">
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="blueLabel labelWithSpacing">
                                      Birth Month:
                                    </label>
                                    <span className="valueCenter">
                                      {employeeData.BirthMonth}
                                    </span>
                                    <br />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="blueLabel labelWithSpacing">
                                      Age Bracket:
                                    </label>
                                    <span>{employeeData.AgeBracket}</span>
                                    <br />
                                  </div>
                                </div>
                              </div>
                              <div className="row justify-content-center">
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="blueLabel labelWithSpacing">
                                      Gender:
                                    </label>
                                    <span className="valueCenter">
                                      {employeeData.Gender}
                                    </span>
                                    <br />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="blueLabel labelWithSpacing">
                                      Marital Status:
                                    </label>
                                    <span className="valueCenter">
                                      {employeeData.MaritalStatus}
                                    </span>
                                    <br />
                                  </div>
                                </div>
                              </div>
                              <div className="row justify-content-center">
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="blueLabel labelWithSpacing">
                                      SSS:
                                    </label>
                                    <span className="valueCenter">
                                      {employeeData.SSS}
                                    </span>
                                    <br />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="blueLabel labelWithSpacing">
                                      PHIC:
                                    </label>
                                    <span className="valueCenter">
                                      {employeeData.PHIC}
                                    </span>
                                    <br />
                                  </div>
                                </div>
                              </div>
                              <div className="row justify-content-center">
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="blueLabel labelWithSpacing">
                                      HDMF:
                                    </label>
                                    <span className="valueCenter">
                                      {employeeData.HDMF}
                                    </span>
                                    <br />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="blueLabel labelWithSpacing">
                                      TIN:
                                    </label>
                                    <span className="valueCenter">
                                      {employeeData.TIN}
                                    </span>
                                    <br />
                                  </div>
                                </div>
                              </div>
                              <div className="row justify-content-center">
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="blueLabel labelWithSpacing">
                                      Contact Number:
                                    </label>
                                    <span className="valueCenter">
                                      {employeeData.ContactNumber}
                                    </span>
                                    <br />
                                  </div>
                                </div>
                                <div className="col-md-6">
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
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-8 border">
                          <div className="profile-info">
                            {errorMessage && (
                              <div className="row justify-content-center">
                                <div className="col-md-6">
                                  <div className="alert alert-danger mt-3">
                                    {errorMessage}
                                  </div>
                                </div>
                              </div>
                            )}
                            <h5 className="m-0 font-weight-bold text-primary textDecorationUnderline">
                              EMPLOYEE INFORMATION
                            </h5>
                            <br />
                            <form className="user">
                              {employeeData && (
                                <div>
                                  <div className="row justify-content-center">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Date Hired:
                                        </label>
                                        <span className="valueCenter font-weight-bold">
                                          {employeeData.DateHired}
                                        </span>
                                        <br />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          HRAN ID:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.HRANID}
                                        </span>
                                        <br />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Tenure:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.Tenure}
                                        </span>
                                        <br />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row justify-content-center">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Employee Level:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.EmployeeLevel}
                                        </span>
                                        <br />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Project Code:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.ProjectCode}
                                        </span>
                                        <br />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Project Name:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.ProjectName}
                                        </span>
                                        <br />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row justify-content-center">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Designation:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.Designation}
                                        </span>
                                        <br />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Department:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.DepartmentName}
                                        </span>
                                        <br />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Product Code:
                                        </label>
                                        <span className="valueCenter labelWithSpacing">
                                          {employeeData.ProdCode}
                                        </span>
                                        <br />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row justify-content-center">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Product Description:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.ProdDesc}
                                        </span>
                                        <br />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Employment Status:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.EmploymentStatus}
                                        </span>
                                        <br />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Employee Status:
                                        </label>
                                        <span
                                          className={`valueCenter font-weight-bold ${
                                            employeeData.EmployeeStatus ===
                                            "ACTIVE"
                                              ? "text-success"
                                              : "text-danger"
                                          }`}
                                          style={{
                                            textDecoration: "underline",
                                          }}
                                        >
                                          {employeeData.EmployeeStatus}
                                        </span>
                                        <br />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row justify-content-center">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          HRAN Type:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.HRANType}
                                        </span>
                                        <br />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          {" "}
                                          Work week type:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.WorkWeekType}
                                        </span>
                                        <br />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Shift:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.ShiftName}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row justify-content-center">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Work Arrangement:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.WorkArrangement}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Rate Class:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.RateClass}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Rate:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.Rate}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row justify-content-center">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Manager Id:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.ManagerID}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Manager Name
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.ManagerName}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          PMPICID:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.PMPICID}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row justify-content-center">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          PMPICID Name:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.PMPICIDName}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Delivery Unit:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.DUName}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          DUHID:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.DUHID}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row justify-content-center">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          DUH Name:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.DUHName}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Is Manager:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.IsManager === 1
                                            ? "Yes"
                                            : "No"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Is PMPIC:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.IsPMPIC === 1
                                            ? "Yes"
                                            : "No"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row justify-content-center">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Is Individual Contributor:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.IsIndividualContributor ===
                                          1
                                            ? "Yes"
                                            : "No"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Is Active:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.IsActive === 1
                                            ? "Yes"
                                            : "No"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Is DU Head:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.IsDUHead === 1
                                            ? "Yes"
                                            : "No"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row justify-content-center">
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          TITO Type:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.TITOType}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing">
                                          Position:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.Position}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                        <label className="blueLabel labelWithSpacing ">
                                          Position Level:
                                        </label>
                                        <span className="valueCenter">
                                          {employeeData.PositionLevel}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </form>
                          </div>
                        </div>
                      </div>
                      <br />
                      {/* DEPENDENT INFORMATION */}
                      <div className="text-center mb-3 bg-primary text-white p-2">
                        <h5>DEPENDENT DETAILS</h5>
                      </div>
                        <div className="table-responsive">
                          <table className="table">
                            <thead>
                              <tr>
                                <th scope="col">Full Name</th>
                                <th scope="col">Phone Number</th>
                                <th scope="col">Relationship</th>
                                <th scope="col">Date of Birth</th>
                                <th scope="col">Occupation</th>
                                <th scope="col">Address</th>
                                <th scope="col">City</th>
                                <th scope="col">Province</th>
                                <th scope="col">Postal Code</th>
                                <th scope="col">Beneficiary</th>
                                <th scope="col">Beneficiary Date</th>
                                <th scope="col">Type of Coverage</th>
                                <th scope="col">Insurance</th>
                                <th scope="col">Insurance Date</th>
                                <th scope="col">Remarks</th>
                                <th scope="col">Company Paid</th>
                                <th scope="col">HMO Provider</th>
                                <th scope="col">HMO Policy Number</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dependents.length > 0 ? (
                                dependents.map((dependent, index) => (
                                  <tr key={index}>
                                    <td>{dependent.FullName}</td>
                                    <td>{dependent.PhoneNum}</td>
                                    <td>{dependent.Relationship}</td>
                                    <td>{dependent.DateOfBirth}</td>
                                    <td>{dependent.Occupation}</td>
                                    <td>{dependent.Address}</td>
                                    <td>{dependent.City}</td>
                                    <td>{dependent.DepProvince}</td>
                                    <td>{dependent.PostalCode}</td>
                                    <td>{dependent.Beneficiary}</td>
                                    <td>{dependent.BeneficiaryDate}</td>
                                    <td>{dependent.TypeOfCoverage}</td>
                                    <td>{dependent.Insurance}</td>
                                    <td>{dependent.InsuranceDate}</td>
                                    <td>{dependent.Remarks}</td>
                                    <td>{dependent.CompanyPaid}</td>
                                    <td>{dependent.HMOProvider}</td>
                                    <td>{dependent.HMOPolicyNumber}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="18">No dependents data yet.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
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
