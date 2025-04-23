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

function BloodRequest() {
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
        status: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Box className="main-container">
            <HosNav />
            <Box className="sidemenu">
                <HosSidemenu />
                {/* <Typography variant="h4" className="title-edit-hos">
                    Add New Blood Request
                </Typography> */}
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Blood Request Management
                    </Typography>
                    <Typography variant="h5" className="sub-title">
                        All Request for Blood
                    </Typography>
                    <Box className="content-box-hos">

                        <div className='edit-feilds'>
                            <h5>Patient Name <TextField
                                className="edit-input"
                                name="patientName"
                                value={formData.patientName}
                                onChange={handleChange}
                            /></h5>

                            <h5>Contact Number <TextField
                                className="edit-input"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                            /></h5>

                            <h5>Blood Type<Select
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
                            </Select></h5>

                            <h5>Units Required <TextField
                                className="edit-input"
                                name="unitsRequired"
                                value={formData.unitsRequired}
                                onChange={handleChange}
                                type="number"
                            /></h5>



                            <h5>Status<Select
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
                            </Select></h5>
                            <Link to='/hosEmergency'>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: '20px', width: '100%' }}
                                    onClick={() => console.log(formData)}
                                >
                                    Submit Request
                                </Button>
                            </Link>

                        </div>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default BloodRequest;