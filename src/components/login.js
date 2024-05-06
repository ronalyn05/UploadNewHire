import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import bcrypt from "bcryptjs"; // Import bcrypt for password hashing

function LoginPage() {
  const [formData, setFormData] = useState({
    EmployeeId: "",
    Password: "",
  });
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // If response is not ok, handle the error
        if (response.status === 401) {
          // If status is 401, extract error message from response
          const responseData = await response.json();
          // Show error message in alert
          alert(responseData.error);
        } else {
          // Handle other errors
          throw new Error('Login Failed');
        }
        return;
      }

      const data = await response.json();

      console.log('Login Successful:', data);

      sessionStorage.setItem('userId', data.UserId);
      sessionStorage.setItem('employeeId', data.EmployeeId);
      sessionStorage.setItem('firstName', data.FirstName);
      sessionStorage.setItem('lastName', data.LastName);
      sessionStorage.setItem('email', data.EmailAddress);
      sessionStorage.setItem('middleName', data.MiddleName);
      sessionStorage.setItem('profilePhoto', data.ProfilePhoto);
      sessionStorage.setItem('role', data.Role);

            // Redirect based on user role
            if (data.Role === "hrAdmin") {
              navigate("/dashboard", { state: data });
            } else if (data.Role === "employee") {
              navigate("/employee", { state: data });
            } else {
              throw new Error("Invalid user role");
            }
          } catch (error) {
            console.error("Login Failed", error);
            setErrorMessage(error.message || "Login Failed.");
          }
        };

  useEffect(() => {
    // Manipulate browser history on component mount
    const disableBackButton = () => {
      window.history.pushState(null, null, window.location.pathname);
      window.addEventListener("popstate", disableBackButton);
    };

    disableBackButton();

    // Cleanup function
    return () => {
      window.removeEventListener("popstate", disableBackButton);
    };
  }, []);

  return (
    <div className="bg-gradient-primary d-flex align-items-center justify-content-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card o-hidden border-0 shadow-lg">
              <div className="card-body p-5">
                <div className="text-center">
                  <img
                    src="./img/hris-2.png"
                    alt="Logo"
                    className="logo"
                    style={{ width: "200px", height: "auto" }}
                  />
                </div>
                <hr />
                <div className="text-center" style={{ margin: "20px" }}>
                  <img
                    src="./img/login.png"
                    alt="Login"
                    className="login-image"
                    style={{ width: "100px", height: "90px" }}
                  />
                </div>
                <form className="user" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-user"
                      id="EmployeeId"
                      placeholder="Enter Employee Id..."
                      onChange={handleChange}
                      value={formData.EmployeeId}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control form-control-user"
                      id="Password"
                      placeholder="Password"
                      onChange={handleChange}
                      value={formData.Password}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-user btn-block"
                  >
                    Login
                  </button>
                </form>
                <hr />
                <div className="text-center">
                  <Link className="small" to="/forgotpassword">
                    Forgot Password?
                  </Link>
                </div>
                <div className="text-center">
                  <Link className="small" to="/register">
                    No account yet? Create an Account!
                  </Link>
                </div>
                {errorMessage && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
