const dbOperation = require('./dbFiles/dbOperation');
const Employee = require('./dbFiles/employee');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const crypto = require('crypto');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();
const port = 5000; 

app.use(bodyParser.json());
app.use(cors());

// Static credentials
const STATIC_EMPLOYEE_ID = '7654321';
const ADMIN_PASSWORD = 'admin123';
const EMPLOYEE_PASSWORD = 'employee123';

// Generate a random string
const generateRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') // Convert to hexadecimal format
    .slice(0, length); // Return required number of characters
};

// Generate a random secret key
const secretKey = generateRandomString(32); // You can adjust the length as needed

console.log('Secret key:', secretKey);

// Using the secret key in the session middleware
app.use(
  session({
    secret: secretKey, // Use the generated secret key
    resave: false,
    saveUninitialized: true
  })
);
// employee data retrieval endpoint
app.get('/employee/:employeeId', async (req, res) => {
  const employeeId = req.params.employeeId;
  try {
    const existingUser = await dbOperation.getUserEmpId(employeeId);
      res.status(200).json(existingUser);
  } catch (error) {
      console.error('Error retrieving employee data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Backend API endpoint to check if an employee ID exists
app.get('/api/checkExistingEmployeeId/:employeeId', async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    // Perform a query to check if the employeeId exists in the database
    const existingEmployee = await dbOperation.getUserEmpId(employeeId);
    if (existingEmployee) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking employee ID:', error);
    res.status(500).send('Internal Server Error');
  }
});
// Backend API endpoint to check if an employee ID exists
app.post('/api/checkEmployeeAndEmail', async (req, res) => {
  try {
    const { employeeId, email } = req.body;
    // Perform a query to check if the employeeId and email exist in the database
    const existingEmployee = await dbOperation.checkEmployeeAndEmail(employeeId, email);
    if (existingEmployee) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking employee ID and email:', error);
    res.status(500).send('Internal Server Error');
  }
});
// Backend API endpoint to reset the password
app.post('/api/resetPassword', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Update the user's password in the database
    const result = await dbOperation.resetPassword(email, newPassword);

    // Check if the password was successfully updated
    if (result) {
      res.status(200).json({ message: "Password reset successfully." });
    } else {
      res.status(400).json({ error: "Unable to reset password. Please try again." });
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Backend API endpoint to check if an employee ID exists
app.get('/api/checkEmployeeId/:employeeId', async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    // Perform a query to check if the employeeId exists in the database
    const existingEmployee = await dbOperation.getUserById(employeeId);
    if (existingEmployee) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking employee ID:', error);
    res.status(500).send('Internal Server Error');
  }
});
 // Define a POST endpoint for user registration
app.post('/register', async (req, res) => {
  // Extract user data from the request body
  const { EmployeeId, LastName, FirstName, MiddleName, EmailAddress, Password, Role} = req.body;

  // Insert to Database
  let newEmp = new Employee( EmployeeId, LastName, FirstName, MiddleName, EmailAddress, Password, Role);

  try {
      await dbOperation.insertEmployee(newEmp);
      console.log('Employee inserted:', newEmp);
      res.status(200).json({ message: 'Employee inserted successfully' });
  } catch (error) {
      console.error("Error inserting employee:", error);
      res.status(500).json({ error: 'Failed to insert employee' });
  }
});

//post endpoint for user login
app.post('/login', async (req, res) => {
  const { EmployeeId, Password } = req.body;
  console.log('Login attempt:', { EmployeeId, Password });

  try {
    // Check for static credentials
    if (EmployeeId === STATIC_EMPLOYEE_ID) {
      if (Password === ADMIN_PASSWORD) {
        res.status(200).json({
          EmployeeId: STATIC_EMPLOYEE_ID,
          Role: 'HRAdmin'
        });
        return;
      } else if (Password === EMPLOYEE_PASSWORD) {
        res.status(200).json({
          EmployeeId: STATIC_EMPLOYEE_ID,
          Role: 'Employee'
        });
        return;
      } else {
        res.status(401).json({ error: 'Incorrect employee id or password' });
        return;
      }
    }

    // Retrieve user from the database based on EmployeeId
    const users = await dbOperation.getEmployees(EmployeeId);
    if (users.length > 0) {
      const user = users[0];
      console.log('User found:', user);

      // Check if the employee status is Active
      if (user.EmployeeStatus !== 'Active') {
        res.status(401).json({ error: `Your account status is currently ${user.EmployeeStatus}. Please contact HRAdmin for assistance.` });
        return;
      }

      // Compare provided password with the hashed password stored in the database
      const isValidPassword = await bcrypt.compare(Password, user.Password);
      console.log('Password valid:', isValidPassword);

      if (isValidPassword) {
        res.status(200).json(user);
      } else {
        console.log('Password mismatch:', { provided: Password, stored: user.Password });
        res.status(401).json({ error: 'Incorrect employee id or password' });
      }
    } else {
      res.status(401).json({ error: 'User not found or invalid credentials. Register your account!' });
    }
  } catch (error) {
    console.error('Login Failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  // app.post('/login', async (req, res) => {
  //   const { EmployeeId, Password } = req.body;
  //   console.log('Login attempt:', { EmployeeId, Password });
  
  //   try {
  //     // Check for static credentials
  //     if (EmployeeId === STATIC_EMPLOYEE_ID) {
  //       if (Password === ADMIN_PASSWORD) {
  //         res.status(200).json({
  //           EmployeeId: STATIC_EMPLOYEE_ID,
  //           Role: 'HRAdmin'
  //         });
  //         return;
  //       } else if (Password === EMPLOYEE_PASSWORD) {
  //         res.status(200).json({
  //           EmployeeId: STATIC_EMPLOYEE_ID,
  //           Role: 'Employee'
  //         });
  //         return;
  //       } else {
  //         res.status(401).json({ error: 'Incorrect employee id or password' });
  //         return;
  //       }
  //     }
  
  //     // Retrieve user from the database based on EmployeeId
  //     const users = await dbOperation.getEmployees(EmployeeId);
  //     if (users.length > 0) {
  //       const user = users[0];
  //       console.log('User found:', user);
  
  //       // Compare provided password with the hashed password stored in the database
  //       const isValidPassword = await bcrypt.compare(Password, user.Password);
  //       console.log('Password valid:', isValidPassword);
  
  //       if (isValidPassword) {
  //         res.status(200).json(user);
  //       } else {
  //         console.log('Password mismatch:', { provided: Password, stored: user.Password });
  //        // alert('Password mismatch. Please check your inputted password!');
  //         res.status(401).json({ error: 'Incorrect employee id or password' });
  //       }
  //     } else {
  //       res.status(401).json({ error: 'User not found or invalid credentials. Register your account!' });
  //     }
  //   } catch (error) {
  //     console.error('Login Failed:', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });
  // Change password endpoint
  app.post('/changePassword', async (req, res) => {
    const { EmployeeId, CurrentPassword, NewPassword } = req.body;
  
    try {
      // Retrieve user from the database based on EmployeeId
      const user = await dbOperation.getUserByEmployeeId(EmployeeId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      // Compare provided current password with the hashed password stored in the database
      const isValidPassword = await bcrypt.compare(CurrentPassword, user.Password);
      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid current password' });
        return;
      }
  
      // Hash the new password before storing it in the database
      const hashedNewPassword = await bcrypt.hash(NewPassword, 10);
  
      // Update the user's password in the database
      await dbOperation.updateUserPassword(EmployeeId, hashedNewPassword);
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Password Change Failed:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
// Multer storage configuration
const upload = multer();
// API endpoint to update profile photo
app.post('/api/updatePhoto/:employeeId', upload.single('profilePhoto'), async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    let profilePhoto = '/img/user.png'; // Set default profile photo path

    if (req.file) {
      // Convert file to base64 string
      profilePhoto = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    await dbOperation.updateProfilePhoto(employeeId, profilePhoto);
    res.status(200).send("Profile photo updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating profile photo");
  }
});
// API endpoint to update users details
app.post('/api/updatePersonalDetails/:employeeId', async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const updatedDetails = req.body; // This should contain updated user data
    await dbOperation.updatePersonalDetails(employeeId, updatedDetails);
    res.status(200).send("Personal details updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating personal details");
  }
});
//api endpoint to retrieve the users data
app.get('/api/getUserData/:employeeId', async (req, res) => {
  try {
    // Retrieve userId from the request parameters
    const employeeId = req.params.employeeId;

    // Fetch user data from the database based on the userId
    const userData = await dbOperation.getUserData(employeeId);

    // If no user data found for the provided userId, return an error
    if (!userData) {
      return res.status(404).json({ error: 'User data not found' });
    }

    // Respond with the user data
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  // POST endpoint to handle Excel data upload
  app.post('/upload', async (req, res) => {
    const excelData = req.body; // Assuming excelData is sent as JSON

    try {
      for (const row of excelData) {
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(row.Password, 10);

        // Insert row data along with the hashed password into the database
        await dbOperation.insertNewHire(row, hashedPassword);
        console.log('Employee inserted:', row);
      }

      // Respond with success message
      res.status(200).json({ message: 'Data uploaded successfully' });
    } catch (error) {
      console.error("Error occurred while inserting data:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Endpoint to retrieve employee data
app.get('/newHireEmp', async (req, res) => {
  try {
      const employees = await dbOperation.getAllNewHireEmployees();
      res.status(200).json(employees);
  } catch (error) {
      console.error('Error retrieving employee data:', error);
      res.status(500).send('Error retrieving employee data.');
  }
});
// Endpoint for adding a new contact number
app.post('/addContactNumber/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const newContactData = req.body;
  try {
    // const result = await dbOperation.insertDependent(employeeId, newDependentData);
    await dbOperation.getAddNewContactId(employeeId, newContactData); // No need to assign to result if not used
    res.json({ message: 'Secondary Contact number added successfully' });
  } catch (error) {
    console.error('Error adding Contact number:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Endpoint to retrieve users account data
app.get('/usersAccount', async (req, res) => {
  try {
      const users = await dbOperation.getAllUserAccount();
      res.status(200).json(users);
  } catch (error) {
      console.error('Error retrieving employee data:', error);
      res.status(500).send('Error retrieving employee data.');
  }
});
// Endpoint to retrieve employee by ID
app.get('/retrieve/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  try {
    const employee = await dbOperation.getEmployeeById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update password endpoint
// app.post('/update/password/:employeeId', async (req, res) => {
//   const { employeeId } = req.params;
//   const { Password } = req.body;

//   try {
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(Password, 10);

//     // Perform the update operation in your database
//     await dbOperation.updateEmployeePassword(employeeId, hashedPassword);

//     res.json({ message: 'Password updated successfully' });
//   } catch (error) {
//     console.error('Error updating password:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// Update role type endpoint
// app.post('/update/role/:employeeId', async (req, res) => {
//   const { employeeId } = req.params;
//   const { Role } = req.body;
//   try {
//     // Perform the update operation in your database here
//     await dbOperation.updateEmployeeRole(employeeId, Role);
//     // updateEmployeeRole doesn't return the updated data, you can send a success response
//     res.json({ message: 'Role updated successfully' });
//   } catch (error) {
//     console.error('Error updating role:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


// Endpoint to update employee by ID
app.put('/updateEmployee/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;
  try {
    const result = await dbOperation.updateEmployeeById(employeeId, updatedEmployeeData);
    if (!result) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// API endpoint for updating employee information by id
app.put('/updateEmployeeInfo/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;

  // Validate HRANType is chosen
  if (!updatedEmployeeData.HRANType) {
      return res.status(400).json({ message: 'HRANType is required when updating the employee information.' });
  }

  try {
      const result = await dbOperation.updateEmployeeInfoById(employeeId, updatedEmployeeData);
      if (!result) {
          return res.status(404).json({ message: 'Employee information not found' });
      }
      res.json({ message: 'Employee information updated successfully' });
  } catch (error) {
      console.error('Error updating employee information:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// API endpoint for adding records to the History table
app.post('/addToHistory', async (req, res) => {
  const historyData = req.body;

  console.log('Received historyData:', historyData); // Debugging statement

  try {
      // Insert the record into the History table
      const result = await dbOperation.addToHistory(historyData);

      // Respond with success message
      res.status(201).json({ message: 'Record added to History successfully' });
  } catch (error) {
      console.error('Error adding record to History:', error);
      res.status(500).json({ message: 'Failed to add record to History' });
  }
});
// API endpoint for getting current employee information by ID
app.get('/getEmployeeInfo/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  try {
    const employeeData = await dbOperation.getEmployeeInfoById(employeeId);
    if (!employeeData) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employeeData);
  } catch (error) {
    console.error('Error fetching employee information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// //api endpoint for updating employee information by id
// app.put('/updateEmployeeInfo/:employeeId', async (req, res) => {
//   const { employeeId } = req.params;
//   const updatedEmployeeData = req.body;
//   try {
//     const result = await dbOperation.updateEmployeeInfoById(employeeId, updatedEmployeeData);
//     if (!result) {
//       return res.status(404).json({ message: 'Employee information not found' });
//     }
//     res.json({ message: 'Employee information updated successfully' });
//   } catch (error) {
//     console.error('Error updating employee information:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
//api endpoint for updating employee address by id
app.put('/updateEmployeeAddress/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;
  try {
    const result = await dbOperation.updateEmployeeAddressById(employeeId, updatedEmployeeData);
    if (!result) {
      return res.status(404).json({ message: 'Employee address not found' });
    }
    res.json({ message: 'Employee address updated successfully' });
  } catch (error) {
    console.error('Error updating address information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//api endpoint for updating employee address by id
app.put('/updateEmployeeEducation/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;
  try {
    const result = await dbOperation.updateEmployeeEducationById(employeeId, updatedEmployeeData);
    if (!result) {
      return res.status(404).json({ message: 'Employee education details not found' });
    }
    res.json({ message: 'Employee education details updated successfully' });
  } catch (error) {
    console.error('Error updating education details information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//api endpoint for updating project details
app.put('/updateProject/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;
  try {
    const result = await dbOperation.updateEmployeeProjectById(employeeId, updatedEmployeeData);
    if (!result) {
      return res.status(404).json({ message: 'Employee project details not found' });
    }
    res.json({ message: 'Employee project details updated successfully' });
  } catch (error) {
    console.error('Error updating project details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//api endpoint for updating  shift details
app.put('/updateShift/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;
  try {
    const result = await dbOperation.updateEmployeeShiftById(employeeId, updatedEmployeeData);
    if (!result) {
      return res.status(404).json({ message: 'Employee shift details not found' });
    }
    res.json({ message: 'Employee shift details updated successfully' });
  } catch (error) {
    console.error('Error updating shift details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//api endpoint for updating delivery unit details
app.put('/updateDU/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;
  try {
    const result = await dbOperation.updateEmployeeDUById(employeeId, updatedEmployeeData);
    if (!result) {
      return res.status(404).json({ message: 'Employee delivery unit details not found' });
    }
    res.json({ message: 'Employee delivery unit details updated successfully' });
  } catch (error) {
    console.error('Error updating delivery unit details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//api endpoint for updating deaprtment details
app.put('/updateDepartment/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;
  try {
    const result = await dbOperation.updateEmployeeDepartmentById(employeeId, updatedEmployeeData);
    if (!result) {
      return res.status(404).json({ message: 'Employee department details not found' });
    }
    res.json({ message: 'Employee department details updated successfully' });
  } catch (error) {
    console.error('Error updating department details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
  // API endpoint for inserting a new dependent record
  app.post('/addDependent/:employeeId', async (req, res) => {
    const { employeeId } = req.params;
    const newDependentData = req.body;
    try {
      // const result = await dbOperation.insertDependent(employeeId, newDependentData);
      await dbOperation.insertDependent(employeeId, newDependentData); 
      res.json({ message: 'Dependent record added successfully' });
    } catch (error) {
      console.error('Error adding dependent record:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
// Endpoint to retrieve dependents by Employee ID
app.get('/retrieve/dependents/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  try {
    const dependents = await dbOperation.getDependentsByEmployeeId(employeeId);
    res.json(dependents);
  } catch (error) {
    console.error('Error fetching dependents:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Endpoint to update dependent details by DependentId
app.put('/updateDependent/:dependentId', async (req, res) => {
  const { dependentId } = req.params;
  const updatedDependentData = req.body;

  try {
    const result = await dbOperation.updateDependentById(dependentId, updatedDependentData);

    if (!result) {
      return res.status(404).json({ message: 'Dependent not found' });
    }

    res.json({ message: 'Dependent details updated successfully' });
  } catch (error) {
    console.error('Error updating dependent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API endpoint for updating emergency contact details
app.put('/updateEmerContact/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;
  try {
    const result = await dbOperation.updateEmergencyContactById(employeeId, updatedEmployeeData);
    if (!result) {
      return res.status(404).json({ message: 'Employee emergency contact not found' });
    }
    res.json({ message: 'Employee emergency contact details updated successfully' });
  } catch (error) {
    console.error('Error updating emergency contact details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// DELETE endpoint to delete an employee by ID
app.delete('/deleteEmployee/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  try {
      const result = await dbOperation.deleteEmployeeById(employeeId);
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Employee not found' });
      }
      res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
// DELETE endpoint to delete all employee data
app.delete('/api/deleteAllEmployeeData', async (req, res) => {
  try {
    const result = await dbOperation.deleteAllEmployeeData(); // Call the function

    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error('Error deleting all employee data:', error);
    res.status(500).json({ message: 'Failed to delete all employee data. Please try again.' });
  }
});
// DELETE endpoint to delete an employee by ID
app.delete('/deleteUserAccount/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
      const result = await dbOperation.deleteUsersById(userId);
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
      console.error('Error deleting User account:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
// DELETE endpoint to delete an employee by ID
app.delete('/deleteEmpInfo/:empInfoId', async (req, res) => {
  const { empInfoId } = req.params;
  try {
      const result = await dbOperation.deleteEmpInfoById(empInfoId);
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'employee Info deleted successfully' });
  } catch (error) {
      console.error('Error deleting employee Info:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
// DELETE endpoint to delete an employee by ID
app.delete('/deleteEmContact/:emergencyNumId', async (req, res) => {
  const { emergencyNumId } = req.params;
  try {
      const result = await dbOperation.deleteEmContactById(emergencyNumId);
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'Emergency Contact deleted successfully' });
  } catch (error) {
      console.error('Error deleting emergency Contac:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
// API endpoint for inserting a new compensation benefits record
app.post('/addCompBen/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const newCompBenData = req.body;
  try {
    await dbOperation.insertCompBen(employeeId, newCompBenData); 
    res.json({ message: 'Compensation benefit added successfully' });
  } catch (error) {
    console.error('Error adding compensation benefit record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Endpoint to retrieve compensation benefits by Employee ID
app.get('/retrieve/compBen/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  if (!employeeId) {
    return res.status(400).json({ message: 'Employee ID is required' });
  }

  try {
    const compBen = await dbOperation.getCompBenByEmployeeId(employeeId);
    if (compBen.length === 0) {
      return res.status(404).json({ message: 'No compensation benefits found for the given Employee ID' });
    }
    res.json(compBen);
  } catch (error) {
    console.error('Error fetching compensation benefits:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
// Endpoint to update compensation benefits details by CompBenId
app.put('/updateCompBen/:compBenId', async (req, res) => {
  const { compBenId } = req.params;
  const updatedcompBenData = req.body;

  try {
    const result = await dbOperation.updateCompBenById(compBenId, updatedcompBenData);

    if (!result) {
      return res.status(404).json({ message: 'Compensation benefit details not found' });
    }

    res.json({ message: 'Compensation benefit details updated successfully' });
  } catch (error) {
    console.error('Error updating compensation benefit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Endpoint to retrieve history by Employee ID
app.get('/retrieve/history/:employeeId', async (req, res) => {
  // Retrieve employeeId from request parameters
  const { employeeId } = req.params;

  // Check if employeeId is provided
  if (!employeeId) {
    return res.status(400).json({ message: 'Employee ID is required' });
  }

  try {
    // Fetch history data from the database based on the employee ID
    const history = await dbOperation.getHistoryByEmployeeId(employeeId);
    if (history.length === 0) {
      return res.status(404).json({ message: 'No history found for the given Employee ID' });
    }
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

