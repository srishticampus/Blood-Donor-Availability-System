import React, { useState } from 'react';
import {
    Button,
    TextField,
    MenuItem,
    FormControl,
    Radio,
    Select,
    ListItemText,
    FormLabel,
    InputAdornment,
    IconButton,
    FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../../Styles/DonerRegistration.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Nav from '../common/Nav';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../Service/BaseUrl';

function DonerRegistration() {
    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state || {};

    const [ProfilePhoto, setProfilePhoto] = useState(formData.ProfilePhoto || null);
    console.log(ProfilePhoto);

    const [doner, setDoner] = useState({
        ProfilePhoto: ProfilePhoto,
        FullName: formData.FullName || '',
        DateOfBirth: '',
        Email: formData.Email || '',
        Password: formData.Password || '',
        AadharNumber: '',
        Gender: '',
        PhoneNo: formData.PhoneNo || '',
        Pincode: '',
        District: '',
        City: ''
    });

    const [errors, setErrors] = useState({
        FullName: '',
        DateOfBirth: '',
        Email: '',
        Password: '',
        AadharNumber: '',
        Gender: '',
        PhoneNo: '',
        Pincode: '',
        District: '',
        City: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    const districtOptions = [
        { value: 'Thiruvananthapuram', label: 'Thiruvananthapuram' },
        { value: 'Kollam', label: 'Kollam' },
        { value: 'Pathanamthitta', label: 'Pathanamthitta' },
        { value: 'Alappuzha', label: 'Alappuzha' },
        { value: 'Kottayam', label: 'Kottayam' },
        { value: 'Idukki', label: 'Idukki' },
        { value: 'Ernakulam', label: 'Ernakulam' },
        { value: 'Thrissur', label: 'Thrissur' },
        { value: 'Palakkad', label: 'Palakkad' },
        { value: 'Malappuram', label: 'Malappuram' },
        { value: 'Kozhikode', label: 'Kozhikode' },
        { value: 'Wayanad', label: 'Wayanad' },
        { value: 'Kannur', label: 'Kannur' },
        { value: 'Kasaragod', label: 'Kasaragod' }
    ];

    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' }
    ];

    const validateName = (name) => /^[A-Za-z\s]+$/.test(name);
    const validatePhoneNumber = (phone) => /^[1-9]\d{9}$/.test(phone);
    const validatePincode = (pincode) => /^[1-9]\d{5}$/.test(pincode);
    const validateAadhar = (aadhar) => /^[2-9]\d{11}$/.test(aadhar);
    const validateCity = (city) => /^[A-Za-z\s]+$/.test(city);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'FullName') {
            if (value === '' || validateName(value)) {
                setDoner(prev => ({ ...prev, [name]: value }));
            }
        } else if (name === 'PhoneNo') {
            if (value === '' || /^\d{0,10}$/.test(value)) {
                setDoner(prev => ({ ...prev, [name]: value }));
            }
        } else if (name === 'Pincode') {
            if (value === '' || /^\d{0,6}$/.test(value)) {
                setDoner(prev => ({ ...prev, [name]: value }));
            }
        } else if (name === 'AadharNumber') {
            if (value === '' || /^\d{0,12}$/.test(value)) {
                setDoner(prev => ({ ...prev, [name]: value }));
            }
        } else if (name === 'City') {
            if (value === '' || validateCity(value)) {
                setDoner(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setDoner(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { ...errors };

        if (!doner.FullName.trim()) {
            newErrors.FullName = 'Full Name is required';
            valid = false;
        } else if (!validateName(doner.FullName)) {
            newErrors.FullName = 'Only alphabets and spaces are allowed';
            valid = false;
        } else if (doner.FullName.trim().length < 3) {
            newErrors.FullName = 'Name should be at least 3 characters';
            valid = false;
        }

        if (!doner.DateOfBirth) {
            newErrors.DateOfBirth = 'Date of Birth is required';
            valid = false;
        } else {
            const selectedDate = new Date(doner.DateOfBirth);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // In the DateOfBirth validation block within validateForm()
            if (selectedDate > today) {
                newErrors.DateOfBirth = 'Date of Birth cannot be in the future';
                valid = false;
            }

            let age = today.getFullYear() - selectedDate.getFullYear();
            const monthDiff = today.getMonth() - selectedDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
                age--;
            }

            if (age < 18) {
                newErrors.DateOfBirth = 'You must be at least 18 years old';
                valid = false;
            } else if (age > 65) {  
                newErrors.DateOfBirth = 'You must be 65 years old or younger';
                valid = false;
            }
        }

        if (!doner.Email) {
            newErrors.Email = 'Email is required';
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(doner.Email)) {
            newErrors.Email = 'Invalid email format';
            valid = false;
        }

        if (!doner.Password) {
            newErrors.Password = 'Password is required';
            valid = false;
        } else if (doner.Password.length < 6) {
            newErrors.Password = 'Password must be at least 6 characters';
            valid = false;
        }

        if (!doner.AadharNumber) {
            newErrors.AadharNumber = 'Aadhar Number is required';
            valid = false;
        } else if (!validateAadhar(doner.AadharNumber)) {
            newErrors.AadharNumber = 'Aadhar must be exactly 12 digits and not start with 0 or 1';
            valid = false;
        }

        if (!doner.Gender) {
            newErrors.Gender = 'Gender is required';
            valid = false;
        }

        if (!doner.PhoneNo) {
            newErrors.PhoneNo = 'Phone Number is required';
            valid = false;
        } else if (!validatePhoneNumber(doner.PhoneNo)) {
            newErrors.PhoneNo = 'Phone Number must be 10 digits and not start with 0';
            valid = false;
        }

        if (!doner.Pincode) {
            newErrors.Pincode = 'Pincode is required';
            valid = false;
        } else if (!validatePincode(doner.Pincode)) {
            newErrors.Pincode = 'Pincode must be 6 digits and not start with 0';
            valid = false;
        }

        if (!doner.District) {
            newErrors.District = 'District is required';
            valid = false;
        }

        if (!doner.City) {
            newErrors.City = 'City is required';
            valid = false;
        } else if (!validateCity(doner.City)) {
            newErrors.City = 'Only alphabets and spaces are allowed';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const registrationData = {
            ...doner,
            ProfilePhoto: ProfilePhoto || null,
        };

        navigate('/doner-medical-details', { state: registrationData });
    };
    console.log(formData);

    return (
        <div>
            <Nav />
            <div className='main-doner-reg-container'>
                <div className='doner-registration-container'>
                    <h2>Personal Information</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='form-fields-container'>
                            <div className='left-side-inputs'>
                                <FormLabel className="req-form-label">Full Name</FormLabel>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    name='FullName'
                                    value={doner.FullName}
                                    onChange={handleChange}
                                    error={!!errors.FullName}
                                    helperText={errors.FullName}
                                    inputProps={{ readOnly: !!formData.FullName }}
                                />

                                <FormLabel className="req-form-label">Date of Birth</FormLabel>
                                <TextField
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    name='DateOfBirth'
                                    value={doner.DateOfBirth}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.DateOfBirth}
                                    helperText={errors.DateOfBirth}
                                    inputProps={{ max: new Date().toISOString().split('T')[0] }}
                                />

                                <FormLabel className="req-form-label">Email</FormLabel>
                                <TextField
                                    type="email"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
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
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
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
                                    type="tel"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    name='PhoneNo'
                                    value={doner.PhoneNo}
                                    onChange={handleChange}
                                    error={!!errors.PhoneNo}
                                    helperText={errors.PhoneNo}
                                    required
                                    inputProps={{ maxLength: 10, readOnly: !!formData.PhoneNo }}
                                />

                            </div>

                            <div className='right-side-inputs'>
                                <FormLabel className="req-form-label">Gender</FormLabel>
                                <FormControl fullWidth margin="normal" error={!!errors.Gender} >
                                    <Select
                                        value={doner.Gender}
                                        onChange={handleChange}
                                        displayEmpty
                                        name='Gender'
                                        renderValue={(selected) => selected || "Select Gender"}
                                    >
                                        <MenuItem value="" disabled>Select Gender</MenuItem>
                                        {genderOptions.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                <Radio checked={doner.Gender === option.value} />
                                                <ListItemText primary={option.label} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.Gender && <FormHelperText>{errors.Gender}</FormHelperText>}
                                </FormControl>

                                <FormLabel className="req-form-label">Aadhar Number</FormLabel>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    name='AadharNumber'
                                    value={doner.AadharNumber}
                                    onChange={handleChange}
                                    error={!!errors.AadharNumber}
                                    helperText={errors.AadharNumber}
                                    inputProps={{ maxLength: 12 }}
                                />

                                <FormLabel className="req-form-label">Pincode</FormLabel>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    name='Pincode'
                                    value={doner.Pincode}
                                    onChange={handleChange}
                                    error={!!errors.Pincode}
                                    helperText={errors.Pincode}
                                    inputProps={{ maxLength: 6 }}
                                />

                                <FormLabel className="req-form-label">District</FormLabel>
                                <FormControl fullWidth margin="normal" error={!!errors.District} >
                                    <Select
                                        value={doner.District}
                                        onChange={handleChange}
                                        displayEmpty
                                        name='District'
                                        renderValue={(selected) => selected || "Select District"}
                                    >
                                        <MenuItem value="" disabled>Select District</MenuItem>
                                        {districtOptions.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                <Radio checked={doner.District === option.value} />
                                                <ListItemText primary={option.label} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.District && <FormHelperText>{errors.District}</FormHelperText>}
                                </FormControl>

                                <FormLabel className="req-form-label">City</FormLabel>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    name='City'
                                    value={doner.City}
                                    onChange={handleChange}
                                    error={!!errors.City}
                                    helperText={errors.City}
                                    inputProps={{
                                        pattern: "[A-Za-z\\s]*",
                                    }}
                                />                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 3, mb: 2 }}
                            className='doner-req-save'
                        >
                            Save
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DonerRegistration;