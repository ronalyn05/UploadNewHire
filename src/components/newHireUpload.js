import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Modal, Button, Row, Col } from "react-bootstrap";
import Navbar from "./navbar";
import TopNavbar from "./topnavbar";
import Footer from "./footer";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewHireUpload = () => {

  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [editModalShow, setEditModalShow] = useState(false);
  const [editRowData, setEditRowData] = useState(null);
  const [editedData, setEditedData] = useState({}); // State to hold edited data

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setShowPreview(false);
    setActiveTab("upload");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("No File Selected");
      return;
    }

    const fileType = file.type;
    if (
      fileType !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      alert("Please select an Excel file.");
      return;
    }

    try {
      const data = await readFile(file);
      const parsedData = parseExcelData(data);
      setExcelData(parsedData);
      setShowPreview(true);
      setActiveTab("preview");
    } catch (error) {
      console.error("Error occurred while reading the file:", error);
      setExcelData([]);
      setShowPreview(false);
      setActiveTab("upload");
      alert("Error occurred while reading the file. Please try again.");
    }
  };

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(new Uint8Array(e.target.result));
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const parseCellValue = (value) => {
    return value !== undefined && value !== null ? value.toString() : "N/A";
  };

  const parseExcelData = (data) => {
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (rows.length === 0) {
      return [];
    }

    const headers = rows[0];
    const parsedData = rows.slice(1).map((row) => {
      const rowData = {};
      Object.keys(headers).forEach((headerKey) => {
        const header = headers[headerKey];
        const cellValue = row[headerKey];
        rowData[header] = parseCellValue(cellValue);
      });
      return rowData;
    });

    return parsedData;
  };

  const convertExcelDateToDate = (excelDateValue) => {
    if (!excelDateValue) return null;

    const excelDateNumber = parseFloat(excelDateValue);

    if (isNaN(excelDateNumber)) return null;

    const excelDateInMS = (excelDateNumber - 25569) * 86400 * 1000;
    const dateObj = new Date(excelDateInMS);

    return dateObj.toLocaleDateString(); // Return date in locale format
  };

  const handleEditClick = (rowData) => {
    setEditRowData(rowData);
    setEditedData(rowData); // Initialize edited data with current row data
    setEditModalShow(true);
  };

  const handleCloseEditModal = () => {
    setEditModalShow(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSaveChanges = () => {
    // Update excelData with editedData
    const updatedData = excelData.map((row) => {
      if (row === editRowData) {
        return { ...row, ...editedData };
      }
      return row;
    });

    setExcelData(updatedData);
    setEditModalShow(false);
  };

  const handleSaveData = async () => {
    console.log("this");
    console.log(excelData);
    try {
        // Check for null values in any row
        const hasNullValues = excelData.some((row) =>
            Object.values(row).some((value) => value === null || value === "")
        );

        if (hasNullValues) {
            alert(
                "One or more fields contain null values. Please fill in all fields and fill 'N/A if fields is empty."
            );
            return;
        }

        // Convert birthdate to date format before saving
        const formattedData = excelData.map((row) => {
            const formattedRow = { ...row };
            // Assuming the key containing birthdate is 'Birthdate', modify as necessary
            formattedRow['Birthdate'] = convertExcelDateToDate(row['Birthdate']);
            return formattedRow;
        });

        // Make a POST request to the API endpoint for inserting previewed data
        const response = await axios.post('/upload', formattedData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status !== 200) {
            throw new Error("Failed to save data");
        }

        console.log(response.data); // Log the response from the API
        alert("Data has been successfully uploaded!");
        // Navigate to report.js
        navigate("/reports");
    } catch (error) {
        console.error("Error occurred while saving data:", error);
        alert(
            'Error occurred while uploading data.Please check your uploaded data and make sure all fields have values or replace empty fields with "N/A".'
        );
    }
};

// const convertExcelDateToDate = (excelDateValue) => {
//     if (!excelDateValue) return null;

//     const excelDateNumber = parseFloat(excelDateValue);

//     if (isNaN(excelDateNumber)) return null;

//     const excelDateInMS = (excelDateNumber - 25569) * 86400 * 1000;
//     const dateObj = new Date(excelDateInMS);

//     return dateObj.toLocaleDateString(); // Return date in locale format
// };

  

  // const handleSaveData = async () => {
  //   console.log("this");
  //   console.log(excelData);
  //   try {
  //     // Make a POST request to the API endpoint for inserting previewed data
  //     const response = await axios.post(
  //       variables.API_URL + "Employee/insertPreviewData",
  //       excelData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.status !== 200) {
  //       throw new Error("Failed to save data");
  //     }

  //     console.log(response.data); // Log the response from the API
  //     alert("Data has been successfully uploaded!");
  //     // Navigate to report.js
  //     navigate("/reports");
  //   } catch (error) {
  //     //console.error('Error occurred while saving data:', error);
  //     alert(
  //       'Please check your uploaded data. Make sure all fields have values or replace empty fields with "N/A".',
  //       error
  //     );
  //     // if (error.response && error.response.data && error.response.data.message === 'No data provided') {
  //     //   // Prompt the user to check their uploaded data if no data is provided
  //     //   alert('Please check your uploaded data. Make sure all fields have values or replace empty fields with "N/A".');
  //     // } else {
  //     //   // For other errors, display a generic error message
  //     //   alert('Error occurred while saving data. Please try again later.');
  //     // }
  //   }
  // };

  // const handleSaveData = async () => {
  //   console.log('this');
  //   console.log(excelData);
  //   try {
  //     // Make a POST request to the API endpoint for inserting previewed data
  //     const response = await fetch(variables.API_URL + 'Employee/insertPreviewData', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(excelData), // Convert excelData to JSON string
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to save data');
  //     }

  //     const data = await response.json();
  //     console.log(data); // Log the response from the API
  //     alert('Data has been successfully  uploaded!')
  //   } catch (error) {
  //     console.error('Error occurred while saving data:', error);
  //     alert('Error occurred while saving data. Please try again later.');
  //   }
  // };

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
                      <ul className="nav nav-tabs">
                        <li className="nav-item">
                          <a
                            className={`nav-link ${
                              activeTab === "upload" ? "active" : ""
                            }`}
                            id="upload-tab"
                            data-toggle="tab"
                            href="#uploadForm"
                            role="tab"
                            aria-controls="uploadForm"
                            aria-selected={activeTab === "upload"}
                          >
                            Upload
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className={`nav-link ${
                              activeTab === "preview" ? "active" : ""
                            }`}
                            id="reports-tab"
                            data-toggle="tab"
                            href="#newHireReports"
                            role="tab"
                            aria-controls="newHireReports"
                            aria-selected={activeTab === "preview"}
                          >
                            Preview
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="card-body">
                      <div className="tab-content">
                        <div
                          className={`tab-pane fade ${
                            activeTab === "upload" ? "show active" : ""
                          }`}
                          id="uploadForm"
                          role="tabpanel"
                          aria-labelledby="upload-tab"
                        >
                          <div className="card-body">
                            <div className="d-flex justify-content-center">
                              <form
                                className="user"
                                encType="multipart/form-data"
                              >
                                <div className="form-group">
                                  <input
                                    type="file"
                                    className="form-control-file"
                                    aria-describedby="fileHelp"
                                    onChange={handleFileChange}
                                  />
                                  <small
                                    id="fileHelp"
                                    className="form-text text-muted"
                                  >
                                    Choose a file to upload.
                                  </small>
                                </div>
                                <div className="text-center">
                                  <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="btn btn-primary btn-user btn-block col-md-6"
                                  >
                                    Upload File
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`tab-pane fade ${
                            activeTab === "preview" ? "show active" : ""
                          }`}
                          id="newHireReports"
                          role="tabpanel"
                          aria-labelledby="reports-tab"
                        >
                          <div className="card-body">
                            <div className="table-responsive">
                              {showPreview && excelData.length > 0 ? (
                                <div>
                                  <h5 className="mb-3 font-weight-bold">
                                    Preview of the Uploaded Data
                                  </h5>
                                  <table className="table table-bordered table-hover">
                                    {/* Table Headers */}
                                    <thead>
                                      <tr>
                                        <th>ACTION</th>
                                        {Object.keys(excelData[0]).map(
                                          (header) => (
                                            <th key={header}>{header}</th>
                                          )
                                        )}
                                      </tr>
                                    </thead>
                                    {/* Table Body */}
                                    <tbody>
                                      {excelData.map((row, index) => (
                                        <tr key={index}>
                                          <td>
                                            <button
                                              className="update-button btn btn-xs"
                                              onClick={() =>
                                                handleEditClick(row)
                                              }
                                            >
                                              <i className="fas fa-pencil-alt"></i>
                                            </button>
                                          </td>
                                          {/* Table Data */}
                                          {Object.keys(row).map((key) => (
                                            <td key={key}>
                                              {/* Convert birthdate if necessary */}
                                              {key
                                                .toLowerCase()
                                                .replace(/\s/g, "")
                                                .includes("birthdate")
                                                ? convertExcelDateToDate(
                                                    row[key]
                                                  )
                                                : row[key]}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                  {/* Submit Data Button */}
                                  <div className="text-center mt-3">
                                    <button
                                      className="btn btn-success mr-2"
                                      onClick={handleSaveData}
                                    >
                                      Submit Data
                                    </button>
                                  </div>
                                  <br />
                                </div>
                              ) : (
                                // Render message when no uploaded data
                                <div className="text-center">
                                  Upload new file to preview data
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
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

      {/* Edit Modal */}
      <Modal
        show={editModalShow}
        onHide={handleCloseEditModal}
        dialogClassName="custom-modal"
      >
        <Modal.Header>
          <Modal.Title>Update employee information</Modal.Title>
          <Button variant="default" onClick={handleCloseEditModal}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          {editRowData && (
            <div>
              <Row>
                {Object.keys(editRowData).map((key) => (
                  <Col key={key} md={4}>
                    <div className="form-group">
                      <label>{key}</label>
                      <input
                        type="text"
                        className={`form-control auto-width-input`}
                        name={key}
                        value={editedData[key] || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NewHireUpload;
