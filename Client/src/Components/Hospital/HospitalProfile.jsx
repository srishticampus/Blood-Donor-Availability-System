import React from 'react';
import { 
    Avatar, 
    Button,
    TextField,
    Box, 
    Typography,
} from '@mui/material';
import HosNav from './HosNav';
import HosSidemenu from './HosSidemenu';
import { Description } from '@mui/icons-material';
import '../../Styles/EditHospital.css';
import { Link } from 'react-router-dom';
import axiosInstance from '../Service/BaseUrl';
function HospitalProfile() {
    const hospitalData = JSON.parse(localStorage.getItem('Hospital') || '{}');

    return (
        <Box className="main-container">
            <HosNav />
            <Box className="sidemenu">
                <HosSidemenu />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Hospital Profile
                    </Typography>
                    <Typography variant="h5" className="sub-title">
                        View Hospital Profile
                    </Typography>
                    
                    <Box className="profile-image-container" sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 3
                        }}>
                        <Avatar
                            src={hospitalData.ProfilePhoto?.filename ? 
                                `http://localhost:4005/${hospitalData.ProfilePhoto.filename}` : ''}
                            sx={{ width: 120, height: 120, marginBottom: 2 }}
                            alt="Hospital Profile"
                        />
                    </Box>

                    <Box className="content-box-hos">
                        <div className='edit-feilds'>
                            <h5>Hospital Name 
                                <TextField 
                                    className="edit-input" 
                                    value={hospitalData.FullName || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            <h5>Registration Number 
                                <TextField 
                                    className="edit-input" 
                                    value={hospitalData.RegistrationNumber || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            <h5>Contact Number 
                                <TextField 
                                    className="edit-input" 
                                    value={hospitalData.PhoneNo || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            <h5>Email 
                                <TextField 
                                    className="edit-input" 
                                    value={hospitalData.Email || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            <h5>Address 
                                <TextField 
                                    className="edit-input" 
                                    value={hospitalData.Address || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            <h5>Street 
                                <TextField 
                                    className="edit-input" 
                                    value={hospitalData.Street || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            <h5>City 
                                <TextField 
                                    className="edit-input" 
                                    value={hospitalData.City || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            <h5>Pincode 
                                <TextField 
                                    className="edit-input" 
                                    value={hospitalData.Pincode || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            <h5>Opening Time 
                                <TextField 
                                    className="edit-input" 
                                    value={hospitalData.OpeningTime || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            <h5>Closing Time 
                                <TextField 
                                    className="edit-input" 
                                    value={hospitalData.ClosingTime || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            
                            {hospitalData.Document?.filename && (
                                <div className='document-upload'>
                                    <h5>Document Verification</h5>
                                    <Box sx={{ mt: 1 }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Description />}
                                            component="a"
                                            href={`http://localhost:4005/${hospitalData.Document.filename}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Document
                                        </Button>
                                    </Box>
                                </div>
                            )}

                            <div className='hospital-action'>
                                <Link to='/hosEditProfile'>
                                    <Button 
                                        variant="contained" 
                                        fullWidth 
                                        style={{ width: "100%", marginTop: "35px" }}
                                    >
                                        Edit Profile
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

export default HospitalProfile;