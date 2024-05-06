import React from "react";
import { Link, useLocation } from 'react-router-dom';
 import '../App.css';
//  import { variables } from '../variables';


 function Navbar() {

  // Get user data from location state
  const location = useLocation();
  const data = location.state;
// console.log(data)
     return (
         <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
             {/* Sidebar - Brand */}
             <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                 <div className="sidebar-brand-icon">
                     <img src="/img/hris1.png" alt="companyLogo" className="logo1" />
                 </div>
                 <div className="sidebar-brand-text">
                     <img src="/img/hris2.png" alt="companyLogo" className="logo2" />
                 </div>
             </a>
             {/* Divider */}
             <hr className="sidebar-divider my-0" />
             {/* Nav Item - Dashboard */}
             <li className="nav-item">
                <Link className="nav-link" to={{ pathname: "/dashboard"}} state={data}>
                <i className="fas fa-fw fa-tachometer-alt"></i>
                        <span>Dashboard</span>
                  </Link>
             </li>
             {/* Divider */}
             <hr className="sidebar-divider" />
             {/* Heading */}
             <div className="sidebar-heading">
                 MAIN
             </div>
             {/* Nav Item - New Hire Upload */}
             <li className="nav-item">
                 {/* <a className="nav-link" href="/newHireUpload"> */}
                 <Link className="nav-link" to={{ pathname: "/newHireUpload"}} state={data}>
                  <i className="fas fa-fw fa-upload"></i>
                  <span>New Hire Upload</span>
                </Link>
                 {/* </a> */}
             </li>
             {/* Nav Item - Reports*/}
             <li className="nav-item">
             <Link className="nav-link" to={{ pathname: "/reports"}} state={data} >
                <i className="fas fa-fw fa-chart-bar"></i>
                <span>Report</span>
              </Link>
             </li>
            
             {/* Sidebar Toggler (Sidebar) */}
             <div className="text-center d-none d-md-inline">
          <button className="rounded-circle border-0" id="sidebarToggle"></button>
        </div>
         </ul>
     );
 }
 
 export default Navbar;
 


  