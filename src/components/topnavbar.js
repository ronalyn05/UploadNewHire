import React from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

function TopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  // const { FirstName, LastName } = location.state || {};
    // Get user data from location state
    const data = location.state;

  // Retrieve user's first name and last name from sessionStorage
  const firstName = sessionStorage.getItem('firstName');
  const lastName = sessionStorage.getItem('lastName');
  const profilePhoto = sessionStorage.getItem('profilePhoto');
  const defaultPhoto = "/img/user.png";

  // Retrieve user's role from sessionStorage
  const userRole = sessionStorage.getItem('role');

  const handleLogout = () => {
    // Clear sessionStorage on logout
    sessionStorage.removeItem('firstName');
    sessionStorage.removeItem('lastName');
    localStorage.removeItem('user');
    navigate('../');
  };
  // Function to format text into sentence case
const toSentenceCase = (text) => {
  if (!text) return ''; // Handle null or undefined input
  return text
    .toLowerCase() // Convert the text to lowercase first
    .split(' ') // Split the text into an array of words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' '); // Join the words back together
};

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      {/* Sidebar Toggle (Topbar) */}
      <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
        <i className="fa fa-bars"></i>
      </button>

      {/* Topbar Navbar */}
      <ul className="navbar-nav ml-auto">
        {/* Nav Item - Search Dropdown (Visible Only XS) */}
        <li className="nav-item dropdown no-arrow d-sm-none">
          <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i className="fas fa-search fa-fw"></i>
          </a>
        </li>
        <div className="topbar-divider d-none d-sm-block"></div>

        {/* Nav Item - User Information */}
        <li className="nav-item dropdown no-arrow">
          <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="mr-2 d-none d-lg-inline text-gray-600 small">{toSentenceCase(firstName)} {toSentenceCase(lastName)}</span>
            {/* <img className="img-profile rounded-circle" src="img/undraw_profile.svg" alt="User Profile" /> */}
            <img className="img-profile rounded-circle" src={profilePhoto || defaultPhoto} alt="User Profile" />
          </a>
          {/* Dropdown - User Information */}
          <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
            {userRole === 'HRAdmin' && (
              <Link className="dropdown-item" to={{ pathname: "/profile"}} state={data}>
                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                <span>Profile</span>
              </Link>
            )}
            {/* <a className="dropdown-item" href="#">
              <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
              Settings
            </a>
            <a className="dropdown-item" href="#">
              <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
              Activity Log
            </a> */}
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" data-toggle="modal" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
              Logout
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default TopNavbar;
