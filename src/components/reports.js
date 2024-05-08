import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import TopNavbar from "./topnavbar";
import Footer from "./footer";
import {useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import '../App.css';
// import axios from "axios";

const Reports = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleUpdate = (EmployeeId) => {
    // Redirect to the update page with employee ID as a parameter
    navigate(`/update/${EmployeeId}`);
    // navigate(`/update/${employee.EmpID}`, { state: { employee } });
  };
// //function to handle on deleting all data in different tables
// const handleDeleteAllData = async () => {
//   try {
//     const response = await axios.delete('/api/deleteAllEmployeeData');
//     alert(response.data.message);
//   } catch (error) {
//     console.error('Error deleting all employee data:', error);
//     alert('Failed to delete all employee data. Please try again.');
//   }
// };
const handleViewDetails = (employee) => {
  setSelectedEmployee(employee);
  setIsModalOpen(true);
};

const handleCloseModal = () => {
  setSelectedEmployee(null);
  setIsModalOpen(false);
};
// Effect to filter employee data based on search query
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
    filterEmployees(value);
  };

  const filterEmployees = (query) => {
    const filtered = employees.filter(
      (employee) =>
        String(employee.EmployeeId).toLowerCase().includes(query.toLowerCase()) ||
        employee.EmployeeName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Make a GET request to fetch new hire employees from the server
        const response = await fetch("/newHireEmp"); // Fetch reports for the logged-in user
        // const response = await fetch('/newHireEmp');
  
        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
  
        // Extract the data from the response
        const data = await response.json();

       // To convert all the capital letters in a string to title case (capitalize the first letter of each word)
        function convertToTitleCase(str) {
          return str.toLowerCase().replace(/\b\w/g, function (char) {
            return char.toUpperCase();
          });
        }
        // Convert names to title case before setting in state
        const formattedData = data.map(employee => ({
          ...employee,
          EmployeeName: convertToTitleCase(employee.EmployeeName),
          FirstName: convertToTitleCase(employee.FirstName),
          MiddleName: convertToTitleCase(employee.MiddleName),
          LastName: convertToTitleCase(employee.LastName),
          BirthMonth: convertToTitleCase(employee.BirthMonth),
          MaritalStatus: convertToTitleCase(employee.MaritalStatus),
          Gender: convertToTitleCase(employee.Gender),
        }));
  
        // Set the retrieved data in your component state
        setEmployees(formattedData);
        setFilteredEmployees(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    // Call the fetchData function when the component mounts
    fetchData();
  }, []); // Empty dependency array to run only once when the component mounts

  //handles the downloaf of pdf file 
  const handleDownloadPDF = () => {
    if (!selectedEmployee) return;
  
    const doc = new jsPDF();
    let y = 20;

    doc.setFillColor(65, 105, 225); // background color (royal blue)
    doc.setTextColor(255); // White text color
    doc.setFontSize(16);
    
    const rectWidth = 190; // Width of the rectangle
    const textWidth = doc.getStringUnitWidth('PERSONAL DETAILS') * 16; // Calculate text width based on font size
    const xPosition = (rectWidth - textWidth) / 2 + 4; // Calculate x-coordinate to center the text within the rectangle
    
    doc.rect(4, y - 10, rectWidth, 15, 'F'); // Draw a filled rectangle for the background
    doc.text('PERSONAL DETAILS', xPosition, y); // Centered text
    y += 20;
  
    const employeeInfo = [
      { label: 'Employee ID:', value: selectedEmployee.EmployeeId },
      { label: 'Name:', value: selectedEmployee.EmployeeName },
      { label: 'First Name:', value: selectedEmployee.FirstName },
      { label: 'Middle Name:', value: selectedEmployee.MiddleName },
      { label: 'Last Name:', value: selectedEmployee.LastName },
      { label: 'Maiden Name:', value: selectedEmployee.MaidenName },
      { label: 'Birthdate:', value: selectedEmployee.Birthdate },
      { label: 'Age:', value: selectedEmployee.Age },
      { label: 'Birth Month:', value: selectedEmployee.BirthMonth },
      { label: 'Age Bracket:', value: selectedEmployee.AgeBracket },
      { label: 'Gender:', value: selectedEmployee.Gender },
      { label: 'Marital Status:', value: selectedEmployee.MaritalStatus },
      { label: 'SSS:', value: selectedEmployee.SSS },
      { label: 'PHIC:', value: selectedEmployee.PHIC },
      { label: 'HDMF:', value: selectedEmployee.HDMF },
      { label: 'TIN:', value: selectedEmployee.TIN },
      { label: 'Contact Number:', value: selectedEmployee.ContactNumber },
      { label: 'Email Address:', value: selectedEmployee.EmailAddress }
    ];
  
    doc.setFontSize(12);
    doc.setTextColor(0);
  
    employeeInfo.forEach(({ label, value }) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 80, y);
      y += 10;
    });
  
    doc.save('employee_details.pdf');
  };
  
  

  return (
    <div>
      <div id="wrapper">
        {/* Sidebar */}
        <Navbar />
        {/* Content Wrapper */}
        <div id="content-wrapper" className="d-flex flex-column">
          {/* Main Content */}
          <div id="content">
            {/* Topbar */}
            <TopNavbar />
            {/* Start of Page Content */}

            <div className="container-fluid">
              <div className="row justify-content-center">
                <div className="col-xl-12 col-lg-12">
                  <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h5 className="m-0 font-weight-bold text-primary">
                        Reports
                      </h5>
                      {/* Topbar Search */}
                      <form className="form-inline ml-auto">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <button className="btn btn-primary" type="button">
                              <i className="fas fa-search fa-sm"></i>
                            </button>
                          </div>
                          <input
                            type="text"
                            className="form-control bg-light border-0 small"
                            placeholder="Search by ID or Name"
                            value={searchQuery}
                            onChange={handleSearchChange}
                          />
                        </div>
                      </form>
                                    {/* <button
                                      className="update-button btn btn-xs"
                                      onClick={handleDeleteAllData} // handle to delete all data in different table
                                    >
                                      <i className="fas fa-trash-alt"></i>
                                    </button>
                                    <span>Delete all data</span> */}
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">ACTION</th>
                              <th scope="col">EMPLOYEE ID</th>
                              <th scope="col">NAME</th>
                              <th scope="col">FIRST NAME</th>
                              <th scope="col">MIDDLE NAME</th>
                              <th scope="col">LAST NAME</th>
                              <th scope="col">MAIDEN NAME</th>
                              <th scope="col">BIRTHDATE</th>
                              <th scope="col">AGE</th>
                              <th scope="col">BIRTH MONTH</th>
                              <th scope="col">AGE BRACKET</th>
                              <th scope="col">GENDER</th>
                              <th scope="col">MARITAL STATUS</th>
                              <th scope="col">SSS</th>
                              <th scope="col">PHIC</th>
                              <th scope="col">HDMF</th>
                              <th scope="col">TIN</th>
                              <th scope="col">CONTACT NUMBER</th>
                              <th scope="col">EMAIL ADDRESS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredEmployees.length > 0 ? (
                              filteredEmployees.map((employee) => (
                                <tr key={employee.EmployeeId}>
                                  <td>
                                    <button
                                      className="update-button btn btn-xs mr-2"
                                      onClick={() =>
                                        handleUpdate(employee.EmployeeId)
                                      } // Call handleUpdate with employee ID
                                    >
                                      <i className="fas fa-pencil-alt"></i>
                                    </button>
                                    <button
                                    className="btn btn-xs btn-success "
                                    onClick={() => handleViewDetails(employee)}
                                  >
                                    <i className="far fa-eye"></i> 
                                  </button>
                                  </td>
                                  <td>{employee.EmployeeId}</td>
                                  <td>{employee.EmployeeName}</td>
                                  <td>{employee.FirstName}</td>
                                  <td>{employee.MiddleName}</td>
                                  <td>{employee.LastName}</td>
                                  <td>{employee.MaidenName}</td>
                                  <td>{employee.Birthdate}</td>
                                  <td>{employee.Age}</td>
                                  <td>{employee.BirthMonth}</td>
                                  <td>{employee.AgeBracket}</td>
                                  <td>{employee.Gender}</td>
                                  <td>{employee.MaritalStatus}</td>
                                  <td>{employee.SSS}</td>
                                  <td>{employee.PHIC}</td>
                                  <td>{employee.HDMF}</td>
                                  <td>{employee.TIN}</td>
                                  {/* <td>{employee.HRANID}</td> */}
                                  <td>{employee.ContactNumber}</td>
                                  <td>{employee.EmailAddress}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="20">No data available</td>
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
            {/* /.container-fluid */}
          </div>
          {/* Footer */}
          <Footer />
          {/* End of Page Content */}
        </div>
        {/* End of Content Wrapper */}
      </div>
      {/* End of Page Wrapper */}
       {/* Add Dependent Modal */}
       <Modal show={isModalOpen} onHide={handleCloseModal} dialogClassName="custom-modal">
            <Modal.Header>
                <Modal.Title>Employee Information</Modal.Title>
                <Button variant="default" onClick={handleCloseModal}> X </Button>
            </Modal.Header>
            <Modal.Body>
               <form>
          {selectedEmployee && (
            <div>
              <div className="text-center mb-3 bg-primary text-white p-2">
          <h5 >PERSONAL DETAILS</h5>
        </div>
              <div className="row justify-content-center">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Employee ID:</label>
                      <span>{selectedEmployee.EmployeeId}</span><br />
                      </div>
                  </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Name:</label>
                    <span>{selectedEmployee.EmployeeName}</span><br /> 
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                    <label>First Name:</label>
                      <span>{selectedEmployee.FirstName}</span><br />
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Middle Name:</label>
                      <span>{selectedEmployee.MiddleName}</span><br />
                  </div>
                </div>
              <div className="col-md-4">
                <div className="form-group">
                <label>Last Name:</label>
              <span>{selectedEmployee.LastName}</span><br />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                <label>Maiden Name:</label>
              <span>{selectedEmployee.MaidenName}</span><br />
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-4">
                  <div className="form-group">
                  <label>Birthdate:</label>
              <span>{selectedEmployee.Birthdate}</span><br />
                  </div>
                </div>
              <div className="col-md-4">
                <div className="form-group">
                <label>Age:</label>
              <span>{selectedEmployee.Age}</span><br />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                <label>Birth Month:</label>
              <span>{selectedEmployee.BirthMonth}</span><br />
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-4">
                  <div className="form-group">
                  <label>Age Bracket:</label>
              <span>{selectedEmployee.AgeBracket}</span><br />
                  </div>
                </div>
              <div className="col-md-4">
                <div className="form-group">
                <label>Gender:</label>
              <span>{selectedEmployee.Gender}</span><br />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                <label>Marital Status:</label>
              <span>{selectedEmployee.MaritalStatus}</span><br />
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-4">
                  <div className="form-group">
                  <label>SSS:</label>
              <span>{selectedEmployee.SSS}</span><br />
                  </div>
                </div>
              <div className="col-md-4">
                <div className="form-group">
                <label>PHIC:</label>
              <span>{selectedEmployee.PHIC}</span><br />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                <label>HDMF:</label>
              <span>{selectedEmployee.HDMF}</span><br />
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-4">
                  <div className="form-group">
                  <label>TIN:</label>
              <span>{selectedEmployee.TIN}</span><br />
                  </div>
                </div>
              <div className="col-md-4">
                <div className="form-group">
                <label>Contact Number:</label>
              <span>{selectedEmployee.ContactNumber}</span><br />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                <label>Email Address:</label>
              <span>{selectedEmployee.EmailAddress}</span><br />
                </div>
              </div>
            </div>
            </div>
          )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={handleDownloadPDF}>Download PDF</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Reports;