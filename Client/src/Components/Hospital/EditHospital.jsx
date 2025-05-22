import React, { useState } from 'react';
import {
    Button,
    Box,
    Typography,
    TextField,
    Avatar,
    FormHelperText
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import HosNav from './HosNav';
import HosSidemenu from './HosSidemenu';
import '../../Styles/EditHospital.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Service/BaseUrl';
import {baseUrl} from '../../baseUrl';

function EditHospital() {
    const navigate = useNavigate();
    const hospitalData = JSON.parse(localStorage.getItem('Hospital') || '{}');
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [formData, setFormData] = useState({
        FullName: hospitalData.FullName || '',
        RegistrationNumber: hospitalData.RegistrationNumber || '',
        PhoneNo: hospitalData.PhoneNo || '',
        Email: hospitalData.Email || '',
        Street: hospitalData.Street || '',
        City: hospitalData.City || '',
        Pincode: hospitalData.Pincode || '',
        Address: hospitalData.Address || '',
        OpeningTime: hospitalData.OpeningTime || '',
        ClosingTime: hospitalData.ClosingTime || '',
    });

    const [errors, setErrors] = useState({
        FullName: '',
        RegistrationNumber: '',
        PhoneNo: '',
        Email: '',
        Street: '',
        City: '',
        Pincode: '',
        OpeningTime: '',
        ClosingTime: ''
    });

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'FullName':
                if (!/^[a-zA-Z ]+$/.test(value)) {
                    error = 'Only letters and spaces allowed';
                }
                break;
            case 'PhoneNo':
                if (!/^[0-9]{10}$/.test(value)) {
                    error = '10-digit number required';
                }
                break;
            case 'Email':
                if (!value) {
                    error = 'Email is required';
                } else if (value.length > 254) {
                    error = 'Email too long (max 254 chars)';
                } else {
                    const emailParts = value.split('@');
                    if (emailParts.length !== 2) {
                        error = 'Invalid email format (must contain one @)';
                    } else {
                        const [localPart, domainPart] = emailParts;

                        if (localPart.length > 64) {
                            error = 'Local part too long (max 64 chars)';
                        } else if (/^\./.test(localPart) || /\.$/.test(localPart)) {
                            error = 'Email cannot start or end with a dot';
                        } else if (/\.{2,}/.test(localPart)) {
                            error = 'Multiple dots not allowed in local part';
                        } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(localPart)) {
                            error = 'Invalid characters in local part';
                        }

                        else if (domainPart.length > 253) {
                            error = 'Domain part too long (max 253 chars)';
                        } else if (/\.{2,}/.test(domainPart)) {
                            error = 'Multiple dots not allowed in domain';
                        } else if (!/^[a-zA-Z0-9.-]+$/.test(domainPart)) {
                            error = 'Invalid characters in domain';
                        } else if (!/\./.test(domainPart)) {
                            error = 'Domain must contain a dot';
                        } else if (/^-/.test(domainPart) || /-$/.test(domainPart)) {
                            error = 'Domain cannot start or end with a hyphen';
                        } else if (!/\.[a-zA-Z]{2,}$/.test(domainPart)) {
                            error = 'Invalid top-level domain';
                        }
                    }
                }
                break;
            case 'Street':
                if (!/^[a-zA-Z0-9 ]+$/.test(value)) {
                    error = 'Only alphanumeric characters allowed';
                }
                break;
            case 'City':
                if (!/^[a-zA-Z ]+$/.test(value)) {
                    error = 'Only letters and spaces allowed';
                }
                break;
            case 'Pincode':
                if (!/^[0-9]{6}$/.test(value)) {
                    error = '6-digit number required';
                }
                break;
            case 'OpeningTime':
            case 'ClosingTime':
                if (value && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
                    error = 'Use HH:MM 24-hour format';
                }
                break;
            default:
                break;
        }

        setErrors(prev => ({ ...prev, [name]: error }));
        return error === '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        validateField(name, value);
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImageFile(e.target.files[0]);
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        Object.entries(formData).forEach(([key, value]) => {
            if (key !== 'Address' && !validateField(key, value)) {
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the validation errors');
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('id', hospitalData._id);

            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            if (profileImageFile) {
                formDataToSend.append('ProfilePhoto', profileImageFile);
            }

            const response = await axiosInstance.post('/hosEditProfile', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.message === "Profile updated successfully") {
                setTimeout(() => navigate('/hosProfile'), 2000); 

                toast.success(response.data.message);
                localStorage.setItem('Hospital', JSON.stringify(response.data.hospital));
            } else {
                toast.error(response.data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'An error occurred while updating the profile');
        }
    };

    return (
        <Box className="main-container">
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

            <HosNav />
            <Box className="sidemenu">
                <HosSidemenu />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Hospital Profile
                    </Typography>
                    <Typography variant="h5" className="sub-title">
                        Hospital Edit Profile
                    </Typography>

                    <Box className="profile-image-container" sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 3
                    }}>
                        <Avatar
                            src={profileImageFile ?
                                URL.createObjectURL(profileImageFile) :
                                hospitalData.ProfilePhoto?.filename ?
                                    `${baseUrl}${hospitalData.ProfilePhoto.filename}` : ''}
                            sx={{
                                width: 120,
                                height: 120,
                                marginBottom: 2
                            }}
                            alt="Hospital Profile"
                        />
                        <input
                            accept="image/*"
                            id="profile-image-upload"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                        <label htmlFor="profile-image-upload">
                            <Button
                                variant="contained"
                                component="span"
                                startIcon={<PhotoCamera />}
                            >
                                Change Photo
                            </Button>
                        </label>
                    </Box>

                    <Box className="content-box-hos" component="form" onSubmit={handleSubmit}>
                        <div className='edit-feilds'>
                            <h5>Hospital Name
                                <TextField
                                    className="edit-input"
                                    name="FullName"
                                    value={formData.FullName}
                                    onChange={handleChange}
                                    error={!!errors.FullName}
                                    helperText={errors.FullName}
                                />
                            </h5>
                            <h5>Registration Number
                                <TextField
                                    className="edit-input"
                                    name="RegistrationNumber"
                                    value={formData.RegistrationNumber}
                                    onChange={handleChange}
                                />
                            </h5>
                            <h5>Contact Number
                                <TextField
                                    className="edit-input"
                                    name="PhoneNo"
                                    value={formData.PhoneNo}
                                    onChange={handleChange}
                                    error={!!errors.PhoneNo}
                                    helperText={errors.PhoneNo}
                                    inputProps={{ maxLength: 10 }}
                                />
                            </h5>
                            <h5>Email id
                                <TextField
                                    className="edit-input"
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    type="email"
                                    error={!!errors.Email}
                                    helperText={errors.Email}
                                />
                            </h5>
                            <h5>Address
                                <TextField
                                    className="edit-input"
                                    name="Address"
                                    value={formData.Address}
                                    onChange={handleChange}
                                />
                            </h5>
                            <h5>Street
                                <TextField
                                    className="edit-input"
                                    name="Street"
                                    value={formData.Street}
                                    onChange={handleChange}
                                    error={!!errors.Street}
                                    helperText={errors.Street}
                                />
                            </h5>
                            <h5>City
                                <TextField
                                    className="edit-input"
                                    name="City"
                                    value={formData.City}
                                    onChange={handleChange}
                                    error={!!errors.City}
                                    helperText={errors.City}
                                />
                            </h5>
                            <h5>Pincode
                                <TextField
                                    className="edit-input"
                                    name="Pincode"
                                    value={formData.Pincode}
                                    onChange={handleChange}
                                    error={!!errors.Pincode}
                                    helperText={errors.Pincode}
                                    inputProps={{ maxLength: 6 }}
                                />
                            </h5>
                            <h5>Opening Time
                                <TextField
                                    className="edit-input"
                                    name="OpeningTime"
                                    value={formData.OpeningTime}
                                    onChange={handleChange}
                                    placeholder="HH:MM"
                                    error={!!errors.OpeningTime}
                                    helperText={errors.OpeningTime}
                                />
                            </h5>
                            <h5>Closing Time
                                <TextField
                                    className="edit-input"
                                    name="ClosingTime"
                                    value={formData.ClosingTime}
                                    onChange={handleChange}
                                    placeholder="HH:MM"
                                    error={!!errors.ClosingTime}
                                    helperText={errors.ClosingTime}
                                />
                            </h5>

                            <div className='hospital-action'>
                                <Button
                                    variant="contained"
                                    style={{ width: "100%", marginTop: "35px" }}
                                    type="submit"
                                    size="large"
                                >
                                    Update Profile
                                </Button>
                            </div>
                        </div>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default EditHospital;