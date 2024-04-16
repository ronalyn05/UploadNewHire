import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import TopNavbar from "./topnavbar";
import Footer from "./footer";
import "../App.css"; // Import your custom CSS file

function Profile() {
  const userName = sessionStorage.getItem("userName");
  const firstName = sessionStorage.getItem("firstName");
  const lastName = sessionStorage.getItem("lastName");
  const middleName = sessionStorage.getItem("middleName");
  const email = sessionStorage.getItem("email");
  const profilePhoto = sessionStorage.getItem("profilePhoto");

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    profilePhoto: "",
    // Add other profile info fields here
  });
  const [newPhoto, setNewPhoto] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (event) => {
    setNewPhoto(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    if (newPhoto) {
      formData.append("photo", newPhoto);
    }
    // Append other form data fields to formData if needed
    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      // Handle success
      setErrorMessage("");
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again later.");
    }
  };

  const handleChange = (event) => {
    // Handle input changes and update userData state
    setUserData({
      ...userData,
      [event.target.id]: event.target.value,
    });
  };

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    // Send updated user data to server for saving
    try {
      const response = await fetch("/api/profile/save", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to save changes");
      }
      // Handle success
      setErrorMessage("");
    } catch (error) {
      console.error("Error saving changes:", error);
      setErrorMessage("Failed to save changes. Please try again later.");
    }
  };

  return (
    <div>
      <div id="wrapper">
        <Navbar />
        <div id="content-wrapper" className="d-flex flex-column">
          {/* Main content */}
          <div id="content">
            <TopNavbar />
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div className="col-xl-12 col-lg-12">
                  <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h5 className="m-0 font-weight-bold text-primary">
                        Profile
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="profile-container">
                            <img
                              src={userData.profilePhoto || "/img/user.png"}
                              alt="Profile"
                              className="img-fluid rounded-circle profile-photo"
                            />
                            <form onSubmit={handleSubmit}>
                              <div className="form-group">
                                <input
                                  type="file"
                                  onChange={handleFileChange}
                                  accept="image/*"
                                  className="form-control-file mt-3"
                                />
                              </div>
                              <button type="submit" className="btn btn-primary">
                                Update Photo
                              </button>
                            </form>
                          </div>
                        </div>
                        <div className="col-md-8">
                          <div className="profile-info">
                          {errorMessage && (
                              <div className="row justify-content-center">
                                <div className="col-md-6">
                                  <div className="alert alert-danger mt-3">
                                    {errorMessage}
                                  </div>
                                </div>
                              </div>
                            )}
                            <h5 className="m-0 font-weight-bold text-primary">
                              Personal Details
                            </h5>
                            <br />
                            <form className="user" onSubmit={handleSaveChanges}>
                              <div className="form-group row">
                                <div className="col-sm-6 mb-3 mb-sm-0">
                                  <input
                                    type="text"
                                    className="form-control form-control-user"
                                    id="firstName"
                                    placeholder="First Name"
                                    onChange={handleChange}
                                    value={firstName}
                                  />
                                </div>
                                <div className="col-sm-6">
                                  <input
                                    type="text"
                                    className="form-control form-control-user"
                                    id="lastName"
                                    placeholder="Last Name"
                                    onChange={handleChange}
                                    value={lastName}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <div className="col-sm-6 mb-3 mb-sm-0">
                                  <input
                                    type="text"
                                    className="form-control form-control-user"
                                    id="middleName"
                                    placeholder="Middle Name"
                                    onChange={handleChange}
                                    value={middleName}
                                  />
                                </div>
                                <div className="col-sm-6">
                                  <input
                                    type="text"
                                    className="form-control form-control-user"
                                    id="userName"
                                    placeholder="User Name"
                                    onChange={handleChange}
                                    value={userName}
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <input
                                  type="email"
                                  className="form-control form-control-user"
                                  id="email"
                                  placeholder="Email Address"
                                  onChange={handleChange}
                                  value={email}
                                />
                              </div>
                              <div className="d-flex justify-content-center">
                                <div className="col-md-6 d-flex justify-content-center">
                                  <button
                                    type="submit"
                                    className="btn btn-primary btn-user btn-block"
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Profile;
