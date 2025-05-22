import React, { useState } from 'react';
import image from '../../Assets/LoginBackground.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../../Styles/Login.css';
import logo1 from '../../Assets/Social Media/image 78.png';
import logo2 from '../../Assets/Social Media/image 79.png';
import logo3 from '../../Assets/Social Media/image.png';
import Nav from '../common/Nav';
import { useEffect } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Service/BaseUrl';
function AdminLogin() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        userid: '',
        password: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'visible';
        };
    }, []);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        axiosInstance.post('/adminlogin', formData)
            .then((result) => {
                console.log(result);

                const { data } = result;

                if (data.msg == "Login Successful") {
                    toast.success('Login Successfully')
                    setTimeout(() => navigate('/AdminDashBord'), 2000); 
                    
                } else if (data.msg === "Password Mismatch") {
                    toast.error('Incorrect password');
                } else if (data.msg === "invalid User") {
                    toast.error('Invalid User ID');
                } else {
                    toast.error(data.msg || 'Login failed. Please try again.');
                }
            })
            .catch((err) => {
                console.error('Login error:', err);
                toast.error('Login failed. Please try again.');
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
                    <h1 className='login-title' style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Admin Login</h1>
                    {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                    <div className='form-group'>
                        <label htmlFor="userid" className='form-label' style={{ fontSize: '0.85rem' }}>Email</label>
                        <TextField
                            id="userid"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className='form-input'
                            size="small"
                            value={formData.userid}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="password" className='form-label' style={{ fontSize: '0.85rem' }}>Password</label>
                        <TextField
                            id="password"
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className='form-input'
                            size="small"
                            value={formData.password}
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
                    </div>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        className='login-button'
                        onClick={handleSubmit}
                    >
                        Login
                    </Button>

                </div>
            </div>

            <div className='login-image-container'>
                <img src={image} alt="Login visual" className='login-image' style={{ height: '100vh', marginBottom: '80px', marginLeft: '-120px' }} />
            </div>
        </div>
    );
}

export default AdminLogin;