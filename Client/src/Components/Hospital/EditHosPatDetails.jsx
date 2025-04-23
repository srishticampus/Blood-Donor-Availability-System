import React from 'react';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    ListItemText,
    Box,
    Typography,
    ListItemIcon
} from '@mui/material';
import HosNav from './HosNav';
import HosSidemenu from './HosSidemenu';
import '../../Styles/EditHospital.css';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import cardiology from '../../Assets/cardiology.png';
import pulmonology from '../../Assets/pulmonology.png';
import neurology from '../../Assets/neurology.png';
import { Link } from 'react-router-dom';

function EditHosPatDetails() {
    const bloodGroups = [
        "A Positive (A+)", "A Negative (A-)",
        "B Positive (B+)", "B Negative (B-)",
        "O Positive (O+)", "O Negative (O-)",
        "AB Positive (AB+)", "AB Negative (AB-)"
    ];

    const doctorsByCategory = [
        {
            name: "Cardiology",
            icon: cardiology,
            doctors: [
                "Dr. Smith (Cardiologist)",
                "Dr. Johnson (Cardiologist)",
                "Dr. Williams (Cardiologist)"
            ]
        },
        {
            name: "Neurology",
            icon: neurology,
            doctors: [
                "Dr. Brown (Neurologist)",
                "Dr. Davis (Neurologist)",
                "Dr. Miller (Neurologist)"
            ]
        },
        {
            name: "Pulmonology",
            icon: pulmonology,
            doctors: [
                "Dr. Wilson (Pulmonologist)",
                "Dr. Moore (Pulmonologist)",
                "Dr. Taylor (Pulmonologist)"
            ]
        }
    ];

    return (
        <Box className="main-container">
            <HosNav />
            <Box className="sidemenu">
                <HosSidemenu />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Hospital / Patient Management
                    </Typography>
                    <Typography variant="h5" className="sub-title">
                        Edit Details
                    </Typography>
                    <Box className="content-box-hos">
                        <div className='edit-feilds'>
                            <h5>Patient Name <TextField className="edit-input" /></h5>
                            <h5>Bystander Contact No <TextField className="edit-input" /></h5>
                            <h5>Diagnosis <TextField className="edit-input" /></h5>
                            <h5>Blood Type<Select
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
                        </div>
                    </Box>
                    <Typography variant="h4" className="title-edit-hos">
                        Hospital Details
                    </Typography>
                    <Box className="content-box-hos">
                        <div className='edit-feilds'>
                            <h5>Room No / Ward No <TextField className="edit-input" /></h5>
                            <h5>Admission Date <TextField className="edit-input" /></h5>
                            <h5>Diagnosis <TextField className="edit-input" /></h5>
                            <h5>Doctor Assigned<Select
                                renderValue={(selected) => selected || "Select Doctor"}
                                displayEmpty
                                className='edit-input'
                            >
                                <MenuItem value="" disabled>
                                    Select Doctor
                                </MenuItem>
                                {doctorsByCategory.map((category) => (
                                    [
                                        <MenuItem key={category.name} style={{ color: 'black' }}>                                        <Box display="flex" alignItems="center">
                                            <ListItemIcon>
                                                <img src={category.icon} alt={category.name} style={{ width: 24, height: 24, color: 'black' }} />
                                            </ListItemIcon>
                                            <Typography variant="subtitle1" style={{ fontWeight: 'bold', marginLeft: 8 }}>
                                                {category.name}
                                            </Typography>
                                        </Box>
                                        </MenuItem>,
                                        ...category.doctors.map(doctor => (
                                            <MenuItem key={doctor} value={doctor} style={{ paddingLeft: 40 }}>
                                                <ListItemText primary={doctor} />
                                            </MenuItem>
                                        ))
                                    ]
                                ))}
                            </Select></h5>
                            <div >
                                <Link to='/hosPatDetails' className='edit-btn'>
                                    <Button variant='contained' className='update-btn-hos'>
                                        Update
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

export default EditHosPatDetails;