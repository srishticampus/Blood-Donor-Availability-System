import React from 'react';
import HosNav from './HosNav';
import HosSidemenu from './HosSidemenu';
import {
    Box,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Typography,
    ListItemIcon,
    Radio,
    Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import { toast , ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

function BloodRequest() {
    const HospitalId = localStorage.getItem('hospitalId')
    const bloodGroups = [
        "A Positive (A+)", "A Negative (A-)",
        "B Positive (B+)", "B Negative (B-)",
        "O Positive (O+)", "O Negative (O-)",
        "AB Positive (AB+)", "AB Negative (AB-)"
    ];

    const [formData, setFormData] = React.useState({
        patientName: '',
        contactNumber: '',
        bloodType: '',
        unitsRequired: '',
        status: '',
        hospitalId: HospitalId,
    });

    const [errors, setErrors] = React.useState({
        patientName: '',
        contactNumber: '',
        unitsRequired: ''
    });

    const validatePatientName = (name) => {
        const regex = /^[a-zA-Z\s]*$/;
        if (!regex.test(name)) {
            return 'Only alphabets and spaces are allowed';
        }
        return '';
    };

    const validateContactNumber = (number) => {
        const regex = /^[0-9]*$/;
        if (!regex.test(number)) {
            return 'Only numbers are allowed';
        }
        if (number.length > 15) {
            return 'Contact number too long';
        }
        return '';
    };

    const validateUnitsRequired = (units) => {
        if (isNaN(units)) {
            return 'Must be a number';
        }
        if (units <= 0) {
            return 'Must be greater than 0';
        }
        return '';
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        
        let error = '';
        switch (name) {
            case 'patientName':
                error = validatePatientName(value);
                break;
            case 'contactNumber':
                error = validateContactNumber(value);
                break;
            case 'unitsRequired':
                error = validateUnitsRequired(value);
                break;
            default:
                break;
        }
        
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        if (!error || value === '') {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = () => {
        const hasErrors = Object.values(errors).some(error => error !== '');
        const isEmptyField = Object.values(formData).some(field => field === '');
        
        if (hasErrors) {
            toast.error('Please correct the errors in the form');
            return;
        }
        
        if (isEmptyField) {
            toast.error('Please fill all the fields');
            return;
        }

        const requestData = {
            PatientName: formData.patientName,
            ContactNumber: formData.contactNumber,
            BloodType: formData.bloodType,
            UnitsRequired: formData.unitsRequired,
            Status: formData.status,
            HospitalId: formData.HospitalId,
        };

        axios.post('http://localhost:4005/AddBloodRequest', requestData)
            .then(response => {
                console.log(response.data);
                toast.success('Blood request submitted successfully!');
                setFormData({
                    patientName: '',
                    contactNumber: '',
                    bloodType: '',
                    unitsRequired: '',
                    status: '',
                    hospitalId: HospitalId,
                });
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error('Failed to submit blood request. Please try again.');
            });
    };

    return (
        <Box className="main-container">
            <HosNav />
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

            <Box className="sidemenu">
                <HosSidemenu />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Blood Request Management
                    </Typography>
                    <Typography variant="h5" className="sub-title">
                        All Request for Blood
                    </Typography>
                    <Box className="content-box-hos">
                        <div className='edit-feilds'>
                            <h5>Patient Name 
                                <TextField
                                    className="edit-input"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleChange}
                                    error={!!errors.patientName}
                                    helperText={errors.patientName}
                                    inputProps={{
                                        pattern: "[a-zA-Z\\s]*",
                                        title: "Only alphabets and spaces are allowed"
                                    }}
                                />
                            </h5>

                            <h5>Contact Number 
                                <TextField
                                    className="edit-input"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    error={!!errors.contactNumber}
                                    helperText={errors.contactNumber}
                                    inputProps={{
                                        inputMode: 'numeric',
                                        pattern: "[0-9]*",
                                        title: "Only numbers are allowed"
                                    }}
                                />
                            </h5>

                            <h5>Blood Type
                                <Select
                                    name="bloodType"
                                    value={formData.bloodType}
                                    onChange={handleChange}
                                    renderValue={(selected) => selected || "Select Blood Group"}
                                    displayEmpty
                                    className='edit-input'
                                >
                                    <MenuItem value="" disabled>
                                        Blood Type
                                    </MenuItem>
                                    {bloodGroups.map((group) => (
                                        <MenuItem key={group} value={group}>
                                            <ListItemText primary={group} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </h5>

                            <h5>Units Required 
                                <TextField
                                    className="edit-input"
                                    name="unitsRequired"
                                    value={formData.unitsRequired}
                                    onChange={handleChange}
                                    type="number"
                                    error={!!errors.unitsRequired}
                                    helperText={errors.unitsRequired}
                                    inputProps={{
                                        min: 1,
                                        step: 1
                                    }}
                                />
                            </h5>

                            <h5>Status
                                <Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    renderValue={(selected) => selected || "Select Status"}
                                    displayEmpty
                                    className='edit-input'
                                >
                                    <MenuItem value="" disabled>
                                        Select Status
                                    </MenuItem>
                                    <MenuItem value="Planned">
                                        <ListItemIcon>
                                            <Radio
                                                checked={formData.status === 'Planned'}
                                                sx={{
                                                    color: '#6B7280',
                                                    '&.Mui-checked': {
                                                        color: '#6B7280',
                                                    },
                                                }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText primary="Planned" />
                                    </MenuItem>
                                    <MenuItem value="Very Urgent">
                                        <ListItemIcon>
                                            <Radio
                                                checked={formData.status === 'Very Urgent'}
                                                sx={{
                                                    color: '#FBBF24',
                                                    '&.Mui-checked': {
                                                        color: '#FBBF24',
                                                    },
                                                }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText primary="Very Urgent" />
                                    </MenuItem>
                                    <MenuItem value="Emergency">
                                        <ListItemIcon>
                                            <Radio
                                                checked={formData.status === 'Emergency'}
                                                sx={{
                                                    color: '#EF4444',
                                                    '&.Mui-checked': {
                                                        color: '#EF4444',
                                                    },
                                                }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText primary="Emergency" />
                                    </MenuItem>
                                </Select>
                            </h5>

                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginTop: '20px', width: '100%' }}
                                onClick={handleSubmit}
                            >
                                Submit Request
                            </Button>
                        </div>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default BloodRequest;