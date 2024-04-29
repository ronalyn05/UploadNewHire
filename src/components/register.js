import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        LastName: '',
        FirstName: '',
        MiddleName: '',
        Email: '',
        UserName: '',
        Password: '',
        ConfirmPassword: '',
        Role: '' // New field for role
    });

    const [errorMessage, setErrorMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = [];
        if (!formData.FirstName.trim()) {
            errors.push('First Name is required');
        }
        if (!formData.LastName.trim()) {
            errors.push('Last Name is required');
        }
        if (!formData.MiddleName.trim()) {
            errors.push('Middle Name is required');
        }
        if (!formData.Email.trim()) {
            errors.push('Email is required');
        }
        if (!formData.UserName.trim()) {
            errors.push('User Name is required');
        }
        if (formData.Password.trim().length < 6) {
            errors.push('Password must be at least 6 characters long');
        }
        if (formData.Password !== formData.ConfirmPassword) {
            errors.push('Passwords do not match');
        }
        if (!formData.Role) {
            errors.push('Role selection is required');
        }

        if (errors.length > 0) {
            setErrorMessage(errors.join(', '));
            return;
        }

        try {
            const hashedPassword = await bcrypt.hash(formData.Password, 10);

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
                    Password: hashedPassword,
                    Role: formData.Role // Include role in the request
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

    return (
        <div className="bg-gradient-primary d-flex align-items-center justify-content-center min-vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="card o-hidden border-0 shadow-lg">
                            <div className="card-body p-5">
                                <div className="text-center">
                                    <img src="./img/hris-2.png" alt="Logo" className="logo" style={{ width: '200px', height: 'auto' }} />
                                </div>
                                <hr />
                                <div className="text-center" style={{ margin: "20px" }}>
                                    <img src="./img/add.png" alt="Add" className="add-image" style={{ width: "100px", height: "90px" }} />
                                </div>
                                <form className="user" onSubmit={handleSubmit}>
                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                            <input type="text" className="form-control form-control-user" id="FirstName" placeholder="First Name" onChange={handleChange} value={formData.FirstName} />
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="text" className="form-control form-control-user" id="LastName" placeholder="Last Name" onChange={handleChange} value={formData.LastName} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                            <input type="text" className="form-control form-control-user" id="MiddleName" placeholder="Middle Name" onChange={handleChange} value={formData.MiddleName} />
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="text" className="form-control form-control-user" id="UserName" placeholder="User Name" onChange={handleChange} value={formData.UserName} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input type="email" className="form-control form-control-user" id="Email" placeholder="Email Address" onChange={handleChange} value={formData.Email} />
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                            <input type="password" className="form-control form-control-user" id="Password" placeholder="Password" onChange={handleChange} value={formData.Password} />
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="password" className="form-control form-control-user" id="ConfirmPassword" placeholder="Confirm Password" onChange={handleChange} value={formData.ConfirmPassword} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="Role" className="mr-2">Role:</label>
                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                        {/* <label> */}
                                            <input type="radio" id="Role" value="employee" onChange={handleChange} checked={formData.Role === 'employee'} />
                                            Employee
                                            {/* </label> */}
                                            </div>
                                        {/* <div className="col-sm-6"> */}
                                        {/* <label className="ml-3"> */}
                                            <input type="radio" id="Role" value="hrAdmin" onChange={handleChange} checked={formData.Role === 'hrAdmin'} />
                                            HR-Admin
                                        {/* </label> */}
                                        {/* </div> */}
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
