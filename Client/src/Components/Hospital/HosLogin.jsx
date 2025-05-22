import React, { useState } from 'react';
import image from '../../Assets/hosLogBg.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../../Styles/Login.css';
import Nav from '../common/Nav';
import { useEffect } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../Service/BaseUrl';
function HosLogin() {
    const navigate = useNavigate();
    const [login, setLogin] = useState({
        Email: '',
        Password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setLogin(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axiosInstance.post('/hospital-login', login)
            .then((result) => {
               
                if (result.data.message === "Login successful") {
                    localStorage.setItem('hospitalId',result.data.data._id)
                    console.log(result.data.data._id);
                    localStorage.setItem('Hospital', JSON.stringify(result.data.data));
                    toast.success('Login Successfully')
                    setTimeout(() => navigate('/Hospital-Dashboard'), 2000); 

                } else {
                    toast.error(result.data.message);
                } 
            })
            .catch((err) => {
                toast.error('An error occurred during login');
                console.error( err);
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
                    <h1 className='login-title' style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Hospital Login</h1>
                    <div className='form-group'>
                        <label htmlFor="username" className='form-label' style={{ fontSize: '0.85rem' }}>Email</label>
                        <TextField
                            id="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className='form-input'
                            size="small"
                            onChange={handleChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="password" className='form-label' style={{ fontSize: '0.85rem' }}>Password</label>
                        <TextField
                            id="Password"
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className='form-input'
                            size="small"
                            onChange={handleChange}
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
                        <Link className='forgot' to='/forgotPass'>Forgot Password</Link>
                    </div>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                        className='login-button'>
                        Login
                    </Button>
                    <span style={{ marginTop: '1rem', display: 'block', textAlign: 'center' }}>
                        <Link to='/register' style={{ color: "blue", textDecoration: "none" }}>New Registration ?</Link>

                    </span>

                </div>
            </div>

            <div className='login-image-container'>
                <img src={image} alt="Login visual" className='login-image' style={{ height: '80vh', marginBottom: '80px' }} />
            </div>
        </div>
    );
}

export default HosLogin;