import React, { useState } from 'react';
import { 
    Avatar, 
    Button,
    TextField,
    Box, 
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton
} from '@mui/material';
import HosNav from './HosNav';
import HosSidemenu from './HosSidemenu';
import { Description, Close } from '@mui/icons-material';
import '../../Styles/EditHospital.css';
import { Link } from 'react-router-dom';
import {baseUrl} from '../../baseUrl';

function HospitalProfile() {
    const hospitalData = JSON.parse(localStorage.getItem('Hospital') || '{}');
    const [openDocument, setOpenDocument] = useState(false);
    const [documentType, setDocumentType] = useState('');

    const handleViewDocument = () => {
        const filename = hospitalData.Document?.filename;
        if (filename) {
            const extension = filename.split('.').pop().toLowerCase();
            setDocumentType(extension === 'pdf' ? 'pdf' : 'image');
            setOpenDocument(true);
        }
    };

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
                                `${baseUrl}${hospitalData.ProfilePhoto.filename}` : ''}
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
                                    <Box style={{ display: 'flex', justifyContent: 'end', marginTop: '-50px' }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Description />}
                                            onClick={handleViewDocument}
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

                    {/* Document Preview Dialog */}
                    <Dialog
                        open={openDocument}
                        onClose={() => setOpenDocument(false)}
                        fullWidth
                        maxWidth="md"
                        scroll="paper"
                    >
                        <DialogTitle sx={{ m: 0, p: 2 }}>
                            <Typography variant="h6">Document Preview</Typography>
                            <IconButton
                                aria-label="close"
                                onClick={() => setOpenDocument(false)}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            {documentType === 'pdf' ? (
                                <embed
                                    src={`${baseUrl}${hospitalData.Document.filename}`}
                                    type="application/pdf"
                                    width="100%"
                                    height="600px"
                                />
                            ) : (
                                <img
                                    src={`${baseUrl}${hospitalData.Document.filename}`}
                                    alt="Verification Document"
                                    style={{ 
                                        width: '100%', 
                                        height: 'auto',
                                        objectFit: 'contain' 
                                    }}
                                />
                            )}
                        </DialogContent>
                    </Dialog>
                </Box>
            </Box>
        </Box>
    );
}

export default HospitalProfile;