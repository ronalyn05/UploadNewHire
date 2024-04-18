const dbOperation = require('./dbFiles/dbOperation');
const Employee = require('./dbFiles/employee');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const xlsx = require('xlsx');
const NewHireEmp = require('./dbFiles/newHireEmp');
const multer = require('multer');
const path = require('path');
// const crypto = require('crypto');
// const session = require('express-session');

const app = express();
const port = 5000; 

app.use(bodyParser.json());
app.use(cors());

// // Generate a random string
// const generateRandomString = (length) => {
//   return crypto.randomBytes(Math.ceil(length / 2))
//     .toString('hex') // Convert to hexadecimal format
//     .slice(0, length); // Return required number of characters
// };

// // Generate a random secret key
// const secretKey = generateRandomString(32); // You can adjust the length as needed

// console.log('Secret key:', secretKey);

// // Using the secret key in the session middleware
// app.use(
//   session({
//     secret: secretKey, // Use the generated secret key
//     resave: false,
//     saveUninitialized: true
//   })
// );


// Define a POST endpoint for user registration
app.post('/register', async (req, res) => {
    // Extract user data from the request body
    const { UserName, LastName, FirstName, MiddleName, Email, Password } = req.body;

    // Insert to Database
    let newEmp = new Employee(UserName, LastName, FirstName, MiddleName, Email, Password);
    
    try {
      await dbOperation.insertEmployee(newEmp);
      console.log('Employee inserted:', newEmp);
    } catch (error) {
      console.error("Error inserting employee:", error); // Handling error
    }
    
    // Send response
    res.status(200).json({ message: 'Data received successfully' });
});

//post endpoint for user login
app.post('/login', async (req, res) => {
  // Extract user data from the request body
  const { Email, Password } = req.body;

  // console.log('Login Username: ' + Email);
  // console.log('Login Password: ' + Password);

  try {
    const employees = await dbOperation.getEmployees(Email, Password);

    // //if successful it shoud retireve the Username of the user
    //  console.log("USER ACCOUNT: " + employees[0].UserId);
    res.send(employees); // For example, sending the employees data back as a responses

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error'); // Properly handle errors
  }
});

// // Endpoint to update user's profile photo
// app.post('/api/profile/updatePhoto', async (req, res) => {
//   const { userId, photoUrl } = req.body;

//   try {
//     const success = await dbOperation.updateProfilePhoto(userId, photoUrl);
//     if (success) {
//       res.status(200).json({ message: 'Profile photo updated successfully' });
//     } else {
//       res.status(500).json({ error: 'Failed to update profile photo' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Endpoint to update user's profile data
// app.post('/api/profile/saveChanges', async (req, res) => {
//   const { userId, userData } = req.body;

//   try {
//     const success = await dbOperation.updateProfileData(userId, userData);
//     if (success) {
//       res.status(200).json({ message: 'Profile data updated successfully' });
//     } else {
//       res.status(500).json({ error: 'Failed to update profile data' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// // Endpoint to fetch user's profile data
// app.get('/api/profile', async (req, res) => {
//   try {
//     // Assuming you have a function to get profile data from the database
//     // You need to pass the userId to the function
//      const userId = req.session.UserId; // Assuming you store userId in session
    
//     if (!userId) {
//       return res.status(401).json({ error: 'User not authenticated' });
//     }
//     const profileData = await dbOperation.getProfileData(userId);
//     if (profileData) {
//       res.json(profileData); // Send profile data as JSON response
//     } else {
//       res.status(404).json({ error: 'Profile data not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' }); // Properly handle errors
//   }
// });

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// API endpoint to update profile photo
app.post('/api/updatePhoto', upload.single('profilePhoto'), async (req, res) => {
  try {
    const UserId = req.body.userId;
    let profilePhoto = '/img/user.png'; // Set default profile photo path

    if (req.file) {
      profilePhoto = `/uploads/${req.file.filename}`;
    }

    await dbOperation.updateProfilePhoto(UserId, profilePhoto);
    res.status(200).send("Profile photo updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating profile photo");
  }
});

// API endpoint to retrieve personal details
app.get('/api/personalDetails/:userId', async (req, res) => {
  try {
    const UserId = req.params.userId;
    const personalDetails = await dbOperation.getPersonalDetailsByUserId(UserId);
    res.status(200).json(personalDetails);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving personal details");
  }
});

// API endpoint to update personal details
app.post('/api/updatePersonalDetails', async (req, res) => {
  try {
    const UserId = req.body.userId;
    const updatedDetails = req.body.updatedDetails;

    await dbOperation.updatePersonalDetails(UserId, updatedDetails);
    res.status(200).send("Personal details updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating personal details");
  }
});
app.get('/api/getUserId', async (req, res) => {
  try {
    // Your logic to fetch userId from the database
    // Replace 'YourDatabaseTable' with the actual table name where userId is stored
    const query = 'SELECT UserId FROM UserAccount'; // Adjust the query based on your database schema

    const result = await dbOperation.getUserId(query);

    if (result && result.length > 0) {
      res.status(200).json({ userId: result[0].UserId });
    } else {
      res.status(404).json({ error: 'UserId not found' });
    }
  } catch (error) {
    console.error('Error fetching userId:', error);
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
    res.status(200).json({ message: 'Data inserted successfully' });
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


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


