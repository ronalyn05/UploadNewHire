import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import LoginPage from './components/login';
import Register from './components/register';
import Dashboard from './components/dashboard';
import NewHireUpload from './components/newHireUpload';
import Reports from './components/reports';
import Footer from './components/footer';
import UpdateEmployeeInfo from './components/update'; 
import Profile from './components/profile';
import Employee from './components/employee';
import EmployeeProfile from './components/employeeProfile';
import ChangePassword from './components/changePassword';
import ForgotPasswordPage from './components/forgotpassword';

function App() {
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/newHireUpload" element={<NewHireUpload />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update/:employeeId" element={<UpdateEmployeeInfo />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/employeeProfile" element={<EmployeeProfile />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage/>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;