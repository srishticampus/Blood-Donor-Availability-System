import React from 'react';
import { 
    Avatar, 
    Button,
    TextField,
    Box, 
    Typography
} from '@mui/material';
import '../../Styles/EditHospital.css';
import { Link } from 'react-router-dom';
import DonerNav from './DonerNav';
import DonerSideMenu from './DonerSideMenu';
import {baseUrl} from '../../baseUrl';

function DonerProfile() {
    const donorData = JSON.parse(localStorage.getItem('Doner') || '{}');

    return (
        <Box className="main-container">
            <DonerNav />
            <Box className="sidemenu">
                <DonerSideMenu />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Donor Profile
                    </Typography>
                    <Typography variant="h5" className="sub-title">
                        View Donor Profile
                    </Typography>
                    
                    <Box className="profile-image-container" sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 3
                        }}>
                        <Avatar
                            src={donorData.ProfilePhoto?.filename ? 
                                `${baseUrl}/${donorData.ProfilePhoto.filename}` : ''}
                            sx={{ width: 120, height: 120, marginBottom: 2 }}
                            alt="Donor Profile"
                        />
                    </Box>

                    <Box className="content-box-hos">
                        <div className='edit-feilds'>
                            <h5>Full Name 
                                <TextField 
                                    className="edit-input" 
                                    value={donorData.FullName || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            
                            <h5>Aadhar Number 
                                <TextField 
                                    className="edit-input" 
                                    value={donorData.AadharNumber || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            
                            <h5>Contact Number 
                                <TextField 
                                    className="edit-input" 
                                    value={donorData.PhoneNo || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            
                            <h5>Email 
                                <TextField 
                                    className="edit-input" 
                                    value={donorData.Email || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            
                            <h5>City 
                                <TextField 
                                    className="edit-input" 
                                    value={donorData.City || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            
                            <h5>District 
                                <TextField 
                                    className="edit-input" 
                                    value={donorData.District || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            
                            <h5>Pincode 
                                <TextField 
                                    className="edit-input" 
                                    value={donorData.Pincode || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>

                            <div className='hospital-action'>
                                <Link to='/doner-edit-profile'>
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

export default DonerProfile;