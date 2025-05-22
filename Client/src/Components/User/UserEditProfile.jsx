import React, { useState } from 'react';
import {
    Button,
    Box,
    Typography,
    TextField,
    Avatar
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import '../../Styles/EditHospital.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import UserNav from './UserNav';
import UserSideMenu from './UserSideMenu';
import axiosInstance from '../Service/BaseUrl';
import {baseUrl} from '../../baseUrl';

function UserEditProfile() {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('User') || '{}');
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [formData, setFormData] = useState({
        FullName: userData.FullName || '',
        PhoneNo: userData.PhoneNo || '',
        Email: userData.Email || '',
        Address: userData.Address || '',
        City: userData.City || '',
        District: userData.District || '',
        Pincode: userData.Pincode || '',
    });

    const [errors, setErrors] = useState({
        FullName: '',
        PhoneNo: '',
        Email: '',
        City: '',
        District: '',
        Pincode: ''
    });

    const validateEmail = (email) => {
        if (!email) return 'Email is required';
        if (email.length > 254) return 'Email too long (max 254 chars)';
        
        const parts = email.split('@');
        if (parts.length !== 2) return 'Invalid email format (must contain one @)';
        
        const [local, domain] = parts;
        
        if (local.length > 64) return 'Local part too long (max 64 chars)';
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) {
            return 'Invalid characters in local part';
        }
        if (local.startsWith('.') || local.endsWith('.')) {
            return 'Local part cannot start or end with a dot';
        }
        if (local.includes('..')) return 'Local part cannot have consecutive dots';
        if (local.startsWith('"') && local.endsWith('"')) {
            if (local.length === 1) return 'Invalid quoted local part';
        }
        
        if (domain.length > 253) return 'Domain part too long (max 253 chars)';
        if (!/^[a-zA-Z0-9.-]+$/.test(domain)) return 'Invalid characters in domain';
        if (domain.startsWith('-') || domain.endsWith('-')) {
            return 'Domain cannot start or end with a hyphen';
        }
        if (domain.includes('..')) return 'Domain cannot have consecutive dots';
        
        const domainParts = domain.split('.');
        if (domainParts.length < 2) return 'Domain must contain a dot';
        
        const tld = domainParts[domainParts.length - 1];
        if (tld.length < 2) return 'TLD must be at least 2 characters';
        if (!/^[a-zA-Z]{2,}$/.test(tld)) return 'Invalid top-level domain';
        
        if (/^\d+$/.test(tld)) return 'Numeric TLD is not allowed';
        
        return '';
    };

    const validateField = (name, value) => {
        let error = '';
        
        switch (name) {
            case 'FullName':
                if (!value.trim()) {
                    error = 'Full name is required';
                } else if (!/^[a-zA-Z ]+$/.test(value)) {
                    error = 'Only letters and spaces allowed';
                } else if (value.length > 50) {
                    error = 'Name too long (max 50 characters)';
                }
                break;
            case 'PhoneNo':
                if (!value) {
                    error = 'Phone number is required';
                } else if (!/^[0-9]{10}$/.test(value)) {
                    error = '10-digit number required';
                }
                break;
            case 'Email':
                error = validateEmail(value);
                break;
            case 'City':
            case 'District':
                if (!value.trim()) {
                    error = `${name} is required`;
                } else if (!/^[a-zA-Z ]+$/.test(value)) {
                    error = 'Only letters and spaces allowed';
                } else if (value.length > 50) {
                    error = `${name} name too long (max 50 characters)`;
                }
                break;
            case 'Pincode':
                if (!value) {
                    error = 'Pincode is required';
                } else if (!/^[0-9]{6}$/.test(value)) {
                    error = '6-digit number required';
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
            formDataToSend.append('id', userData._id);

            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            if (profileImageFile) {
                formDataToSend.append('ProfilePhoto', profileImageFile);
            }

            const response = await axiosInstance.post('/EditUserdata', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.message === "Profile updated successfully") {
                toast.success(response.data.message);

                localStorage.setItem('User', JSON.stringify(response.data.user));
                setTimeout(() => navigate('/user-profile'), 2000); 

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

            <UserNav />
            <Box className="sidemenu">
                <UserSideMenu />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        User Profile
                    </Typography>
                    <Typography variant="h5" className="sub-title">
                        Edit User Profile
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
                                userData.ProfilePhoto?.path ?
                                    `${baseUrl}${userData.ProfilePhoto.filename}` : ''}
                            sx={{
                                width: 120,
                                height: 120,
                                marginBottom: 2
                            }}
                            alt="User Profile"
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
                            <h5>Full Name
                                <TextField
                                    className="edit-input"
                                    name="FullName"
                                    value={formData.FullName}
                                    onChange={handleChange}
                                    error={!!errors.FullName}
                                    helperText={errors.FullName}
                                    inputProps={{ maxLength: 50 }}
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

                            <h5>Email
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

                            <h5>City
                                <TextField
                                    className="edit-input"
                                    name="City"
                                    value={formData.City}
                                    onChange={handleChange}
                                    error={!!errors.City}
                                    helperText={errors.City}
                                    inputProps={{ maxLength: 50 }}
                                />
                            </h5>

                            <h5>District
                                <TextField
                                    className="edit-input"
                                    name="District"
                                    value={formData.District}
                                    onChange={handleChange}
                                    error={!!errors.District}
                                    helperText={errors.District}
                                    inputProps={{ maxLength: 50 }}
                                />
                            </h5>

                            <h5>Pincode
                                <TextField
                                type='number'
                                    className="edit-input"
                                    name="Pincode"
                                    value={formData.Pincode}
                                    onChange={handleChange}
                                    error={!!errors.Pincode}
                                    helperText={errors.Pincode}
                                    inputProps={{ maxLength: 6 }}
                                />
                            </h5>

                            <div className='hospital-action'>
                                <Button
                                    variant="contained"
                                    fullWidth
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

export default UserEditProfile;