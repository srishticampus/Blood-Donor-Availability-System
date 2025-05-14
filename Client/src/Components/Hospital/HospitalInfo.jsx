import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import '../../Styles/HospitalInfo.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import axiosInstance from '../Service/BaseUrl';
function HospitalInfo() {
    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state || {};

    const [hospital, setHospital] = useState({
        ...formData,
        OpeningTime: "",
        ClosingTime: "",
        document: null
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHospital(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setHospital(prev => ({ ...prev, document: e.target.files[0] }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleSubmit = () => {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (!timeRegex.test(hospital.OpeningTime) || !timeRegex.test(hospital.ClosingTime)) {
            toast.error("Invalid time format. Please use HH:MM (24-hour format)");
            return;
        }

        if (!hospital.document) {
            toast.error("Please upload a document for verification");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('ProfilePhoto', hospital.ProfilePhoto);
        formDataToSend.append('FullName', hospital.FullName);
        formDataToSend.append('RegistrationNumber', hospital.RegistrationNumber);
        formDataToSend.append('Email', hospital.Email);
        formDataToSend.append('Password', hospital.Password);
        formDataToSend.append('PhoneNo', hospital.PhoneNo);
        formDataToSend.append('Address', hospital.Address);
        formDataToSend.append('Street', hospital.Street);
        formDataToSend.append('City', hospital.City);
        formDataToSend.append('Pincode', hospital.Pincode);
        formDataToSend.append('OpeningTime', hospital.OpeningTime);
        formDataToSend.append('ClosingTime', hospital.ClosingTime);
        formDataToSend.append('Document', hospital.document);

        console.log('Submitting hospital data:', hospital);

        axiosInstance.post('/hospital-registration', formDataToSend)
        .then(response => {
            const { message } = response.data;

            if (response.status === 201 && message === "Registration successful") {
                toast.success('Registration successfully');
                setTimeout(() => navigate('/hosLogin'), 2000); 
            } else {
                if (message === "Email already exists" || 
                    message === "Phone number already exists" ||
                    message === "Registration number already exists") {
                    toast.error(message);
                    setTimeout(() => navigate('/register'), 2000); 

                } else {
                    toast.error('Registration failed. Please try again.');
                }
            }
        })
        .catch(error => {
            console.error(error);
            toast.error( 'Registration failed. Please try again.');
        });    };

    return (
        <div className='main-hos-reg-container'>
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
            />
            <div className='hospitalInfo-container'>
                <h2>Blood Bank Registration</h2>

                <p className='hospitalInfo-title'>Operating Hours</p>
                <div className='hospitalInfo-row'>
                    <TextField
                        name="OpeningTime"
                        placeholder="Opening Time HH:MM"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        size="small"
                        className="hospitalInfo-textField"
                        value={hospital.OpeningTime}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: false }}
                    />
                    <TextField
                        name="ClosingTime"
                        placeholder="Closing Time HH:MM"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        size="small"
                        className="hospitalInfo-textField"
                        value={hospital.ClosingTime}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: false }}
                    />
                </div>

                <div className='hospitalInfo-uploadContainer'>
                    <p className='hospitalInfo-title'>Document Verification</p>
                    <input
                        type="file"
                        id="document-upload"
                        className='hospitalInfo-fileUpload'
                        style={{ display: 'none' }}
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        required
                    />
                    <label htmlFor="document-upload" className='hospitalInfo-uploadLabel'>
                        Upload 
                    </label>
                </div>

                <div className='hospitalInfo-pass'>
                    <TextField
                        placeholder="Enter Password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        style={{ width: "300px" }}
                        size="small"
                        className="hospitalInfo-textField"
                        value={hospital.Password || ''}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <IconButton onClick={togglePasswordVisibility}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            )
                        }}
                    />
                   
                </div>

                <div className='hospitalInfo-buttonContainer'>
                    <Button
                        variant="contained"
                        color="primary"
                        className='hospitalInfo-button'
                        onClick={handleSubmit}
                    >
                        Register
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default HospitalInfo;