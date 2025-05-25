import React, { useState } from 'react';
import {
    Button,
    TextField,
    FormLabel,
    InputAdornment,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../../Styles/DonerRegistration.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Nav from '../common/Nav';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../Service/BaseUrl';

function DonerRegistration() {
    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state || {};

    const [ProfilePhoto, setProfilePhoto] = useState(formData.ProfilePhoto || null);
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const keralaDistricts = [
        'Alappuzha',
        'Ernakulam',
        'Idukki',
        'Kannur',
        'Kasaragod',
        'Kollam',
        'Kottayam',
        'Kozhikode',
        'Malappuram',
        'Palakkad',
        'Pathanamthitta',
        'Thiruvananthapuram',
        'Thrissur',
        'Wayanad'
    ];

    const [doner, setDoner] = useState({
        FullName: formData.FullName || '',
        Email: formData.Email || '',
        Password: formData.Password || '',
        PhoneNo: formData.PhoneNo || '',
        Address: '',
        Pincode: '',
        District: '',
        City: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoner(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        if (submitError) {
            setSubmitError('');
        }
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        const validateName = (name) => /^[A-Za-z\s]+$/.test(name);
        const validatePhone = (phone) => /^[1-9]\d{9}$/.test(phone);
        const validatePincode = (pin) => /^[1-9]\d{5}$/.test(pin);
        const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const validateAddress = (address) => address.trim().length > 10;

        if (!doner.FullName.trim()) {
            newErrors.FullName = 'Full Name is required';
            valid = false;
        } else if (!validateName(doner.FullName)) {
            newErrors.FullName = 'Only alphabets and spaces allowed';
            valid = false;
        }

        if (!doner.Email || !validateEmail(doner.Email)) {
            newErrors.Email = 'Valid Email required';
            valid = false;
        }

        if (!doner.Password || doner.Password.length < 6) {
            newErrors.Password = 'Password must be at least 6 characters';
            valid = false;
        }

        if (!doner.PhoneNo || !validatePhone(doner.PhoneNo)) {
            newErrors.PhoneNo = 'Valid Phone Number required';
            valid = false;
        }

        if (!doner.Address || !validateAddress(doner.Address)) {
            newErrors.Address = 'Address must be at least 10 characters';
            valid = false;
        }

        if (!doner.Pincode || !validatePincode(doner.Pincode)) {
            newErrors.Pincode = 'Valid 6-digit Pincode required';
            valid = false;
        }

        if (!doner.District) {
            newErrors.District = 'District is required';
            valid = false;
        }

        if (!doner.City.trim()) {
            newErrors.City = 'City is required';
            valid = false;
        } else if (!validateName(doner.City)) {
            newErrors.City = 'Only alphabets and spaces allowed';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (e) => e.preventDefault();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitError('');

        const formDataToSend = new FormData();
        if (ProfilePhoto) formDataToSend.append('ProfilePhoto', ProfilePhoto);
        formDataToSend.append('FullName', doner.FullName);
        formDataToSend.append('Email', doner.Email);
        formDataToSend.append('Password', doner.Password);
        formDataToSend.append('PhoneNo', doner.PhoneNo);
        formDataToSend.append('Address', doner.Address);
        formDataToSend.append('Pincode', doner.Pincode);
        formDataToSend.append('District', doner.District);
        formDataToSend.append('City', doner.City);

        axiosInstance.post('/UserRegistration', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                toast.success('Registration Successfully')
                setTimeout(() => navigate('/UserLogin'), 2000); 
            })
            .catch(error => {
                console.log(error);
                
                if (error.response) {
                    setTimeout(() => navigate('/register'), 2000);

                    const { data } = error.response;
                    if (data.message === 'Email already exists') {
                        toast.error('This email is already registered');
                    } else if (data.message === 'Phone number already exists') {
                        toast.error('This phone number is already registered');
                    } else {
                        toast.error(data.message || 'Registration failed. Please try again.');
                    }
                } else {
                    toast.error('Network error. Please check your connection and try again.');
                }
            });
    };

    return (
        <div>
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

            <Nav />
            <div className='main-User-reg-container'>
                <div className='doner-registration-container'>
                    <h2>Registration</h2>

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className='form-fields-container'>
                            <div className='left-side-inputs'>
                                <FormLabel className="req-form-label">Full Name</FormLabel>
                                <TextField
                                    fullWidth
                                    name='FullName'
                                    value={doner.FullName}
                                    onChange={handleChange}
                                    error={!!errors.FullName}
                                    helperText={errors.FullName}
                                    required
                                    inputProps={{ readOnly: !!formData.FullName }}
                                />

                                <FormLabel className="req-form-label">Email</FormLabel>
                                <TextField
                                    type="email"
                                    fullWidth
                                    name='Email'
                                    value={doner.Email}
                                    onChange={handleChange}
                                    error={!!errors.Email}
                                    helperText={errors.Email}
                                    required
                                    inputProps={{ readOnly: !!formData.Email }}
                                />

                                <FormLabel className="req-form-label">Password</FormLabel>
                                <TextField
                                    type={showPassword ? "text" : "password"}
                                    fullWidth
                                    name='Password'
                                    value={doner.Password}
                                    onChange={handleChange}
                                    error={!!errors.Password}
                                    helperText={errors.Password}
                                    required
                                    inputProps={{ readOnly: !!formData.Password }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                <FormLabel className="req-form-label">Phone Number</FormLabel>
                                <TextField
                                    fullWidth
                                    name='PhoneNo'
                                    value={doner.PhoneNo}
                                    onChange={handleChange}
                                    error={!!errors.PhoneNo}
                                    helperText={errors.PhoneNo}
                                    inputProps={{ maxLength: 10, readOnly: !!formData.PhoneNo }}
                                />
                            </div>

                            <div className='right-side-inputs'>
                                <FormLabel className="req-form-label">Address</FormLabel>
                                <TextField
                                    fullWidth
                                    name='Address'
                                    value={doner.Address}
                                    onChange={handleChange}
                                    error={!!errors.Address}
                                    helperText={errors.Address}
                                />

                                <FormLabel className="req-form-label">Pincode</FormLabel>
                                <TextField
                                    fullWidth
                                    name='Pincode'
                                    value={doner.Pincode}
                                    onChange={handleChange}
                                    error={!!errors.Pincode}
                                    helperText={errors.Pincode}
                                    inputProps={{ maxLength: 6 }}
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />

                                <FormLabel className="req-form-label">District</FormLabel>
                                <FormControl fullWidth error={!!errors.District}>
                                    <Select
                                        name="District"
                                        value={doner.District}
                                        onChange={handleChange}
                                        displayEmpty
                                        required
                                    >
                                        <MenuItem value="" disabled>
                                            Select District
                                        </MenuItem>
                                        {keralaDistricts.map((district) => (
                                            <MenuItem key={district} value={district}>
                                                {district}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.District && (
                                        <div style={{ color: '#f44336', fontSize: '0.75rem', margin: '3px 14px 0' }}>
                                            {errors.District}
                                        </div>
                                    )}
                                </FormControl>

                                <FormLabel className="req-form-label">City</FormLabel>
                                <TextField
                                    fullWidth
                                    name='City'
                                    value={doner.City}
                                    onChange={handleChange}
                                    error={!!errors.City}
                                    helperText={errors.City}
                                    onKeyPress={(e) => {
                                        if (!/^[a-zA-Z\s]*$/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 3, mb: 2 }}
                            className='doner-req-save'
                        >
                            Register
                        </Button>
                    </form>
                    <p style={{ textAlign: "center", marginBottom: "25px" }}>Already have account ? <Link to="/UserLogin" style={{ textDecoration: "none" }}>Signup</Link> </p>
                </div>
            </div>
        </div>
    );
}

export default DonerRegistration;