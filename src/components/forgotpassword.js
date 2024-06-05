import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
  const [formData, setFormData] = useState({
    EmployeeId: "",
    EmailAddress: "",
  });
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim whitespace from form data
    const trimmedFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value.trim()])
    );

    try {
      const response = await fetch("/api/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedFormData),
      });

      if (!response.ok) {
        const responseData = await response.json();
        setErrorMessage(responseData.error || "Request Failed");
        return;
      }

      const data = await response.json();
      console.log("Password reset request successful:", data);
      setMessage("Password reset request sent successfully. Please contact your HRAdmin.");
      setErrorMessage(null);
    } catch (error) {
      console.error("Request Failed", error);
      setErrorMessage(error.message || "Request Failed.");
      setMessage(null);
    }
  };

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
                    src="./img/forgotpass.png"
                    alt="Forgot Password"
                    className="forgot-password-image"
                    style={{ width: "100px", height: "90px" }}
                  />
                </div>
                <form className="user" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-user"
                      id="EmployeeId"
                      name="EmployeeId"
                      placeholder="Employee ID"
                      value={formData.EmployeeId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control form-control-user"
                      id="EmailAddress"
                      name="EmailAddress"
                      placeholder="Email Address"
                      value={formData.EmailAddress}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-user btn-block"
                  >
                    Request Password Reset
                  </button>
                </form>
                <hr />
                <div className="text-center">
                  <Link className="small" to="/">
                    Back to Login
                  </Link>
                </div>
                {message && (
                  <div className="alert alert-success mt-3" role="alert">
                    {message}
                  </div>
                )}
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

export default ForgotPasswordPage;
