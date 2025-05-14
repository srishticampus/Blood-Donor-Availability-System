import React, { useEffect } from 'react';
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
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../Service/BaseUrl';
function EditBloodReq() {
    const { id } = useParams();
const navigate = useNavigate()
    const bloodGroups = [
        "A Positive (A+)", "A Negative (A-)",
        "B Positive (B+)", "B Negative (B-)",
        "O Positive (O+)", "O Negative (O-)",
        "AB Positive (AB+)", "AB Negative (AB-)"
    ];

    const [formData, setFormData] = React.useState({
        PatientName: '',
        ContactNumber: '',
        BloodType: '',
        UnitsRequired: '',
        Status: ''
    });

    useEffect(() => {
        const fetchRequestData = async () => {
            try {
                const response = await axiosInstance.post(`/FetchHosReq/${id}`);
                console.log(response.data);
                if (response.data) {
                    setFormData({
                        PatientName: response.data.PatientName || '',
                        ContactNumber: response.data.ContactNumber || '',
                        BloodType: response.data.BloodType || '',
                        UnitsRequired: response.data.UnitsRequired || '',
                        Status: response.data.Status || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching blood request:", error);
            }
        };

        if (id) {
            fetchRequestData();
        }
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            await axiosInstance.post(`/EditHospital/BloodReq/${id}`, formData);
            toast.success('Request updated successfully!');
            navigate("/hosEmergency")
        } catch (error) {
            console.error("Error updating blood request:", error);
            toast.error('Error updating request');
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
                        Blood Request Management
                    </Typography>
                    <Typography variant="h5" className="sub-title">
                        Edit Blood Request
                    </Typography>
                    <Box className="content-box-hos">
                        <div className='edit-feilds'>
                            <h5>Patient Name <TextField
                                className="edit-input"
                                name="PatientName"
                                value={formData.PatientName}
                                onChange={handleChange}
                            /></h5>

                            <h5>Contact Number <TextField
                                className="edit-input"
                                name="ContactNumber"
                                value={formData.ContactNumber}
                                onChange={handleChange}
                            /></h5>

                            <h5>Blood Type<Select
                                name="BloodType"
                                value={formData.BloodType}
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
                            </Select></h5>

                            <h5>Units Required <TextField
                                className="edit-input"
                                name="UnitsRequired"
                                value={formData.UnitsRequired}
                                onChange={handleChange}
                                type="number"
                            /></h5>

                            <h5>Status<Select
                                name="Status"
                                value={formData.Status}
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
                                            checked={formData.Status === 'Planned'}
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
                                            checked={formData.Status === 'Very Urgent'}
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
                                            checked={formData.Status === 'Emergency'}
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
                            </Select></h5>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    style={{ marginTop: '20px' }}
                                    onClick={handleSubmit}
                                >
                                    Update Request
                                </Button>

                                <Link to='/hosEmergency'>
                                    <Button
                                        variant="contained"
                                        style={{ marginTop: '20px' }}
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default EditBloodReq;