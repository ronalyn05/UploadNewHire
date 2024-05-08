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

  try {
    const users = await dbOperation.getEmployees(EmployeeId, Password);

    if (users.length > 0) {
      const user = users[0];
      const isValidPassword = await bcrypt.compare(Password, user.Password);

      if (isValidPassword) {
        res.status(200).json(user);
      } else {
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
//   // Extract user data from the request body
//   const { Email, Password } = req.body;

//   try {
//     // Authenticate the user with the provided credentials
//     const user = await dbOperation.getEmployees(Email, Password);

//     if (user && user.length > 0) {
//       // Store user information in the session
//       req.session.user = user[0]; // Store the entire user object in the session

//       // If authentication is successful, send the user data back as a response
//       res.status(200).json(user[0]); // Send only the user data
//     } else {
//       // If authentication fails, send an appropriate error response
//       res.status(401).json({ error: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error'); // Properly handle errors
//   }
// });

// //post endpoint for user login
// app.post('/login', async (req, res) => {
//   // Extract user data from the request body
//   const { Email, Password } = req.body;

//   // console.log('Login Username: ' + Email);
//   // console.log('Login Password: ' + Password);
// //   const user = {
// //     UserId: {UserId},
// //     // Other user information
// //   };

//   // Store user information in the session
//   req.session.user = {
//     userId: user.UserId,
//     // Other user information
//   };

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
    // Loop through each row of excelData
    for (const row of excelData) {
      // Insert row data into the database
      await dbOperation.insertNewHire(row);
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
//api endpoint for updating employee information by id
app.put('/updateEmployeeInfo/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;
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
    await dbOperation.insertDependent(employeeId, newDependentData); // No need to assign to result if not used
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
// app.put('/updateDependent/:employeeId', async (req, res) => {
//   const { employeeId } = req.params;
//   const updatedEmployeeData = req.body;
//   try {
//     const result = await dbOperation.updateEmployeeDependentById(employeeId, updatedEmployeeData);
//     if (!result) {
//       return res.status(404).json({ message: 'Employee department details not found' });
//     }
//     res.json({ message: 'Employee department details updated successfully' });
//   } catch (error) {
//     console.error('Error updating department details:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

