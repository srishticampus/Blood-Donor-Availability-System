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
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import axiosInstance from '../Service/BaseUrl';
function BloodRequest() {
    const navigate = useNavigate()
    const HospitalId = localStorage.getItem('hospitalId')
    
    const bloodGroups = [
        "A Positive (A+)", "A Negative (A-)",
        "B Positive (B+)", "B Negative (B-)",
        "O Positive (O+)", "O Negative (O-)",
        "AB Positive (AB+)", "AB Negative (AB-)"
    ];

    const specializations = [
        "Cardiology",
        "Neurology",
        "Obstetrics and Gynecology",
        "Oncology",
        "General Surgery",
        "Other"
    ];

    const [formData, setFormData] = React.useState({
        patientName: '',
        contactNumber: '',
        doctorName: '',
        specialization: '',
        bloodType: '',
        unitsRequired: '',
        status: '',
        hospitalId: HospitalId,
        Date: '',
        Time: ''
    });

    const [errors, setErrors] = React.useState({
        patientName: '',
        contactNumber: '',
        doctorName: '',
        unitsRequired: '',
        Date: ''
    });

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const validatePatientName = (name) => {
        if (!name) return 'Patient name is required';
        const regex = /^[a-zA-Z\s]+$/;
        if (!regex.test(name)) {
            return 'Only alphabets and spaces are allowed';
        }
        return '';
    };

    const validateDoctorName = (name) => {
        if (!name) return 'Doctor name is required';
        const regex = /^[a-zA-Z\s]+$/;
        if (!regex.test(name)) {
            return 'Only alphabets and spaces are allowed';
        }
        return '';
    };

    const validateContactNumber = (number) => {
        if (!number) return 'Contact number is required';
        const regex = /^[0-9]+$/;
        if (!regex.test(number)) {
            return 'Only numbers are allowed';
        }
        if (number.length > 10) {
            return 'Contact number should not exceed 10 digits';
        }
        if (number.length < 10) {
            return 'Contact number should be at least 10 digits';
        }
        return '';
    };

    const validateUnitsRequired = (units) => {
        if (!units) return 'Units required is required';
        if (isNaN(units)) {
            return 'Must be a number';
        }
        if (units <= 0) {
            return 'Must be greater than 0';
        }
        return '';
    };

    const validateDate = (date) => {
        if (!date) return 'Date is required';
        const today = new Date(getTodayDate());
        const selectedDate = new Date(date);

        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return 'Cannot select past date';
        }
        return '';
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        let error = '';
        switch (name) {
            case 'patientName':
                error = validatePatientName(value);
                break;
            case 'doctorName':
                error = validateDoctorName(value);
                break;
            case 'contactNumber':
                error = validateContactNumber(value);
                break;
            case 'unitsRequired':
                error = validateUnitsRequired(value);
                break;
            case 'Date':
                error = validateDate(value);
                break;
            default:
                break;
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleBlur = (event) => {
        const { name, value } = event.target;
        let error = '';

        switch (name) {
            case 'patientName':
                error = validatePatientName(value);
                break;
            case 'doctorName':
                error = validateDoctorName(value);
                break;
            case 'contactNumber':
                error = validateContactNumber(value);
                break;
            case 'unitsRequired':
                error = validateUnitsRequired(value);
                break;
            case 'Date':
                error = validateDate(value);
                break;
            default:
                break;
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleSubmit = () => {
        const newErrors = {
            patientName: validatePatientName(formData.patientName),
            doctorName: validateDoctorName(formData.doctorName),
            contactNumber: validateContactNumber(formData.contactNumber),
            unitsRequired: validateUnitsRequired(formData.unitsRequired),
            Date: validateDate(formData.Date)
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(error => error !== '');
        const isEmptyField = !formData.patientName || !formData.doctorName ||
            !formData.contactNumber || !formData.specialization ||
            !formData.bloodType || !formData.unitsRequired ||
            !formData.status || !formData.Date || !formData.Time;

        if (hasErrors || isEmptyField) {
            toast.error('Please fill all required fields correctly.');
            return;
        }

        const requestData = {
            PatientName: formData.patientName,
            doctorName: formData.doctorName,
            specialization: formData.specialization,
            ContactNumber: formData.contactNumber,
            BloodType: formData.bloodType,
            UnitsRequired: formData.unitsRequired,
            Status: formData.status,
            HospitalId: formData.hospitalId,
            Date: formData.Date,
            Time: formData.Time
        };

        axiosInstance.post('/AddBloodRequest', requestData)
            .then(response => {
                console.log(response.data);
                toast.success('Blood request submitted successfully!');
                navigate('/hosEmergency');
                setFormData({
                    patientName: '',
                    doctorName: '',
                    contactNumber: '',
                    specialization: '',
                    bloodType: '',
                    unitsRequired: '',
                    status: '',
                    hospitalId: HospitalId,
                    Date: '',
                    Time: ''
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
                                    onBlur={handleBlur}
                                    error={!!errors.patientName}
                                    helperText={errors.patientName}
                                />
                            </h5>

                            <h5>Contact Number
                                <TextField
                                    className="edit-input"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!errors.contactNumber}
                                    helperText={errors.contactNumber}
                                    inputProps={{ maxLength: 15 }}
                                />
                            </h5>

                            <h5>Doctor Name
                                <TextField
                                    className="edit-input"
                                    name="doctorName"
                                    value={formData.doctorName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!errors.doctorName}
                                    helperText={errors.doctorName}
                                />
                            </h5>

                            <h5>Specialization
                                <Select
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    renderValue={(selected) => selected || "Select Specialization"}
                                    displayEmpty
                                    className='edit-input'
                                    error={!formData.specialization}
                                >
                                    <MenuItem value="" disabled>
                                        Select Specialization
                                    </MenuItem>
                                    {specializations.map((spec) => (
                                        <MenuItem key={spec} value={spec}>
                                            <ListItemIcon>
                                                <Radio
                                                    checked={formData.specialization === spec}
                                                    sx={{
                                                        color: '#6B7280',
                                                        '&.Mui-checked': {
                                                            color: '#6B7280',
                                                        },
                                                    }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary={spec} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </h5>

                            <h5>Blood Type
                                <Select
                                    name="bloodType"
                                    value={formData.bloodType}
                                    onChange={handleChange}
                                    renderValue={(selected) => selected || "Select Blood Group"}
                                    displayEmpty
                                    className='edit-input'
                                    error={!formData.bloodType}
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
                                    onBlur={handleBlur}
                                    type="number"
                                    error={!!errors.unitsRequired}
                                    helperText={errors.unitsRequired}
                                    inputProps={{ min: 1, step: 1 }}
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
                                    error={!formData.status}
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

                            <h5>Date
                                <TextField
                                    className="edit-input"
                                    name="Date"
                                    value={formData.Date}
                                    onChange={handleChange}
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{
                                        min: getTodayDate()
                                    }}
                                    error={!!errors.Date}
                                    helperText={errors.Date}
                                    onBlur={handleBlur}
                                />
                            </h5>

                            <h5>Time
                                <TextField
                                    className="edit-input"
                                    name="Time"
                                    value={formData.Time}
                                    onChange={handleChange}
                                    type="time"
                                    InputLabelProps={{ shrink: true }}
                                />
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