import React, { useEffect } from 'react';
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
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserNav from './UserNav';
import UserSideMenu from './UserSideMenu';
import axiosInstance from '../Service/BaseUrl'
import {baseUrl} from '../../baseUrl';

function EditUserRequest() {
    const { id } = useParams();
    const navigate = useNavigate();
    const USERID = localStorage.getItem("UserId");

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
        USERID: USERID,
        Date: '',
        Time: '',
        address: ''
    });

    const [errors, setErrors] = React.useState({
        patientName: false,
        contactNumber: false,
        doctorName: false,
        unitsRequired: false,
        Date: false,
        address: false
    });

    const formatDate = (isoDate) => {
        return new Date(isoDate).toISOString().split('T')[0];
    };

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const validateAddress = (address) => {
        if (!address) return true; // Mark as error if empty
        if (address.length < 10) return true; // Mark as error if too short
        return false;
    };

    useEffect(() => {
        const fetchRequestData = async () => {
            try {
                const response = await axiosInstance.post(`/FetchHosReq/${id}`);
                if (response.data) {
                    const requestDate = response.data.Date ? formatDate(response.data.Date) : '';
                    const today = getTodayDate();
                    
                    const validatedDate = requestDate < today ? today : requestDate;
                    
                    setFormData({
                        patientName: response.data.PatientName || '',
                        contactNumber: response.data.ContactNumber || '',
                        doctorName: response.data.doctorName || '',
                        specialization: response.data.specialization || '',
                        bloodType: response.data.BloodType || '',
                        unitsRequired: response.data.UnitsRequired || '',
                        status: response.data.Status || '',
                        USERID: response.data.USERID || USERID,
                        Date: validatedDate,
                        Time: response.data.Time || '',
                        address: response.data.address || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching blood request:", error);
                toast.error('Failed to load request data');
            }
        };

        if (id) {
            fetchRequestData();
        }
    }, [id, USERID]);

    const validateField = (name, value) => {
        switch (name) {
            case 'patientName':
            case 'doctorName':
                return !/^[A-Za-z\s]+$/.test(value);
            case 'contactNumber':
                return !/^\d{10}$/.test(value);
            case 'unitsRequired':
                return !/^\d+$/.test(value) || parseInt(value) <= 0;
            case 'Date':
                return value < getTodayDate();
            case 'address':
                return validateAddress(value);
            default:
                return false;
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        
        if (name === 'Date') {
            const today = getTodayDate();
            const selectedDate = value;
            
            if (selectedDate < today) {
                setErrors(prev => ({
                    ...prev,
                    [name]: true
                }));
                return; 
            }
        }
        
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, value)
        }));

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        const newErrors = {
            patientName: validateField('patientName', formData.patientName),
            contactNumber: validateField('contactNumber', formData.contactNumber),
            doctorName: validateField('doctorName', formData.doctorName),
            unitsRequired: validateField('unitsRequired', formData.unitsRequired),
            Date: validateField('Date', formData.Date),
            address: validateField('address', formData.address)
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            toast.error('Please correct the errors in the form');
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
            USERID: formData.USERID,
            Date: formData.Date,
            Time: formData.Time,
            address: formData.address
        };

        axiosInstance.post(`/EditHospital/BloodReq/${id}`, requestData)
            .then(response => {
                toast.success('Blood request updated successfully!');
                navigate('/user-requests');
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error('Failed to update blood request. Please try again.');
            });
    };

    return (
        <Box className="main-container">
            <UserNav />
            <ToastContainer position="top-right" autoClose={5000} />
            <Box className="sidemenu">
                <UserSideMenu />
                <Box className="content-box">
                    <Typography variant="h4" className="title">Blood Request Management</Typography>
                    <Typography variant="h5" className="sub-title">Edit Blood Request</Typography>
                    <Box className="content-box-hos">
                        <div className='edit-feilds'>
                            <h5>Patient Name
                                <TextField
                                    className="edit-input"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleChange}
                                    error={errors.patientName}
                                    helperText={errors.patientName ? "Only alphabets are allowed" : ""}
                                    inputProps={{ 
                                        pattern: "[A-Za-z ]+",
                                        title: "Only alphabets are allowed"
                                    }}
                                />
                            </h5>
                            <h5>Contact Number
                                <TextField
                                    className="edit-input"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    error={errors.contactNumber}
                                    helperText={errors.contactNumber ? "Please enter a valid 10-digit number" : ""}
                                    inputProps={{ 
                                        maxLength: 10,
                                        pattern: "\\d{10}",
                                        title: "Please enter a 10-digit number"
                                    }}
                                />
                            </h5>
                            <h5>Doctor Name
                                <TextField
                                    className="edit-input"
                                    name="doctorName"
                                    value={formData.doctorName}
                                    onChange={handleChange}
                                    error={errors.doctorName}
                                    helperText={errors.doctorName ? "Only alphabets are allowed" : ""}
                                    inputProps={{ 
                                        pattern: "[A-Za-z ]+",
                                        title: "Only alphabets are allowed"
                                    }}
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
                                >
                                    <MenuItem value="" disabled>Select Specialization</MenuItem>
                                    {specializations.map((spec) => (
                                        <MenuItem key={spec} value={spec}>
                                            <ListItemIcon>
                                                <Radio
                                                    checked={formData.specialization === spec}
                                                    sx={{
                                                        color: '#6B7280',
                                                        '&.Mui-checked': { color: '#6B7280' }
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
                                >
                                    <MenuItem value="" disabled>Blood Type</MenuItem>
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
                                    error={errors.unitsRequired}
                                    helperText={errors.unitsRequired ? "Please enter a valid number greater than 0" : ""}
                                    inputProps={{ 
                                        min: 1, 
                                        step: 1,
                                        pattern: "\\d+",
                                        title: "Please enter a number greater than 0"
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
                                    <MenuItem value="" disabled>Select Status</MenuItem>
                                    {["Planned", "Very Urgent", "Emergency"].map((status, i) => (
                                        <MenuItem key={status} value={status}>
                                            <ListItemIcon>
                                                <Radio
                                                    checked={formData.status === status}
                                                    sx={{
                                                        color: i === 2 ? '#EF4444' : i === 1 ? '#FBBF24' : '#6B7280',
                                                        '&.Mui-checked': {
                                                            color: i === 2 ? '#EF4444' : i === 1 ? '#FBBF24' : '#6B7280'
                                                        }
                                                    }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary={status} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </h5>
                            <h5>Date
                                <TextField
                                    className="edit-input"
                                    name="Date"
                                    value={formData.Date}
                                    onChange={handleChange}
                                    type="date"
                                    error={errors.Date}
                                    helperText={errors.Date ? "Please select today's date or a future date" : ""}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ 
                                        min: getTodayDate(),
                                        title: "Please select today's date or a future date"
                                    }}
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
                            <h5>Address
                                <TextField
                                    className="edit-input"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    error={errors.address}
                                    helperText={errors.address ? "Address should be at least 10 characters long" : ""}
                                    multiline
                                    rows={3}
                                    inputProps={{
                                        minLength: 10
                                    }}
                                />
                            </h5>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
                                <Button variant="contained" style={{ marginTop: '20px' }} onClick={handleSubmit}>
                                    Update
                                </Button>
                                <Link to='/user-requests'>
                                    <Button variant="contained" style={{ marginTop: '20px', backgroundColor:"gray" }}>
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default EditUserRequest;