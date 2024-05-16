import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import TopNavbar from './topnavbar';
import Footer from './footer';
import '../App.css';
import { Modal, Button } from 'react-bootstrap';
import jsPDF from "jspdf";
import 'jspdf-autotable';

 function UpdateEmployeeInfo() {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
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
    ContactNumber: '',
    EmailAddress: '',
    is_Active: false,
    IsActive: false,
    Is_Active: false,
    IsDUHead: false, 
    IsEmergency:false,
    IsIndividualContributor: false,
    IsManager: false,
    IsPMPIC: false,
    IsPermanent: false,
    Is_Emergency: false,
    Is_Permanent: false,
    ProfilePhoto: "/img/user.png",
    EmploymentStatus: '0'
  });
  const [initialEmployeeData, setInitialEmployeeData] = useState({});
  const [dependents, setDependents] = useState([]);
  const [selectedDependent, setSelectedDependent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDependents, setFilteredDependents] = useState([]);
  const educationRef = useRef(null);

    // Function to handle input change in the search field
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };
  
    // Effect to filter dependents based on search query
    useEffect(() => {
      const filtered = dependents.filter((dependent) =>
        dependent.FullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDependents(filtered);
    }, [searchQuery, dependents]);
    
 // Define the fetchDependents function
 const fetchDependents = async () => {
  try {
    const response = await fetch(`http://localhost:5000/retrieve/dependents/${employeeId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch dependents');
    }
    const data = await response.json();
    setDependents(data);
  } catch (error) {
    console.error('Error fetching dependents:', error);
  }
};

// Call fetchDependents whenever employeeId changes
useEffect(() => {
  fetchDependents();
  fetchEmployeeData();
}, [employeeId]);

// Function to format date as 'MM/DD/YYYY'
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${month}/${day}/${year}`;
};
  // Function to reset form data
  const resetFormData = () => {
    setEmployeeData({
      FullName: '',
      PhoneNum: '',
      Relationship: '',
      DateOfBirth: '',
      Occupation: '',
      Address: '',
      City: '',
      DepProvince: '',
      PostalCode: '',
      Beneficiary: '',
      BeneficiaryDate: '',
      TypeOfCoverage: '',
      Insurance: '',
      InsuranceDate: '',
      Remarks: '',
      CompanyPaid: '',
      HMOProvider: '',
      HMOPolicyNumber: ''
    });
  };
  //Function to handle opening add modal for new dependent records
const handleShowAddModal = () => {
  resetFormData(); // Clear form data
  setShowAddModal(true);
};
//Function to handle closing add modal for new dependent records
const handleCloseAddModal = () => {
  setShowAddModal(false);
};
  // Function to handle opening edit modal and set selected dependent
  const handleShowEditModal = (dependent) => {
    // setShowEditModal(true);
    setSelectedDependent(dependent);
  };
  // Function to handle closing edit modal
  const handleCloseEditModal = () => {
    // setShowEditModal(false);
    setSelectedDependent(null);
  };
//FETCHING ALL EMPLOYEE DATA EXCLUDING THE DEPENDENT RECORDS BASED ON EMPLOYEE ID
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
      data.DateFrom = formatDate(data.DateFrom);
      data.DateTo = formatDate(data.DateFrom);
      data.DateOfBirth = formatDate(data.DateOfBirth);

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
//HANDLES INPUT TO UPDATE DATA
const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    
    // Convert specific fields to booleans if necessary
    switch (name) {
      case 'is_Active':
      case 'IsActive':
      case 'Is_Active':
      case 'IsDUHead':
      case 'IsEmergency':
      case 'IsIndividualContributor':
      case 'IsManager':
      case 'IsPMPIC':
      case 'IsPermanent':
      case 'Is_Emergency':
      case 'Is_Permanent':
        newValue = value === 'true';
        break;
      default:
        break;
    }
  
    setEmployeeData({
      ...employeeData,
      [name]: newValue
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

    // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
    const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));

    // Generate success message based on updated fields
    let successMessage;
    if (filteredFields.length === 0) {
      successMessage = `No employee personal details has been updated for ${employeeName}.`;
    } else {
      successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
    }

  
      // Display the success message
      alert(successMessage);

       // Reload the page after showing the alert
       window.location.reload();
  
      } catch (error) {
        console.error('Error updating employee personal details:', error);
        // Send alert message for failure
        alert('Failed to update employee personal details. Please try again later.');
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

    // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
    const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));

    // Generate success message based on updated fields
    let successMessage;
    if (filteredFields.length === 0) {
      successMessage = `No employee information has been updated for ${employeeName}.`;
    } else {
      successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
    }
  
      // Display the success message
      alert(successMessage);

       // Reload the page after showing the alert
       window.location.reload();

      } catch (error) {
        console.error('Error updating employee information:', error);
        // Send alert message for failure
        alert('Failed to update employee information. Please try again later.');
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
 
     // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
     const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));
 
     // Generate success message based on updated fields
     let successMessage;
     if (filteredFields.length === 0) {
       successMessage = `No address details has been updated for ${employeeName}.`;
     } else {
       successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
     }
 
  
      // Display the success message
      alert(successMessage);

       // Reload the page after showing the alert
       window.location.reload();
       // Navigate to report.js
    //    navigate("/reports");
  
        } catch (error) {
        console.error('Error updating employee address:', error);
        }
    };
    //UPDATE PROJECT DETAILS
  const handleProjectFormSubmit = async (e) => {
    e.preventDefault();
    console.log(employeeData);
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

    // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
    const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));

    // Generate success message based on updated fields
    let successMessage;
    if (filteredFields.length === 0) {
      successMessage = `No project details has been updated for ${employeeName}.`;
    } else {
      successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
    }

  
      // Display the success message
      alert(successMessage);

       // Reload the tab
       window.location.reload();
  
      // Navigate to report.js
    //   navigate("/reports");
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };
     //UPDATE EMPLOYEE EDUCATION DETAILS
     const handleEducationFormSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(`http://localhost:5000/updateEmployeeEducation/${employeeId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeData)
          });
          if (!response.ok) {
            throw new Error('Failed to update education details');
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

    // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
    const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));

    // Generate success message based on updated fields
    let successMessage;
    if (filteredFields.length === 0) {
      successMessage = `No education details has been updated for ${employeeName}.`;
    } else {
      successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
    }

          // Display the success message
          alert(successMessage);
      
        //   // Navigate to report.js
        //   navigate("/reports");
         // Reload the page after showing the alert
        window.location.reload();

        } catch (error) {
          console.error('Error updating employee:', error);
        }
      };
        //UPDATE SHIFT DETAILS
  const handleShiftFormSubmit = async (e) => {
    e.preventDefault();
    console.log(employeeData);
    try {
      const response = await fetch(`http://localhost:5000/updateShift/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
      });
      if (!response.ok) {
        throw new Error('Failed to update shift details');
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

    // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
    const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));

    // Generate success message based on updated fields
    let successMessage;
    if (filteredFields.length === 0) {
      successMessage = `No shift details has been updated for ${employeeName}.`;
    } else {
      successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
    }

  
      // Display the success message
      alert(successMessage);

       // Reload the tab
       window.location.reload();
  
      } catch (error) {
        console.error('Error updating shift unit details:', error);
        // Send alert message for failure
        alert('Failed to update shift unit details. Please try again later.');
      }
  };
        //UPDATE DELIVERY UNIT 
        const handleDUFormSubmit = async (e) => {
            e.preventDefault();
            console.log(employeeData);
            try {
              const response = await fetch(`http://localhost:5000/updateDU/${employeeId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
              });
              if (!response.ok) {
                throw new Error('Failed to update delivery unit details');
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
        
            // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
            const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));
        
            // Generate success message based on updated fields
            let successMessage;
            if (filteredFields.length === 0) {
              successMessage = `No delivery unit details has been updated for ${employeeName}.`;
            } else {
              successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
            }
        
          
              // Display the success message
              alert(successMessage);
        
               // Reload the tab
               window.location.reload();
          
              } catch (error) {
                console.error('Error updating delivery unit details:', error);
                // Send alert message for failure
                alert('Failed to update delivery unit details. Please try again later.');
              }
          };
        //UPDATE DEPARTMENT DETAILS
        const handleDepartmentFormSubmit = async (e) => {
            e.preventDefault();
            console.log(employeeData);
            try {
              const response = await fetch(`http://localhost:5000/updateDepartment/${employeeId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
              });
              if (!response.ok) {
                throw new Error('Failed to update employee department details');
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
        
            // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
            const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));
        
            // Generate success message based on updated fields
            let successMessage;
            if (filteredFields.length === 0) {
              successMessage = `No department details has been updated for ${employeeName}.`;
            } else {
              successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
            }
        
          
              // Display the success message
              alert(successMessage);
        
               // Reload the tab
               window.location.reload();
          
              } catch (error) {
                console.error('Error updating department details:', error);
                // Send alert message for failure
                alert('Failed to update department details. Please try again later.');
              }
          }; 
  // Function to handle dependent form submission for update
  const handleDependentFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDependent || !selectedDependent.DependentID) return;
      console.log(selectedDependent);
    try {
      const response = await fetch(`http://localhost:5000/updateDependent/${selectedDependent.DependentID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedDependent) // Send updated dependent data
      });

      if (!response.ok) {
        throw new Error('Failed to update dependent details');
      }

      const data = await response.json();
      alert(data.message); // Display success message from backend
      handleCloseEditModal(); // Close modal after successful update
      fetchDependents(); // Refresh dependents data after update

    } catch (error) {
      console.error('Error updating dependent details:', error);
      alert('Failed to update dependent details. Please try again later.');
    }
  };
              //ADD DEPENDENT DETAILS       
  const handleAddDependent = async (e) => {
    e.preventDefault();

    try {
      console.log(employeeData);
      const response = await fetch(`http://localhost:5000/addDependent/${employeeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
      });

      if (!response.ok) {
        throw new Error('Failed to add dependent details');
      }

      const data = await response.json();
      alert(data.message); // Display success message from backend
      handleCloseAddModal(); // Close modal after successful addition

       // Fetch updated dependents data after adding a new dependent
    fetchDependents(); 

     // Refresh employee data after successful addition
     fetchEmployeeData();

    } catch (error) {
      console.error('Error adding dependent:', error);
      alert('Failed to add dependent. Please try again.');
    }
  };
           //UPDATE PRODUCT DETAILS
        const handleProductFormSubmit = async (e) => {
            e.preventDefault();
            console.log(employeeData);
            try {
              const response = await fetch(`http://localhost:5000/updateProduct/${employeeId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
              });
              if (!response.ok) {
                throw new Error('Failed to update product details');
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
        
            // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
            const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));
        
            // Generate success message based on updated fields
            let successMessage;
            if (filteredFields.length === 0) {
              successMessage = `No product details has been updated for ${employeeName}.`;
            } else {
              successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
            }
        
          
              // Display the success message
              alert(successMessage);

              // Reload the page after showing the alert
                window.location.reload();
              } catch (error) {
                console.error('Error updating product details:', error);
                // Send alert message for failure
                alert('Failed to update product details. Please try again later.');
              }
          };
  //UPDATE EMERGENCY CONTACT DETAILS
  const handleECFormSubmit = async (e) => {
    e.preventDefault();
    try {
      //to be removed
      console.log(this);
  // console.log(employeeData.AddressID);

      const response = await fetch(`http://localhost:5000/updateEmerContact/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
      });
      if (!response.ok) {
        throw new Error('Failed to update employee emergency contact');
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
  
      // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
      const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));
  
      // Generate success message based on updated fields
      let successMessage;
      if (filteredFields.length === 0) {
        successMessage = `No employee emergency contact details have been updated for ${employeeName}.`;
      } else {
        successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
      }
  
      // Display the success message
      alert(successMessage);
  
      // Reload the page after showing the alert
      window.location.reload();
    } catch (error) {
      console.error('Error updating employee emergency contact:', error);
      // Send alert message for failure
      alert('Failed to update employee emergency contact. Please try again later.');
    }
  };
  // const handleViewDetails = (employeeData) => {
  //   setSelectedEmployee(employeeData);
  //   setIsModalOpen(true);
  // };

  // const handleView = (employeeData) => {
  //   navigate(`/employeeProfile`, { state: { employeeData } });
  // };
    // Handle navigation to employee profile page with employeeData and dependents
    const handleView = () => {
      navigate('/employeeProfile', { state: { employeeData, dependents } });
    };

  //handles the download of pdf file
  const handleDownloadPDF = () => {
    if (!employeeData) return;
  
    const doc = new jsPDF();
    let y = 20;
  
    // Calculate the x position for Employee ID and Name
      const infoX = 70; // X position for Employee ID and Name

      // Add profile photo
      const profilePhotoBase64 = employeeData.ProfilePhoto || '/img/user.png';
      doc.addImage(profilePhotoBase64, 'JPEG', 20, y, 35, 35);

      // Add Employee ID next to profile image
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Employee Id:", infoX, y + 10);
      doc.setFont("helvetica", "normal");
      doc.text(Array.isArray(employeeData.EmployeeId) ? employeeData.EmployeeId[0] : employeeData.EmployeeId.toString(), infoX + 40, y + 10, { maxWidth: 80 });

      // Add Name next to Employee ID
      doc.setFont("helvetica", "bold");
      doc.text("Name:", infoX, y + 20);
      doc.setFont("helvetica", "normal");
      doc.text(employeeData.EmployeeName, infoX + 40, y + 20, { maxWidth: 80 });

      y += 50; // Move down after the profile section and employee info
  
      // Function to add section header
      const addSectionHeader = (doc, text, y) => {
      doc.setFillColor(65, 105, 225); // Background color (royal blue)
      doc.setTextColor(255); // White text color
      doc.setFontSize(14);
  
      const rectWidth = 190; // Width of the rectangle
      const textWidth = doc.getTextWidth(text); // Calculate text width
      const xPosition = (rectWidth - textWidth) / 2 + 4; // Calculate x-coordinate to center the text within the rectangle
  
      doc.rect(4, y - 10, rectWidth, 12, "F"); // Draw a filled rectangle for the background
      doc.text(text, xPosition, y); // Centered text
      y += 20;
      return y;
    };
  
    // Personal Details Section
    y = addSectionHeader(doc, "PERSONAL DETAILS", y);

    // Function to add detail fields with auto-adjustment
      // Function to add detail fields with auto-adjustment
  const addDetailFields = (doc, details, y) => {
    doc.setFontSize(11);
    doc.setTextColor(0);
    const columnWidth = 90; // Width for each column
    const lineHeight = 6; // Line height

    for (let i = 0; i < details.length; i += 2) {
      const detail1 = details[i];
      const detail2 = details[i + 1];

      // Function to split text into lines based on maxWidth
      const splitTextToLines = (text, maxWidth) => {
        return doc.splitTextToSize(text.toString(), maxWidth);
      };

      // Calculate label and value lines for both details
      const label1Lines = splitTextToLines(detail1.label, columnWidth);
      const value1Lines = splitTextToLines(detail1.value.toString(), columnWidth);
      const label2Lines = detail2 ? splitTextToLines(detail2.label, columnWidth) : [];
      const value2Lines = detail2 ? splitTextToLines(detail2.value.toString(), columnWidth) : [];

      // Determine maximum line count for this detail set
      const maxLines = Math.max(label1Lines.length, value1Lines.length, label2Lines.length, value2Lines.length);
      const totalHeight = maxLines * lineHeight;

      // Check remaining space on the current page
      const pageHeight = doc.internal.pageSize.height;
      const remainingSpace = pageHeight - y;

      if (remainingSpace < totalHeight) {
        // Add a new page if remaining space is insufficient
        doc.addPage();
        y = 20; // Reset y position for the new page
      }

      // Adjust y position to fill the remaining space on the page
      if (y + totalHeight > pageHeight) {
        y = 20; // Reset y position if the content exceeds the page height
      }

      // Render label and value pairs in two columns
      doc.setFont("helvetica", "bold");
      for (let j = 0; j < maxLines; j++) {
        if (label1Lines[j]) {
          doc.text(label1Lines[j], 20, y + j * lineHeight);
        }
        if (label2Lines[j]) {
          doc.text(label2Lines[j], 120, y + j * lineHeight);
        }
      }

      doc.setFont("helvetica", "normal");
      for (let j = 0; j < maxLines; j++) {
        if (value1Lines[j]) {
          doc.text(value1Lines[j], 20, y + maxLines * lineHeight + j * lineHeight);
        }
        if (value2Lines[j]) {
          doc.text(value2Lines[j], 120, y + maxLines * lineHeight + j * lineHeight);
        }
      }

      // Move y position to the end of this detail set
      y += totalHeight + 10; // Add spacing between detail sets
    }

    return y;
  };

  
  //Persona Details Section
  const personalDetails = [
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
  
    y = addDetailFields(doc, personalDetails, y);
  
    // Adding a new page for address details form
    doc.addPage();
    y = 20;
            //Address Section
            y = addSectionHeader(doc, "ADDRESS", y);

            //Address Details Fields
            const addressDetails = [
            { label: "House Number:", value: employeeData.HouseNumber },
            { label: "Complete Address:", value: employeeData.CompleteAddress },
            { label: "Barangay:", value: employeeData.Barangay },
            { label: "City / Municipality:", value: employeeData.CityMunicipality },
            { label: "Province:", value: employeeData.Province },
            { label: "Region:", value: employeeData.Region },
            { label: "Country:", value: employeeData.Country },
            { label: "Zip Code:", value: employeeData.ZipCode },
            { label: "Landmark:", value: employeeData.Landmark },
            { label: "Is Permanent:", value: employeeData.IsPermanent ? 'Yes' :'No' },
            { label: "Is Emergency:", value: employeeData.IsEmergency ? 'Yes' : 'No' },
            ];
        
            y = addDetailFields(doc, addressDetails, y);
        
            // Adding a new page for employee information form
            doc.addPage();
            y = 20;

    //Education Section
    y = addSectionHeader(doc, "EDUCATION", y);

    //Address Details Fields
    const educationDetails = [
    { label: "School:", value: employeeData.School },
    { label: "Education Level:", value: employeeData.EducationLevel},
    { label: "Degree:", value: employeeData.Degree },
    { label: "Major Course:", value: employeeData.MajorCourse },
    { label: "Honor Rank:", value: employeeData.HonorRank },
    { label: "Units Earned:", value: employeeData.UnitsEarned},
    { label: "Session:", value: employeeData.Session},
    { label: "Date From:", value: employeeData.DateFrom},
    { label: "Date To:", value: employeeData.DateTo},
    { label: "Month Completed:", value: employeeData.MonthCompleted},
    { label: "Completed:", value: employeeData.Completed},
    ];

    y = addDetailFields(doc, educationDetails, y);

    // Adding a new page for education form
    doc.addPage();
    y = 20;

    // Employee Information Section
    y = addSectionHeader(doc, "EMPLOYMENT INFORMATION", y);
  
    // Employee Information Fields
    const employeInfo = [
      { label: "HRAN ID:", value: employeeData.HRANID },
      { label: "Date Hired:", value: employeeData.DateHired },
      { label: "Tenure:", value: employeeData.Tenure },
      { label: "Employee Level:", value: employeeData.EmployeeLevel },
      { label: "Project Code:", value: employeeData.ProjectCode },
      { label: "Project Name:", value: employeeData.ProjectName },
      { label: "Designation:", value: employeeData.Designation },
      { label: "Department:", value: employeeData.DepartmentName },
      { label: "Product Code:", value: employeeData.ProdCode },
      { label: "Product Description:", value: employeeData.ProdDesc },
      { label: "Employment Status:", value: employeeData.EmploymentStatus },
      { label: "Employee Status:", value: employeeData.EmployeeStatus },
      { label: "Work Week Type:", value: employeeData.WorkWeekType },
      { label: "Shift:", value: employeeData.ShiftName },
      { label: "Work Arrangement:", value: employeeData.WorkArrangement },
      { label: "Rate Class:", value: employeeData.RateClass },
      { label: "Rate:", value: employeeData.Rate },
      { label: "Manager ID:", value: employeeData.ManagerID },
      { label: "Manager Name:", value: employeeData.ManagerName },
      { label: "PMPICID:", value: employeeData.PMPICID },
      { label: "PMPICID Name:", value: employeeData.PMPICIDName },
      { label: "Delivery Unit:", value: employeeData.DUName },
      { label: "DUHID:", value: employeeData.DUHID },
      { label: "DUH Name:", value: employeeData.DUHName },
      { label: "Is Manager:", value: employeeData.IsManager ? 'Yes' : 'No' },
      { label: "Is PMPIC:", value: employeeData.IsPMPIC ? 'Yes' : 'No' },
      { label: "Is Individual Contributor:", value: employeeData.IsIndividualContributor ? 'Yes' : 'No' },
      { label: "Is Active:", value: employeeData.IsActive ? 'Yes' : 'No' },
      { label: "Is DU Head:", value: employeeData.IsDUHead ? 'Yes' : 'No' },
      { label: "HRAN Type:", value: employeeData.HRANType },
      { label: "TITO Type:", value: employeeData.TITOType },
      { label: "Position:", value: employeeData.Position },
      { label: "Position Level:", value: employeeData.PositionLevel },
    ];
  
    y = addDetailFields(doc, employeInfo, y);

    doc.save("employee_report.pdf");
  };
    // Define a function to determine the color based on EmployeeStatus value
    const getStatusColor = (status) => {
      switch (status) {
        case '0': // Active
          return 'green';
        case '1': // Separated
          return 'red';
        case '2': // Inactive - Maternity
        case '3': // Inactive - Sickness
        case '4': // Inactive - Absent with leave
        case '5': // Inactive - Absent Without Leave
        case '6': // Inactive - Suspension
          return 'gray';
        default:
          return 'black'; // Default color
      }
    };
  
    const statusColor = getStatusColor(employeeData.EmployeeStatus);
  
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
              <button
                className="seeProfile btn btn-xs mr-2"
                onClick={handleView} >
                <i className="fas fa-eye"></i> See Profile
               </button>
                    {/* <div className="d-flex align-items-center"> */}
                    <button
                        className="update-button btn btn-xs"
                        onClick={handleDownloadPDF}
                      >
                        <i className="fas fa-arrow-down"></i> Download Record
                      </button>

                        {/* <Button variant="primary" onClick={handleDownloadPDF}>
                        <i className="fas fa-arrow-down"></i> Download Record
          </Button> */}
                    {/* </div> */}
                    </div>
                {/* <div className='card-body'>
                <button
                                      className="seeProfile btn btn-xs mr-2"
                                      onClick={handleView}
                                    >
                                      <i className="fas fa-eye"></i> See Profile
                                    </button> */}
              {/* <button
                                      className="btn btn-xs btn-primary "
                                      onClick={() =>
                                        handleViewDetails(employeeData)
                                      }
                                    >
                                      <i className="far fa-eye"></i> View Profile
                                    </button> */}
                                    {/* </div> */}
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <ul className="nav nav-tabs nav-fill">
                      <li className="nav-item">
                          <a className="nav-link active " id="personalDetails-tab" data-toggle="tab" href="#personalDetails" role="tab" aria-controls="personalDetails" aria-selected="false">Employee Personal Details</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link" id="employmentInfo-tab" data-toggle="tab" href="#employmentInfo" role="tab" aria-controls="employmentInfo" aria-selected="false">Employment Information</a>
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
                            {/* <div className='card-body' id="employee-details-form" ref={personalDetailsRef}> */}
                            <div className='card-body'>
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
                                            <input type="text" className="form-control" value={employeeData.EmailAddress} placeholder="enter email address" onChange={handleInputChange} name="EmailAddress" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="name">Full Name</label>
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
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Save Changes</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="employmentInfo" role="tabpanel" aria-labelledby="employmentInfo-tab">
                          {/* Employment Information Form */}
                          <div className="container">
                            <form onSubmit={handleFormEmpInfoSubmit}>
                            <div className='card-body'>
                              <h5 className='text-primary'>Section 1</h5>
                                <hr className="hr-cobalt-blue"/>
                                <br/>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="EmpID">Employee Id</label>
                                              <span className="form-control">{Array.isArray(employeeData.EmployeeId) ? employeeData.EmployeeId[0] : employeeData.EmployeeId}</span>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="tenure">Tenure</label>
                                            <input type="text" className="form-control" value={employeeData.Tenure} onChange={handleInputChange} name="Tenure"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="dateHired">Date Hired</label>
                                            <input type="text" className="form-control" value={employeeData.DateHired} placeholder="Date Hired" name="DateHired" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    {/* <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="hranId">HRAN ID</label>
                                            <input type="text" className="form-control" value={employeeData.HRANID} placeholder="enter HRANID" name="HRANID" onChange={handleInputChange}/>
                                        </div>
                                    </div> */}
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="empLevel">Employee Level</label>
                                            <input type="text" className="form-control" value={employeeData.EmployeeLevel} placeholder="enter employee Level" name="EmployeeLevel" onChange={handleInputChange} />
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
                                            <label htmlFor="empLevel">Associate</label>
                                            <input type="text" className="form-control" value={employeeData.Associate} placeholder="enter Associate" name="Associate" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                        <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="empStatus">Employee Status</label>
                                                    <select
                                                      value={employeeData.EmployeeStatus}
                                                      name="EmployeeStatus"
                                                      onChange={handleInputChange}
                                                      style={{ color: statusColor }} 
                                                      className='form-control'
                                                    >
                                                    {/* <select value={employeeData.EmployeeStatus} name="EmployeeStatus" onChange={handleInputChange}> */}
                                                        <option value="0">Active</option>
                                                        <option value="1">Separated</option>
                                                        <option value="2">Inactive - Maternity</option>
                                                        <option value="3">Inactive - Sickness</option>
                                                        <option value="4">Inactive - Absent with leave</option>
                                                        <option value="5">Inactive - Absent Without Leave</option>
                                                        <option value="6">Inactive - Suspension</option>
                                                    </select>
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
                                              <label >Employment Status</label>
                                              <select className= 'form-control' 
                                                    value={employeeData.EmploymentStatus} name="EmploymentStatus" onChange={handleInputChange}>
                                                        <option value="0">Probationary</option>
                                                        <option value="1">Permanent</option>
                                                        <option value="2">Project</option>
                                                        <option value="3">Fixed Term</option>
                                                    </select>
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                        <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="Role">Role</label>
                                                    <select className= 'form-control' 
                                                    value={employeeData.Role} name="Role" onChange={handleInputChange}>
                                                        <option value="0">Individual Contributor</option>
                                                        <option value="1">People Manager</option>
                                                    </select>
                                                </div>
                                        </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="Rate"> Rate</label>
                                              <input type="text" className="form-control" value={employeeData.Rate} placeholder="enter rate" name="Rate" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label >Rate Class</label>
                                              <select className= 'form-control' 
                                                    value={employeeData.RateClass} name="RateClass" onChange={handleInputChange}>
                                                        <option value="0">Daily</option>
                                                        <option value="1">Monthly</option>
                                                    </select>
                                              </div>
                                            </div>
                                </div>
                                <hr/>
                                  <h5 className='text-primary'>Section 2</h5>
                                  <hr className="hr-cobalt-blue"/>
                                <br/>
                                <div className="row ">
                                            <div className="col-md-6">
                                              <div className="form-group">
                                              <label htmlFor="shiftname">Shift</label>
                                              <input type="text" className="form-control" value={employeeData.ShiftName} name="ShiftName" />     
                                              </div>
                                            </div>
                                            <div className="col-md-6">
                                              <div className="form-group">
                                              <label htmlFor="shifttype">Shift Type</label>
                                              <input type="text" className="form-control" value={employeeData.ShiftType} name="ShiftType" />     
                                              </div>
                                            </div>
                                </div>
                                <div className="row ">
                                            <div className="col-md-6">
                                              <div className="form-group">
                                              <label htmlFor="workWeekType"> Work week type</label>
                                              <input type="text" className="form-control" value={employeeData.WorkWeekType} placeholder="enter work Week Type" name="WorkWeekType" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-6">
                                              <div className="form-group">
                                              <label htmlFor="workArrangement">Work Arrangement</label>
                                              <input type="text" className="form-control" value={employeeData.WorkArrangement} placeholder="enter work arrangement" name="WorkArrangement" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            
                                </div>
                                <hr/>
                                  <h5 className='text-primary'>Section 3</h5>
                                  <hr className="hr-cobalt-blue"/>
                                <br/>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="managerId">Manager Id</label>
                                              <input type="text" className="form-control" value={employeeData.ManagerID} placeholder="enter manager Id" name="ManagerId" onChange={handleInputChange} />     
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
                                              <label htmlFor="pmpicid">PM/PIC ID</label>
                                              <input type="text" className="form-control" value={employeeData.PMPICID} placeholder="enter pmpicid" name="Pmpicid" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="pmpicIdName">PM/PIC Name</label>
                                              <input type="text" className="form-control" value={employeeData.PMPICIDName} placeholder="enter PMPICID Name" name="PmpicIdName" onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="duhid">Delivery Unit Head ID</label>
                                              <input type="text" className="form-control" value={employeeData.DUHID} placeholder="enter duhid" name="Duhid" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="du">Delivery Unit Head Name</label>
                                              <input type="text" className="form-control" value={employeeData.DUHName} placeholder="enter DUH Name" name="DuhName" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="duName">Delivery Unit</label>
                                              <input type="text" className="form-control" value={employeeData.DUName} name="DeliveryUnit" />
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
                                              <label htmlFor="productCode">Product Code</label>
                                              <input type="text" className="form-control" value={employeeData.ProdCode} name="ProductCode"  />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="prodDesc"> Product Description</label>
                                              <input type="text" className="form-control" value={employeeData.ProdDesc} name="ProdDesc" />      
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="department">Department</label>
                                              <input type="text" className="form-control" value={employeeData.DepartmentName} name="Department" />
                                              </div>
                                            </div>
                                   </div>
                                   <hr/>
                                  <h5 className='text-primary'>Section 4</h5>
                                  <hr className="hr-cobalt-blue"/>
                                <br/>
                                <div className="row justify-content-center">
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="HRANType">HRAN Type</label>
                                              <input type="text" className="form-control" value={employeeData.HRANType} placeholder="enter HRAN Type" name="HRANTYPE" onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isManager">Is Manager</label>
                                              <select className="form-control" value={employeeData.IsManager} name="IsManager" onChange={handleInputChange}>
                                                        <option value={true}>Yes</option>
                                                        <option value={false}>No</option>
                                                    </select>
                                              </div>
                                            </div>
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isPmpic">Is PMPIC</label>
                                              <select className="form-control" value={employeeData.IsPMPIC} name="IsPMPIC" onChange={handleInputChange}>
                                                        <option value={true}>Yes</option>
                                                        <option value={false}>No</option>
                                                    </select>
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isIndContributor">Is Individual Contributor</label>
                                              <select className="form-control" value={employeeData.IsIndividualContributor} name="IsIndividualContributor" onChange={handleInputChange}>
                                                        <option value={true}>Yes</option>
                                                        <option value={false}>No</option>
                                                    </select>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isActive">Is Active</label>
                                              <select className="form-control" value={employeeData.IsActive} name="IsActive" onChange={handleInputChange}>
                                                        <option value={true}>Yes</option>
                                                        <option value={false}>No</option>
                                                    </select>
                                              </div>
                                            </div>
                                              <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="isDuHead">Is DU Head</label>
                                                    <select className="form-control" value={employeeData.IsDUHead} name="IsDUHead" onChange={handleInputChange}>
                                                        <option value={true}>Yes</option>
                                                        <option value={false}>No</option>
                                                    </select>
                                                </div>
                                     </div>
                                </div> 
                                <div className="row justify-content-center">
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="titoType">TITO Type</label>
                                              <input type="text" className="form-control" value={employeeData.TITOType} placeholder="enter tito type" name="TitoType" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="position">Position</label>
                                              {/* <input type="text" className="form-control" value={employeeData.Position} placeholder="enter tito type" name="TitoType" onChange={handleInputChange} /> */}
                                              <select className='form-control' 
                                                      value={employeeData.Position} 
                                                      name="Position" 
                                                      onChange={handleInputChange}>
                                                  <option value="Associate">Associate</option>
                                                  <option value="Lead Associate">Lead Associate</option>
                                                  <option value="VP-Country Head, Philippines">VP-Country Head, Philippines</option>
                                                  <option value="Sr. Associate">Sr. Associate</option>
                                                  <option value="Group Manager-HR">Group Manager-HR</option>
                                                  <option value="Senior Software Engineer">Senior Software Engineer</option>
                                                  <option value="Junior Specialist">Junior Specialist</option>
                                                  <option value="Indexer/ Abstractor">Indexer/ Abstractor</option>
                                                  <option value="Production Associate">Production Associate</option>
                                                  <option value="Team Manager">Team Manager</option>
                                                  <option value="Indexer">Indexer</option>
                                                  <option value="Senior Project Coordinator">Senior Project Coordinator</option>
                                                  <option value="Solutions Architect">Solutions Architect</option>
                                                  <option value="Software Engineer - Level 2">Software Engineer - Level 2</option>
                                                  <option value="Project Manager">Project Manager</option>
                                                  <option value="Jr. Specialist">Jr. Specialist</option>
                                                  <option value="Sr. Software Engineer">Sr. Software Engineer</option>
                                                  <option value="Project Support - Level 1">Project Support - Level 1</option>
                                                  <option value="Group Manager - Training">Group Manager - Training</option>
                                                  <option value="Project Analyst">Project Analyst</option>
                                                  <option value="Specialist - Finance">Specialist - Finance</option>
                                                  <option value="Group Manager">Group Manager</option>
                                                  <option value="Software Engineer - Level 1">Software Engineer - Level 1</option>
                                                  <option value="Quality Assurance Analyst">Quality Assurance Analyst</option>
                                                  <option value="Senior Production Manager">Senior Production Manager</option>
                                                  <option value="Process Analyst">Process Analyst</option>
                                                  <option value="Team Manager - Finance">Team Manager - Finance</option>
                                                  <option value="Customer Service Account Executive">Customer Service Account Executive</option>
                                                  <option value="Specialist">Specialist</option>
                                                  <option value="Lead Associate - FIN">Lead Associate - FIN</option>
                                                  <option value="Sr. Specialist">Sr. Specialist</option>
                                                  <option value="Engineer">Engineer</option>
                                                  <option value="Content Manager">Content Manager</option>
                                                  <option value="Division Manager">Division Manager</option>
                                                  <option value="Project Support - Level 2">Project Support - Level 2</option>
                                                  <option value="Sr. Production Manager">Sr. Production Manager</option>
                                                  <option value="Senior Manager-Finance">Senior Manager-Finance</option>
                                                  <option value="Division Manager-HR">Division Manager-HR</option>
                                                  <option value="Team Manager - Finance">Team Manager - Finance</option>
                                                  <option value="Customer Service Account Executive">Customer Service Account Executive</option>
                                                  <option value="Admin Manager">Admin Manager</option>
                                                  <option value="Team Manager-Fac">Team Manager-Fac</option>
                                                  <option value="Head of Talent Acquisition, PH">Head of Talent Acquisition, PH</option>
                                                  <option value="VP-Delivery Unit Head, Project Delivery">VP-Delivery Unit Head, Project Delivery</option>
                                                  <option value="Senior Specialist">Senior Specialist</option>
                                                  <option value="Senior Manager-HR">Senior Manager-HR</option>
                                                  <option value="Senior Manager - Facilities Admin">Senior Manager - Facilities Admin</option>
                                                  <option value="Manager-Finance">Manager-Finance</option>
                                                  <option value="Sr. Administrator">Sr. Administrator</option>
                                                  <option value="Associate Vice President">Associate Vice President</option>
                                                  <option value="Division Manager-Finance">Division Manager-Finance</option>
                                                  <option value="Head of Infrastructure">Head of Infrastructure</option>
                                                  <option value="Senior Manager-QA">Senior Manager-QA</option>
                                                  <option value="Group Manager-Fac">Group Manager-Fac</option>
                                                  <option value="Head of Finance">Head of Finance</option>
                                                  <option value="Group Manager-QA">Group Manager-QA</option>
                                                  <option value="Executive-HR">Executive-HR</option>
                                                  <option value="Lead Specialist">Lead Specialist</option>
                                                  <option value="Lead Analyst">Lead Analyst</option>
                                                  <option value="Manager-HR">Manager-HR</option>
                                                  <option value="Executive HR - Learning and Culture Specialist">Executive HR - Learning and Culture Specialist</option>
                                                  <option value="Analyst - AI/LLM Practice">Analyst - AI/LLM Practice</option>
                                                  <option value="Trainer">Trainer</option>
                                                  <option value="Senior Analyst - AI/LLM Practice">Senior Analyst - AI/LLM Practice</option>
                                                  <option value="Editor-Analyst - AI/LLM Practice">Editor-Analyst - AI/LLM Practice</option>
                                                  <option value="Team Manager, Trainer">Team Manager, Trainer"</option>
                                                  <option value="Sr. Manager-FP&A">Sr. Manager-FP&A</option>
                                                  <option value="Admin Manager">Admin Manager</option>
                                                  <option value="Senior Manager-GT">Senior Manager-GT</option>
                                                  <option value="Head of Infrastructure - Data Center Support">Head of Infrastructure - Data Center Support</option>
                                                  <option value="AVP, Project Delivery">AVP, Project Delivery</option>
                                              </select>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="positionLevel">Position Level</label>
                                              <select className="form-control" value={employeeData.PositionLevel} name="PositionLevel" onChange={handleInputChange}>
                                                        <option value="Level 1">Level 1</option>
                                                        <option value="Level 2">Level 2</option>
                                                        <option value="Level 3">Level 3</option>
                                                        <option value="Level 4">Level 4</option>
                                                        <option value="Level 5">Level 5</option>
                                                        <option value="Level 6">Level 6</option>
                                                        <option value="Level 7">Level 7</option>
                                                        <option value="Level 8">Level 8</option>
                                                        <option value="Level 9">Level 9</option>
                                                        <option value="Level 10">Level 10</option>
                                                        <option value="Level 11">Level 11</option>
                                                        <option value="Level 12">Level 12</option>
                                                        <option value="Level 13">Level 13</option>
                                                    </select>
                                              </div>
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
                          <div className='card-body'>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Employee ID</label>
                                            <span className="form-control">{Array.isArray(employeeData.EmployeeId) ? employeeData.EmployeeId[0] : employeeData.EmployeeId}</span>
                                            {/* <input type="text" className="form-control" readOnly={true} value={Array.isArray(employeeData.EmployeeId) ? employeeData.EmployeeId[0] : employeeData.EmployeeId} name="EmpID" onChange={handleInputChange} />                                         */}
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
                                              <input type="text" className="form-control" placeholder="Enter Zip Code" name="ZipCode" value={employeeData.ZipCode} onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="landmark">Land Mark</label>
                                            <input type="text" className="form-control" placeholder="Enter Land Mark" name="Landmark" value={employeeData.Landmark} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="isPermanent">is Permanent</label>
                                            <select className="form-control" value={employeeData.IsPermanent} name="IsPermanent" onChange={handleInputChange}>
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isEmergency">is Emergency</label>
                                              <select className="form-control" value={employeeData.IsEmergency} name="IsEmergency" onChange={handleInputChange}>
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                              </div>
                                            </div>
                                </div>
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Save Changes</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="education" role="tabpanel" aria-labelledby="education-tab">
                          {/* Education Form */}
                          <div className="container">
                            <form onSubmit={handleEducationFormSubmit}>
                            <div className='card-body' ref={educationRef}>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                        <div className="form-group">
                                            <label> School </label>
                                            <input type="text" className="form-control" value={employeeData.School} placeholder="Enter School" name="School" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Education Level</label>
                                            <input type="text" className="form-control" value={employeeData.EducationLevel} placeholder="Enter Education Level" name="EducationLevel" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Degree</label>
                                            <input type="text" value={employeeData.Degree} className="form-control" placeholder="Enter Degree" name="Degree" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="majorCourse">Major course</label>
                                            <input type="text" className="form-control" value={employeeData.MajorCourse} placeholder="Enter Major Course" name="MajorCourse" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="honorRank">Honor Rank</label>
                                            <input type="text" className="form-control" value={employeeData.HonorRank} placeholder="Enter Honor Rank" name="HonorRank" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="session">Session</label>
                                              <input type="text" className="form-control" value={employeeData.Session} placeholder="Enter Session" name="Session" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="dateFrom">Date From</label>
                                            <input type="text" className="form-control" value={employeeData.DateFrom} placeholder="Enter date From" name="DateFrom" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                        <label htmlFor="dateTo">Date To</label>
                                            <input type="text" className="form-control" value={employeeData.DateTo} placeholder="Enter date To" name="DateTo" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="monthCompleted">Month Completed</label>
                                            <input type="text" className="form-control" value={employeeData.MonthCompleted} placeholder="Enter Month Completed" name="MonthCompleted" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                        <div className="form-group">
                                        <label>Units Earned</label>
                                            <input type="text" className="form-control" value={employeeData.UnitsEarned} placeholder="Enter Units Earned" name="UnitsEarned" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                        <label htmlFor="completed">Completed</label>
                                            <input type="text" className="form-control" value={employeeData.Completed} placeholder="Enter Completed" name="Completed" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Save Changes</button>
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
                          <form onSubmit={handleECFormSubmit}>
                            <div className='card-body'>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Full Name</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactFullName} placeholder="Enter full name" name="EmContactFullName" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                          <label>Phone Number</label>
                                          <input type="text" className="form-control" value={employeeData.EmContactPhoneNumber} placeholder="Enter contact number" name="EmContactPhoneNumber" onChange={handleInputChange} />
                                      </div>
                                  </div>
                                  <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Complete Address</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactCompleteAddress} placeholder="Enter complete address" name="EmContactCompleteAddress" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>House Number</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactHouseNo} placeholder="Enter house number" name="EmContactHouseNo" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Barangay</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactBarangay} placeholder="Enter Barangay" name="EmContactBarangay" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                  <div className="col-md-4">
                                        <div className="form-group">
                                            <label>City / Municipality</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactCityMunicipality} placeholder="Enter city/municipality" name="EmContactCityMunicipality" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Province</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactProvince} placeholder="Enter province" name="EmContactProvince" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Region</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactRegion} placeholder="Enter Region" name="EmContactRegion" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                  <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Country</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactCountry} placeholder="Enter Country" name="EmContactCountry" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Zip Code</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactZipcode} placeholder="Enter zip code" name="EmContactZipcode" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Land Mark</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactLandMark} placeholder="Enter landmark" name="EmContactLandMark" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Is Permanent</label>
                                            <select className="form-control" value={employeeData.Is_Permanent} name="Is_Permanent" onChange={handleInputChange}>
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </div>
                                    </div>
                                  <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Is Emergency</label>
                                            <select className="form-control" value={employeeData.Is_Emergency} name="Is_Emergency" onChange={handleInputChange}>
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </div>
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
                        {/* Dependent Form */}
                           {/* <div className="container">  */}
                           {/* <div className="card"> */}
                                <div className="card-body d-flex justify-content-between align-items-center">
                                  {/* New Record button */}
                                  <button className="btn btn-xs btn-success mr-2" onClick={handleShowAddModal}>
                                    <i className="fas fa-plus"></i> New Record
                                  </button>

                                  {/* Search form */}
                                  <form className="form-inline ml-auto">
                                    <div className="input-group">
                                      <input
                                        type="text"
                                        className="form-control bg-light border-0 small"
                                        placeholder="Search by Name"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                      />
                                      <div className="input-group-append">
                                        <button className="btn btn-primary" type="button">
                                          <i className="fas fa-search fa-sm"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </form>
                                </div>
                              {/* Add Dependent Modal */}
                              <Modal show={showAddModal} onHide={handleCloseAddModal} dialogClassName="custom-modal">
                                  <Modal.Header>
                                      <Modal.Title>Add New Dependent</Modal.Title>
                                      <Button variant="default" onClick={handleCloseAddModal}> X </Button>
                                  </Modal.Header>
                                  <Modal.Body>
                                      {/*  adding new dependent form*/}
                                      <form >
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Full Name</label>
                                                                  <input type="text" className="form-control" value={employeeData.FullName} placeholder="enter dependent full name" name="FullName" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Phone Number</label>
                                                                  <input type="tel" className="form-control" value={employeeData.PhoneNum} placeholder="Enter Phone Number" name="PhoneNum" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Relationship</label>
                                                                  <input type="text" className="form-control" value={employeeData.Relationship} placeholder="enter relationship" name="Relationship" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label>Date of Birth</label>
                                                                  <input type="date" className="form-control" value={employeeData.DateOfBirth} placeholder="enter date of birth" name="DateOfBirth" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Occupation</label>
                                                                  <input type="text" className="form-control" value={employeeData.Occupation} placeholder="enter  occupation" name="Occupation" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Address</label>
                                                                  <input type="text" className="form-control" value={employeeData.Address} placeholder="Enter address" name="Address" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label>City</label>
                                                                  <input type="text" className="form-control" value={employeeData.City} placeholder="Enter City" name="City" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label>Province</label>
                                                                  <input type="text" className="form-control" value={employeeData.DepProvince} placeholder="Enter Province" name="DepProvince" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                                    <div className="form-group">
                                                                    <label >Postal Code</label>
                                                                    <input type="text" className="form-control" value={employeeData.PostalCode} placeholder="Enter Postal Code" name="PostalCode" onChange={handleInputChange} />
                                                                    </div>
                                                                  </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Beneficiary</label>
                                                                  <input type="text" className="form-control" value={employeeData.Beneficiary} placeholder="Enter Beneficiary" name="Beneficiary" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                                    <div className="form-group">
                                                                    <label >Beneficiary Date</label>
                                                                    <input type="date" className="form-control" value={employeeData.BeneficiaryDate} placeholder="Enter Beneficiary Date" name="BeneficiaryDate" onChange={handleInputChange} />
                                                                    </div>
                                                                  </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Type of coverage</label>
                                                                  <input type="text" className="form-control" value={employeeData.TypeOfCoverage} placeholder="Enter Type of coverage" name="TypeOfCoverage" onChange={handleInputChange} />
                                                          </div>
                                                          </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Insurance</label>
                                                                  <input type="text" className="form-control" value={employeeData.Insurance} placeholder="Enter Insurance" name="Insurance" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Insurance Date</label>
                                                                  <input type="date" className="form-control" value={employeeData.InsuranceDate} placeholder="Enter Insurance Date" name="InsuranceDate" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                                    <div className="form-group">
                                                                    <label >Remarks</label>
                                                                    <input type="text" className="form-control" value={employeeData.Remarks} placeholder="Enter Remarks" name="Remarks" onChange={handleInputChange} />
                                                                    </div>
                                                                  </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Company Paid</label>
                                                                  <input type="text" className="form-control" value={employeeData.CompanyPaid} placeholder="Enter Company Paid" name="CompanyPaid" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >HMO Provider</label>
                                                                  <input type="text" className="form-control" value={employeeData.HMOProvider} placeholder="Enter HMO Provider" name="HMOProvider" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                                    <div className="form-group">
                                                                    <label >HMO Policy Number</label>
                                                                    <input type="text" className="form-control" value={employeeData.HMOPolicyNumber} placeholder="Enter HMO Policy Number" name="HMOPolicyNumber" onChange={handleInputChange} />
                                                                    </div>
                                                                  </div>
                                                      </div>
                                                      <br/>
                                      </form>
                                  </Modal.Body>
                                  <Modal.Footer>
                                      <Button variant="secondary" onClick={handleCloseAddModal}>
                                          Close
                                      </Button>
                                      <Button variant="primary" onClick={handleAddDependent}>
                                          Add Dependent
                                      </Button>
                                  </Modal.Footer>
                              </Modal>
                              {/* Edit Dependent Modal */}
                            <Modal show={!!selectedDependent} onHide={handleCloseEditModal} dialogClassName="custom-modal">
                              <Modal.Header>
                                <Modal.Title>Update Dependent Records</Modal.Title>
                                <Button variant="default" onClick={handleCloseEditModal}> X </Button>
                              </Modal.Header>
                              <Modal.Body>
                                      {/*  edit dependent form*/}
                                      <form>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Full Name</label>
                                                                  <input type="text" className="form-control" placeholder="enter dependent full name" value={selectedDependent?.FullName || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, FullName: e.target.value })} />
                                                                  {/* <input type="text" className="form-control" value={employeeData.FullName} placeholder="enter dependent full name" name="FullName" onChange={handleInputChange} /> */}
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Phone Number</label>
                                                                  <input type="text" className="form-control" placeholder="Enter Phone Number" value={selectedDependent?.PhoneNum || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, PhoneNum: e.target.value })} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Relationship</label>
                                                                  <input type="text" className="form-control" placeholder="enter relationship" value={selectedDependent?.Relationship || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, Relationship: e.target.value })} />
                                                              </div>
                                                          </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label>Date of Birth</label>
                                                                  <input type="text" className="form-control" placeholder="enter date of birth" value={selectedDependent?.DateOfBirth || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, DateOfBirth: e.target.value })} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Occupation</label>
                                                                  <input type="text" className="form-control" placeholder="enter  occupation" value={selectedDependent?.Occupation || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, Occupation: e.target.value })} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Address</label>
                                                                  <input type="text" className="form-control" placeholder="Enter address" value={selectedDependent?.Address || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, Address: e.target.value })}/>
                                                              </div>
                                                          </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label>City</label>
                                                                  <input type="text" className="form-control" placeholder="Enter City" value={selectedDependent?.City || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, City: e.target.value })} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label>Province</label>
                                                                  <input type="text" className="form-control" placeholder="Enter Province" value={selectedDependent?.DepProvince || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, DepProvince: e.target.value })} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                                    <div className="form-group">
                                                                    <label >Postal Code</label>
                                                                    <input type="text" className="form-control" placeholder="Enter Postal Code" value={selectedDependent?.PostalCode || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, PostalCode: e.target.value })}/>
                                                                    </div>
                                                                  </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Beneficiary</label>
                                                                  <input type="text" className="form-control" placeholder="Enter Beneficiary" value={selectedDependent?.Beneficiary || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, Beneficiary: e.target.value })}/>
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                                    <div className="form-group">
                                                                    <label >Beneficiary Date</label>
                                                                    <input type="text" className="form-control" placeholder="Enter Beneficiary Date" value={selectedDependent?.BeneficiaryDate || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, BeneficiaryDate: e.target.value })} />
                                                                    </div>
                                                                  </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Type of coverage</label>
                                                                  <input type="text" className="form-control" placeholder="Enter Type of coverage" value={selectedDependent?.TypeOfCoverage || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, TypeOfCoverage: e.target.value })} />
                                                          </div>
                                                          </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Insurance</label>
                                                                  <input type="tel" className="form-control" placeholder="Enter Insurance" value={selectedDependent?.Insurance || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, Insurance: e.target.value })} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Insurance Date</label>
                                                                  <input type="text" className="form-control" placeholder="Enter Insurance Date" value={selectedDependent?.InsuranceDate || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, InsuranceDate: e.target.value })} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                                    <div className="form-group">
                                                                    <label >Remarks</label>
                                                                    <input type="text" className="form-control" placeholder="Enter Remarks" value={selectedDependent?.Remarks || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, Remarks: e.target.value })}/>
                                                                    </div>
                                                                  </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Company Paid</label>
                                                                  <input type="text" className="form-control" placeholder="Enter Company Paid" value={selectedDependent?.CompanyPaid || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, CompanyPaid: e.target.value })} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >HMO Provider</label>
                                                                  <input type="text" className="form-control" placeholder="Enter HMO Provider" value={selectedDependent?.HMOProvider || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, HMOProvider: e.target.value })} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                                    <div className="form-group">
                                                                    <label >HMO Policy Number</label>
                                                                    <input type="text" className="form-control" placeholder="Enter HMO Policy Number" value={selectedDependent?.HMOPolicyNumber || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, HMOPolicyNumber: e.target.value })} />
                                                                    </div>
                                                                  </div>
                                                      </div>
                                                      <br/>
                                      </form>
                                  </Modal.Body>
                                  <Modal.Footer>
                                      <Button variant="secondary" onClick={handleCloseEditModal}>
                                          Close
                                      </Button>
                                      <Button variant="primary" onClick={handleDependentFormSubmit}>
                                          Save Changes
                                      </Button>
                                  </Modal.Footer>
                              </Modal>
                          {/* </div> */}
                                 {/* Dependent Table */}
                                 <div className='card-body'>
                                {/* <div className="card-body"> */}
                                  <div className="table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th scope="col">Action</th>
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
                        {filteredDependents.length > 0 ? (
                          filteredDependents.map((dependent, index) => (
                            <tr key={index}>
                              <td>
                              <button className="btn btn-xs btn-primary mr-2" onClick={() => handleShowEditModal(dependent)}>
                                              <i className="fas fa-pencil-alt"></i>
                                            </button>
                                {/* <button className="btn btn-xs btn-primary mr-2" onClick={handleShowEditModal}>
                                  <i className="fas fa-pencil-alt"></i>Edit
                                </button> */}
                                </td>
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
                            <td colSpan="19">No dependents data yet.</td>
                          </tr>
                        )}
                      </tbody>

                                    </table>
                                  </div>
                           </div>
                        {/* </div> */}
                        {/* </div>  */}
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
          {/* <Modal
        show={isModalOpen}
        onHide={handleCloseModal}
        dialogClassName="custom-modal"
      >
        <Modal.Header>
          <Modal.Title>Employee Profile</Modal.Title>
          <Button variant="default" onClick={handleCloseModal}>
            {" "}
            X{" "}
          </Button>
        </Modal.Header>
        <Modal.Body>
          <form>
            {selectedEmployee && (
              <div>
                <div className="text-center mb-3 bg-primary text-white p-2">
              <h5>EMPLOYEE INFORMATION</h5>
            </div>
                <div className="row justify-content-center">
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Date Hired:</label>
                  <span className="valueCenter">{selectedEmployee.DateHired}</span>
                  <br />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">HRAN ID:</label>
                  <span className="valueCenter">{selectedEmployee.HRANID}</span>
                  <br />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Tenure:</label>
                  <span className="valueCenter">{selectedEmployee.Tenure}</span>
                  <br />
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Employee Level:</label>
                  <span className="valueCenter">{selectedEmployee.EmployeeLevel}</span>
                  <br />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Project Code:</label>
                  <span className="valueCenter">{selectedEmployee.ProjectCode}</span>
                  <br />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Project Name:</label>
                  <span className="valueCenter">{selectedEmployee.ProjectName}</span>
                  <br />
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Designation:</label>
                  <span className="valueCenter">{selectedEmployee.Designation}</span>
                  <br />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Department:</label>
                  <span className="valueCenter">{selectedEmployee.DepartmentName}</span>
                  <br />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel">Product Code:</label>
                  <span className="valueCenter labelWithSpacing">{selectedEmployee.ProdCode}</span>
                  <br />
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Product Description:</label>
                  <span className="valueCenter">{selectedEmployee.ProdDesc}</span>
                  <br />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Employment Status:</label>
                  <span className="valueCenter">{selectedEmployee.EmploymentStatus}</span>
                  <br />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Employee Status:</label>
                  <span className="valueCenter">{selectedEmployee.EmployeeStatus}</span>
                  <br />
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">HRAN Type:</label>
                  <span className="valueCenter">{selectedEmployee.HRANType}</span>
                  <br />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing"> Work week type:</label>
                  <span className="valueCenter">{selectedEmployee.WorkWeekType}</span>
                  <br />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Shift:</label>
                  <span className="valueCenter">{selectedEmployee.ShiftName}</span>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Work Arrangement:</label>
                  <span className="valueCenter">{selectedEmployee.WorkArrangement}</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Rate Class:</label>
                  <span className="valueCenter">{selectedEmployee.RateClass}</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Rate:</label>
                  <span className="valueCenter">{selectedEmployee.Rate}</span>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Manager Id:</label>
                  <span className="valueCenter">{selectedEmployee.ManagerID}</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Manager Name</label>
                  <span className="valueCenter">{selectedEmployee.ManagerName}</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">PMPICID:</label>
                  <span className="valueCenter">{selectedEmployee.PMPICID}</span>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">PMPICID Name:</label>
                  <span className="valueCenter">{selectedEmployee.PMPICIDName}</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Delivery Unit:</label>
                  <span className="valueCenter">{selectedEmployee.DUName}</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">DUHID:</label>
                  <span className="valueCenter">{selectedEmployee.DUHID}</span>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">DUH Name:</label>
                  <span className="valueCenter">{selectedEmployee.DUHName}</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Is Manager:</label>
                  <span className="valueCenter">{selectedEmployee.IsManager === 1 ? 'Yes' : 'No'}</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Is PMPIC:</label>
                  <span className="valueCenter">{selectedEmployee.IsPMPIC === 1 ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">
                    Is Individual Contributor:
                  </label>
                  <span className="valueCenter">{selectedEmployee.IsIndividualContributor === 1 ? 'Yes' : 'No'}</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Is Active:</label>
                  <span className="valueCenter">{selectedEmployee.IsActive === 1 ? 'Yes' : 'No'}</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Is DU Head:</label>
                  <span className="valueCenter">{selectedEmployee.IsDUHead === 1 ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">TITO Type:</label>
                  <span className="valueCenter">{selectedEmployee.TITOType}</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing">Position:</label>
                  <span className="valueCenter">{selectedEmployee.Position}</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="blueLabel labelWithSpacing ">Position Level:</label>
                  <span className="valueCenter">{selectedEmployee.PositionLevel}</span>
                </div>
              </div>
            </div>
                <div className="text-center mb-3 bg-primary text-white p-2">
                  <h5>PERSONAL DETAILS</h5>
                </div>
                <div className="row justify-content-center">
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="blueLabel labelWithSpacing">Employee ID/BADGE NO:</label>
                    <span className="valueCenter">{Array.isArray(selectedEmployee.EmployeeId) ? selectedEmployee.EmployeeId[0] : selectedEmployee.EmployeeId}</span>
                    <br />
                  </div>
                </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="blueLabel labelWithSpacing">Name:</label>
                      <span className="valueCenter">{selectedEmployee.EmployeeName}</span>
                      <br />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="blueLabel labelWithSpacing">First Name:</label>
                      <span className="valueCenter">{selectedEmployee.FirstName}</span>
                      <br />
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="blueLabel labelWithSpacing">Middle Name:</label>
                      <span className="valueCenter">{selectedEmployee.MiddleName}</span>
                      <br />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="blueLabel labelWithSpacing">Last Name:</label>
                      <span className="valueCenter">{selectedEmployee.LastName}</span>
                      <br />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="blueLabel labelWithSpacing">Maiden Name:</label>
                      <span className="valueCenter">{selectedEmployee.MaidenName}</span>
                      <br />
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="blueLabel labelWithSpacing">Birthdate:</label>
                      <span className="valueCenter">{selectedEmployee.Birthdate}</span>
                      <br />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="blueLabel labelWithSpacing">Age:</label>
                      <span>{selectedEmployee.Age}</span>
                      <br />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="blueLabel labelWithSpacing">Birth Month:</label>
                      <span className="valueCenter">{selectedEmployee.BirthMonth}</span>
                      <br />
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="blueLabel labelWithSpacing">Age Bracket:</label>
                      <span>{selectedEmployee.AgeBracket}</span>
                      <br />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="blueLabel labelWithSpacing">Gender:</label>
                      <span className="valueCenter">{selectedEmployee.Gender}</span>
                      <br />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="blueLabel labelWithSpacing">Marital Status:</label>
                      <span className="valueCenter">{selectedEmployee.MaritalStatus}</span>
                      <br />
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="blueLabel labelWithSpacing">SSS:</label>
                      <span className="valueCenter">{selectedEmployee.SSS}</span>
                      <br />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="blueLabel labelWithSpacing">PHIC:</label>
                      <span className="valueCenter">{selectedEmployee.PHIC}</span>
                      <br />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="blueLabel labelWithSpacing">HDMF:</label>
                      <span className="valueCenter">{selectedEmployee.HDMF}</span>
                      <br />
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="blueLabel labelWithSpacing">TIN:</label>
                      <span className="valueCenter">{selectedEmployee.TIN}</span>
                      <br />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="blueLabel labelWithSpacing">Contact Number:</label>
                      <span className="valueCenter">{selectedEmployee.ContactNumber}</span>
                      <br />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="blueLabel labelWithSpacing">Email Address:</label>
                      <span className="valueCenter">{selectedEmployee.EmailAddress}</span>
                      <br />
                    </div>
                  </div>
                </div>
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
                        {filteredDependents.length > 0 ? (
                          filteredDependents.map((dependent, index) => (
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
                            <td colSpan="19">No dependents data yet.</td>
                          </tr>
                        )}
                      </tbody>

                                    </table>
                                  </div>
                           
            </div>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </Modal.Footer>
      </Modal> */}
      </div>
      
  );
}

export default UpdateEmployeeInfo;