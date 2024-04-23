const dbOperation = require('./dbFiles/dbOperation');
const Employee = require('./dbFiles/employee');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const xlsx = require('xlsx');
const NewHireEmp = require('./dbFiles/newHireEmp');
const multer = require('multer');
const path = require('path');
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

 // Define a POST endpoint for user registration
app.post('/register', async (req, res) => {
  // Extract user data from the request body
  const { LastName, FirstName, MiddleName, Email, UserName, Password} = req.body;

  // Insert to Database
  let newEmp = new Employee(LastName, FirstName, MiddleName, Email, UserName, Password);

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
  const { Email, Password } = req.body;

  try {
    const users = await dbOperation.getEmployees(Email, Password);

    if (users.length > 0) {
      const user = users[0];
      const isValidPassword = await bcrypt.compare(Password, user.Password);

      if (isValidPassword) {
        res.status(200).json(user);
      } else {
        res.status(401).json({ error: 'Incorrect email or password' });
        
      }
    } else {
      res.status(401).json({ error: 'User not found or invalid credentials' });
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
app.post('/api/updatePhoto/:userId', upload.single('profilePhoto'), async (req, res) => {
  try {
    const userId = req.params.userId;
    let profilePhoto = '/img/user.png'; // Set default profile photo path

    if (req.file) {
      // Convert file to base64 string
      profilePhoto = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    await dbOperation.updateProfilePhoto(userId, profilePhoto);
    res.status(200).send("Profile photo updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating profile photo");
  }
});

// // API endpoint to update profile photo
// app.post('/api/updatePhoto/:userId', upload.single('profilePhoto'), async (req, res) => {
//   try {
//     const userId = req.params.userId; // Retrieve userId from the request body
//     console.log(userId);
//     let profilePhoto = '/img/user.png'; // Set default profile photo path

//     if (req.file) {
//       // Convert file to base64 string
//       profilePhoto = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
//     }

//     await dbOperation.updateProfilePhoto(userId, profilePhoto);
//     res.status(200).send("Profile photo updated successfully");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error updating profile photo");
//   }
// });

// API endpoint to update users details
app.post('/api/updatePersonalDetails/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedDetails = req.body;

    // Validate userId here if needed

    await dbOperation.updatePersonalDetails(userId, updatedDetails);
    res.status(200).send("Personal details updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating personal details");
  }
});
//api endpoint to retrieve the users data
app.get('/api/getUserData/:userId', async (req, res) => {
  try {
    // Retrieve userId from the request parameters
    const userId = req.params.userId;

    // Fetch user data from the database based on the userId
    const userData = await dbOperation.getUserData(userId);

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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

