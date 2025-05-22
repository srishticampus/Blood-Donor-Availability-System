import React from 'react';
import { Avatar, Button } from '@mui/material';
import { TextField, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import UserNav from './UserNav';
import UserSideMenu from './UserSideMenu';
import {baseUrl} from '../../baseUrl';

function UserProfile() {
    const UserData = JSON.parse(localStorage.getItem('User') || '{}');

    return (
        <Box className="main-container">
            <UserNav/>
            <Box className="sidemenu">
                <UserSideMenu />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Profile
                    </Typography>
                    <Typography variant="h5" className="sub-title">
                       View Profile
                    </Typography>
                    
                    <Box className="profile-image-container" sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 3
                        }}>
                        <Avatar
                            src={UserData.ProfilePhoto?.path ? 
                                `${baseUrl}${UserData.ProfilePhoto.filename}` : ''}
                            sx={{ width: 120, height: 120, marginBottom: 2 }}
                            alt="User Profile"
                        />
                    </Box>

                    <Box className="content-box-hos">
                        <div className='edit-feilds'>
                            <h5>Name 
                                <TextField 
                                    className="edit-input" 
                                    value={UserData.FullName || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                        
                            <h5>Contact Number 
                                <TextField 
                                    className="edit-input" 
                                    value={UserData.PhoneNo || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            
                            <h5>Email id 
                                <TextField 
                                    className="edit-input" 
                                    value={UserData.Email || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            
                            <h5>District 
                                <TextField 
                                    className="edit-input" 
                                    value={UserData.District || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            
                            <h5>City 
                                <TextField 
                                    className="edit-input" 
                                    value={UserData.City || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>
                            
                            <h5>Pincode 
                                <TextField 
                                    className="edit-input" 
                                    value={UserData.Pincode || ''}
                                    InputProps={{ readOnly: true }}
                                />
                            </h5>

                            <div className='hospital-action'>
                                <Link to='/user-edit-profile'>
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

export default UserProfile;