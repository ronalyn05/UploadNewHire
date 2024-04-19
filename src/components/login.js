import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [formData, setFormData] = useState({
    Email: "",
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
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      console.log(response); // Log the response to see its structure
  
      if (!response.ok) {
        throw new Error("Login Failed");
      }
  
      const data = await response.json();
      console.log(data); // Log the data received from the server
  
      // Ensure that the data object is structured as expected
      if (!data || !data.UserId) {
        throw new Error("Invalid response from server");
      }
  
      // Store user's data in sessionStorage
      sessionStorage.setItem("userId", data.UserId);
      sessionStorage.setItem("firstName", data.FirstName);
      sessionStorage.setItem("lastName", data.LastName);
      sessionStorage.setItem("userName", data.UserName);
      sessionStorage.setItem("email", data.Email);
      sessionStorage.setItem("middleName", data.MiddleName);
      sessionStorage.setItem("profilePhoto", data.ProfilePhoto);
  
      // Redirect to the dashboard
      navigate("/dashboard", { state: data });
    } catch (error) {
      console.error("Login Failed", error);
      setErrorMessage("Login Failed.");
    }
  };
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await fetch("/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(formData),
  //     });
  //     console.log(response);

  //     if (!response.ok) {
  //       throw new Error("Login Failed");
  //     }

  //     const data = await response.json();

  //     // Store user's first name and last name in sessionStorage
  //     sessionStorage.setItem("userId", data[0].UserId);
  //     sessionStorage.setItem("firstName", data[0].FirstName);
  //     sessionStorage.setItem("lastName", data[0].LastName);
  //     sessionStorage.setItem("userName", data[0].UserName);
  //     sessionStorage.setItem("email", data[0].Email);
  //     sessionStorage.setItem("middleName", data[0].MiddleName);
  //     sessionStorage.setItem("profilePhoto", data[0].ProfilePhoto);

  //     console.log('this');
  //     console.log(data);


  //     navigate("/dashboard", { state: data[0] });
  //   } catch (error) {
  //     console.error("Login Failed", error);
  //     setErrorMessage("Login Failed.");
  //   }
  // };
  
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
                      type="email"
                      className="form-control form-control-user"
                      id="Email"
                      aria-describedby="emailHelp"
                      placeholder="Enter Email Address..."
                      onChange={handleChange}
                      value={formData.Email}
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
                  {/* <div className="form-group">
                                    <div className="custom-control custom-checkbox small">
                                        <input type="checkbox" className="custom-control-input" id="customCheck" />
                                        <label className="custom-control-label" htmlFor="customCheck">Remember Me</label>
                                    </div>
                                </div> */}

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;