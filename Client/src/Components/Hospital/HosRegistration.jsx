import React, { useState } from 'react';
import {
    Button,
    TextField,
    FormLabel,
} from '@mui/material';
import '../../Styles/DonerRegistration.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Nav from '../common/Nav';

function HosRegistration() {
    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state || {};

    const [hospital, setHospital] = useState({
        ProfilePhoto: formData.ProfilePhoto || '',
        FullName: formData.FullName || '',
        RegistrationNumber: formData.RegistrationNumber || '',
        PhoneNo: formData.PhoneNo || '',
        Email: formData.Email || '',
        Address: formData.Address || '',
        Street: formData.Street || '',
        City: formData.City || '',
        Pincode: formData.Pincode || '',
        Password: formData.Password || ''
    });

    const [errors, setErrors] = useState({
        FullName: '',
        RegistrationNumber: '',
        PhoneNo: '',
        Email: '',
        Address: '',
        Street: '',
        City: '',
        Pincode: '',
        Password: ''
    });

    const validatePhoneNumber = (phone) => {
        return /^[1-9]\d{9}$/.test(phone);
    };

    const validatePincode = (pincode) => {
        return /^[1-9]\d{5}$/.test(pincode);
    };

    const validateRegistrationNumber = (regNo) => {
        return /^[A-Za-z0-9]{8,15}$/.test(regNo);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if ((name === 'PhoneNo' && value.length > 10) || 
            (name === 'Pincode' && value.length > 6)) {
            return;
        }
        
        setHospital(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { ...errors };

        if (!hospital.FullName.trim()) {
            newErrors.FullName = 'Hospital Name is required';
            valid = false;
        } else if (hospital.FullName.trim().length < 3) {
            newErrors.FullName = 'Name should be at least 3 characters';
            valid = false;
        }

        if (!hospital.RegistrationNumber) {
            newErrors.RegistrationNumber = 'Registration Number is required';
            valid = false;
        } else if (!validateRegistrationNumber(hospital.RegistrationNumber)) {
            newErrors.RegistrationNumber = 'Invalid registration number format (8-15 alphanumeric characters)';
            valid = false;
        }

        if (!hospital.PhoneNo) {
            newErrors.PhoneNo = 'Contact Number is required';
            valid = false;
        } else if (!validatePhoneNumber(hospital.PhoneNo)) {
            newErrors.PhoneNo = 'Phone Number must be 10 digits and not start with 0';
            valid = false;
        }

        if (!hospital.Email) {
            newErrors.Email = 'Email is required';
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hospital.Email)) {
            newErrors.Email = 'Invalid email format';
            valid = false;
        }

        if (!hospital.Address) {
            newErrors.Address = 'Address is required';
            valid = false;
        }

        if (!hospital.Street) {
            newErrors.Street = 'Street is required';
            valid = false;
        }

        if (!hospital.City) {
            newErrors.City = 'City is required';
            valid = false;
        }

        if (!hospital.Pincode) {
            newErrors.Pincode = 'Pincode is required';
            valid = false;
        } else if (!validatePincode(hospital.Pincode)) {
            newErrors.Pincode = 'Pincode must be 6 digits and not start with 0';
            valid = false;
        }

        if (!hospital.Password) {
            newErrors.Password = 'Password is required';
            valid = false;
        } else if (hospital.Password.length < 6) {
            newErrors.Password = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            navigate('/hospitalInfo', { state: hospital });
        }
    };

    return (
        <div>
            <Nav />
            <div className='main-hos-reg-container'>
                <div className='doner-registration-container'>
                    <h2>Hospital Registration</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='form-fields-container'>
                            <div className='left-side-inputs'>
                                <FormLabel component="label" className="req-form-label">Hospital Name</FormLabel>
                                <TextField
                                    name="FullName"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={hospital.FullName}
                                    onChange={handleChange}
                                    error={!!errors.FullName}
                                    helperText={errors.FullName}
                                    inputProps={{
                                        readOnly: !!formData.FullName
                                    }}
                                />

                                <FormLabel component="label" className="req-form-label">Registration Number</FormLabel>
                                <TextField
                                    name="RegistrationNumber"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={hospital.RegistrationNumber}
                                    onChange={handleChange}
                                    error={!!errors.RegistrationNumber}
                                    helperText={errors.RegistrationNumber}
                                    placeholder="Enter registration number"
                                    inputProps={{ maxLength: 15 }}

                                />

                                <FormLabel component="label" className="req-form-label">Contact Number</FormLabel>
                                <TextField
                                    name="PhoneNo"
                                    type="tel"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={hospital.PhoneNo}
                                    onChange={handleChange}
                                    error={!!errors.PhoneNo}
                                    helperText={errors.PhoneNo}
                                    inputProps={{
                                        maxLength: 10,
                                        readOnly: !!formData.PhoneNo
                                    }}
                                />

                                <FormLabel component="label" className="req-form-label">Email id</FormLabel>
                                <TextField
                                    name="Email"
                                    type="email"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={hospital.Email}
                                    onChange={handleChange}
                                    error={!!errors.Email}
                                    helperText={errors.Email}
                                    inputProps={{
                                        readOnly: !!formData.Email
                                    }}
                                />
                            </div>

                            <div className='right-side-inputs'>
                                <FormLabel component="label" className="req-form-label">Address</FormLabel>
                                <TextField
                                    name="Address"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={hospital.Address}
                                    onChange={handleChange}
                                    error={!!errors.Address}
                                    helperText={errors.Address}
                                />

                                <FormLabel component="label" className="req-form-label">Street</FormLabel>
                                <TextField
                                    name="Street"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={hospital.Street}
                                    onChange={handleChange}
                                    error={!!errors.Street}
                                    helperText={errors.Street}
                                    onKeyPress={(e) => {
                                        if (!/^[a-zA-Z\s]*$/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />

                                <FormLabel component="label" className="req-form-label">City</FormLabel>
                                <TextField
                                    name="City"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={hospital.City}
                                    onChange={handleChange}
                                    error={!!errors.City}
                                    helperText={errors.City}
                                    onKeyPress={(e) => {
                                        if (!/^[a-zA-Z\s]*$/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />

                                <FormLabel component="label" className="req-form-label">Pincode</FormLabel>
                                <TextField
                                    name="Pincode"
                                    type="tel"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={hospital.Pincode}
                                    onChange={handleChange}
                                    error={!!errors.Pincode}
                                    helperText={errors.Pincode}
                                    placeholder="000000"
                                    inputProps={{ maxLength: 6 }}
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <Button
                            variant="contained"
                            className='doner-req-save'
                            type="submit"
                            fullWidth
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Next
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default HosRegistration;