import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import image from '../../Assets/image9.png';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../../Styles/Login.css';
import Nav from '../common/Nav';
import { useEffect } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DonerLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        Email: '',
        Password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        axios.post('http://localhost:4005/donerlogin', {
            Email: formData.Email,
            Password: formData.Password
        })
            .then(response => {
                console.log(response);

                if (response.data.message === "Login successful") {
                    localStorage.setItem('Doner', JSON.stringify(response.data.data));
toast.success('Login Successfully')
setTimeout(() => navigate('/doner-dashboard'), 2000); 

                } else if (response.data.message === "Password Mismatch") {
                    toast.error('Incorrect password');
                } else if (response.data.message === "invalid User") {
                    toast.error('Invalid Email');
                } else {
                    toast.error(response.data.message || 'Login failed. Please try again.');
                }
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'An error occurred during login');
                console.error('Login error:', err);
            });
    };

    return (
        <div className='main-login-container' style={{ overflow: 'hidden' }}>
            <Nav />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                style={{ marginTop: "80px" }}
            />

            <div className='login-form-container'>
                <div className='form-background-overlay'></div>
                <div className='form-content'>
                    <h1 className='login-title' style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Login</h1>

                    {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label htmlFor="username" className='form-label' style={{ fontSize: '0.85rem' }}>Email</label>
                            <TextField
                                id="Email"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                className='form-input'
                                size="small"
                                value={formData.Email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor="Password" className='form-label' style={{ fontSize: '0.85rem' }}>Password</label>
                            <TextField
                                id="Password"
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                className='form-input'
                                size="small"
                                value={formData.Password}
                                onChange={handleInputChange}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                                size="small"
                                            >
                                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Link className='forgot' to='/forgotPass-doner'>Forgot Password</Link>

                        </div>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            className='login-button'>
                            Login
                        </Button>
                    </form>
                    <span style={{ marginTop: '1rem', display: 'block', textAlign: 'center' }}>
                        <Link to='/register' style={{ color: "blue", textDecoration: "none" }}>New Registration ?</Link>

                    </span>
                </div>
            </div>

            <div className='login-image-container'>
                <img src={image} alt="Login visual" className='login-image' style={{ maxHeight: '70vh' }} />
            </div>
        </div>
    );
}

export default DonerLogin;