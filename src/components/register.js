import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        LastName: '',
        FirstName: '',
        MiddleName: '',
        Email: '',
        UserName:'',
        Password:'',
        ConfirmPassword: ''
    }
        
    );

    const [errorMessage, setErrorMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if password and confirm password match
    if (formData.Password !== formData.ConfirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                LastName: formData.LastName,
                FirstName: formData.FirstName,
                MiddleName: formData.MiddleName,
                Email: formData.Email,
                UserName: formData.UserName,
                Password: formData.Password,
                // ProfilePhoto: '' // You can add this if needed
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to register user');
        }

        const data = await response.json();
        console.log(data); // Log the response from the server
        alert("Account successfully registered!");
        navigate("/");
    } catch (error) {
        console.error('Error registering user:', error);
        setErrorMessage('Failed to register user. Please try again later.');
    }
};


    // const handleSubmit = async (e) => {
    //     console.log("this");
    //     console.log(formData);
    //     e.preventDefault();
        
    //     // Check if password and confirm password match
    //     if (formData.Password !== formData.ConfirmPassword) {
    //         setErrorMessage('Passwords do not match');
    //         return;
    //     }

    //     try {
    //         const response = await fetch('/register', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(formData),
    //         });
    
    //         if (!response.ok) {
    //             throw new Error('Failed to register user');
    //         }
    
    //         const data = await response.json();
    //         console.log(data); // Log the response from the server
    //         alert("Account successfully registered!");
    //     // Navigate to login.js
    //     navigate("/");
    //         // Reset form fields after successful registration
    //         // setFormData({
    //         //     UserName: '',
    //         //     LastName: '',
    //         //     FirstName: '',
    //         //     MiddleName: '',
    //         //     Email: '',
    //         //     Password: '',
    //         //     ConfirmPassword: ''
    //         // });
    //         // setErrorMessage(null); // Clear any previous error message
    //     } catch (error) {
    //         console.error('Error registering user:', error);
    //         setErrorMessage('Failed to register user. Please try again later.');
    //     }
    // };

    return (
        <div className="bg-gradient-primary d-flex align-items-center justify-content-center min-vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="card o-hidden border-0 shadow-lg">
                            <div className="card-body p-5">
                                <div className="text-center">
                                    <img src="./img/hris-2.png" alt="Logo" className="logo" style={{ width: '200px', height: 'auto' }}/>
                                </div>
                                <hr />
                                <div className="text-center" style={{ margin: "20px" }}>
                                    <img src="./img/add.png" alt="Add" className="add-image" style={{ width: "100px", height: "90px" }} />
                                </div>
                                <form className="user" onSubmit={handleSubmit}>
                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                            <input type="text" className="form-control form-control-user" id="FirstName" placeholder="First Name" onChange={handleChange} value={formData.FirstName}/>
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="text" className="form-control form-control-user" id="LastName" placeholder="Last Name" onChange={handleChange} value={formData.LastName}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                            <input type="text" className="form-control form-control-user" id="MiddleName" placeholder="Middle Name" onChange={handleChange} value={formData.MiddleName}/>
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="text" className="form-control form-control-user" id="UserName" placeholder="User Name" onChange={handleChange} value={formData.UserName}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input type="email" className="form-control form-control-user" id="Email" placeholder="Email Address" onChange={handleChange} value={formData.Email}/>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                            <input type="password" className="form-control form-control-user" id="Password" placeholder="Password" onChange={handleChange} value={formData.Password}/>
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="password" className="form-control form-control-user" id="ConfirmPassword" placeholder="Confirm Password" onChange={handleChange} value={formData.ConfirmPassword}/>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <div className="col-md-6 d-flex justify-content-center">
                                            <button type="submit" className="btn btn-primary btn-user btn-block">Register</button>
                                        </div>
                                    </div>
                                </form>
                                {/* Error message */}
                                {errorMessage && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <hr />
                                <div className="text-center">
                                    <Link className="small" to="/forgotpassword">Forgot Password?</Link>
                                </div>
                                <div className="text-center">
                                    <Link className="small" to="/">Already have an Account? Login!</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;