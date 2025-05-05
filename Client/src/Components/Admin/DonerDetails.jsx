import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Avatar,
  Box, 
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import AdminNav from './AdminNav';
import AdSidemenu from './AdSidemenu';
import { useParams } from 'react-router-dom';
import dp from '../../Assets/dp.jpg';

function DonerDetails() {
    const { id } = useParams();
    const [donor, setDonor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openConsentDialog, setOpenConsentDialog] = useState(false);
    const [isLoadingConsent, setIsLoadingConsent] = useState(false);
    const [consentError, setConsentError] = useState(null);

    const profilePhotoUrl = donor?.ProfilePhoto?.filename 
        ? `http://localhost:4005/${donor?.ProfilePhoto?.filename}`
        : dp; 
    
    useEffect(() => {
        axios.post(`http://localhost:4005/ViewDonerProfile/${id}`)
            .then(response => {
                setDonor(response.data.data);
            })
            .catch(error => {
                setError(error.message);
                if (error.response) {
                    console.error('Error response data:', error.response.data);
                    setError(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                    setError('No response received from server. Please check your connection.');
                } else {
                    console.error('Request setup error:', error.message);
                    setError(`Request error: ${error.message}`);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleOpenConsent = () => {
        setIsLoadingConsent(true);
        setConsentError(null);
        setOpenConsentDialog(true);
    };

    const handleCloseConsent = () => {
        setOpenConsentDialog(false);
    };


    if (loading) {
        return (
            <Box className="main-container">
                <AdminNav />
                <Box className="sidemenu">
                    <AdSidemenu />
                    <Box className="content-box">
                        <Typography variant="h4" className="title">
                            Loading donor details...
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="main-container">
                <AdminNav />
                <Box className="sidemenu">
                    <AdSidemenu />
                    <Box className="content-box">
                        <Typography variant="h4" className="title" color="error">
                            Error: {error}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    if (!donor) {
        return (
            <Box className="main-container">
                <AdminNav />
                <Box className="sidemenu">
                    <AdSidemenu />
                    <Box className="content-box">
                        <Typography variant="h4" className="title">
                            No donor data found
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box className="main-container">
            <AdminNav />
            <Box className="sidemenu">
                <AdSidemenu />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Donor Health Details
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Avatar
                            alt={donor.FullName || "Donor"}
                            src={profilePhotoUrl}
                            sx={{ width: 60, height: 60 }}
                        />
                        <Typography variant="h4" className="title-sub">
                            Health Information for {donor.FullName || "Donor"}
                        </Typography>
                    </Box>
                    
                    <TableContainer component={Paper} className="table-container">
                        <Table aria-label="user health information table">
                            <TableHead>
                                <TableRow className="table-head-row">
                                    <TableCell className="table-head-cell">Fields</TableCell>
                                    <TableCell className="table-head-cell">Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow hover className="tableRow">
                                    <TableCell className="tableCell">Health Status</TableCell>
                                    <TableCell className="tableCell">
                                        {donor.eligibility ? "Healthy" : "Not Healthy"}
                                    </TableCell>
                                </TableRow>
                                <TableRow hover className="tableRow">
                                    <TableCell className="tableCell">Blood Group</TableCell>
                                    <TableCell className="tableCell">{donor.bloodgrp || "N/A"}</TableCell>
                                </TableRow>
                                <TableRow hover className="tableRow">
                                    <TableCell className="tableCell">Vaccination Taken</TableCell>
                                    <TableCell className="tableCell">
                                        {donor.vaccinationsTaken ? donor.vaccinationsTaken.join(', ') : "N/A"}
                                    </TableCell>
                                </TableRow>
                                <TableRow hover className="tableRow">
                                    <TableCell className="tableCell">Weight</TableCell>
                                    <TableCell className="tableCell">
                                        {donor.weight ? `${donor.weight} KG` : "N/A"}
                                    </TableCell>
                                </TableRow>
                                <TableRow hover className="tableRow">
                                    <TableCell className="tableCell">Medicines</TableCell>
                                    <TableCell className="tableCell">
                                        {donor.medicines ? donor.medicines.join(', ') : "None"}
                                    </TableCell>
                                </TableRow>
                                <TableRow hover className="tableRow">
                                    <TableCell className="tableCell">Surgical History</TableCell>
                                    <TableCell className="tableCell">
                                        {donor.SurgicalHistory ? donor.SurgicalHistory.join(', ') : "None"}
                                    </TableCell>
                                </TableRow>
                                <TableRow hover className="tableRow">
                                    <TableCell className="tableCell">Pregnancy / Breastfeeding</TableCell>
                                    <TableCell className="tableCell">
                                        {donor.PregnancyorBreastfeed || "No"}
                                    </TableCell>
                                </TableRow>
                                <TableRow hover className="tableRow">
                                    <TableCell className="tableCell">Any Allergy</TableCell>
                                    <TableCell className="tableCell">
                                        {donor.Allergy ? donor.Allergy.join(', ') : "None"}
                                    </TableCell>
                                </TableRow>
                                <TableRow hover className="tableRow">
                                    <TableCell className="tableCell">Consent Form</TableCell>
                                    <TableCell className="tableCell">
                                        {donor.ConsentForm?.path ? (
                                            <Button 
                                                variant="outlined" 
                                                size="small"
                                                onClick={handleOpenConsent}
                                            >
                                                View Consent Form
                                            </Button>
                                        ) : "N/A"}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Dialog
                        open={openConsentDialog}
                        onClose={handleCloseConsent}
                        maxWidth="md"
                        fullWidth
                    >
                        <DialogTitle>
                            Consent Form - {donor.ConsentForm?.filename}
                        </DialogTitle>
                        <DialogContent>
                            {isLoadingConsent && (
                                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                                    <CircularProgress />
                                </Box>
                            )}
                            {consentError && (
                                <Typography color="error" align="center">
                                    {consentError}
                                </Typography>
                            )}
                            
                            {donor.ConsentForm?.mimetype?.includes('image') ? (
                                <img 
                                    src={`http://localhost:4005/${donor.ConsentForm.filename}`} 
                                    alt="Consent Form" 
                                    style={{ 
                                        width: '100%', 
                                        height: 'auto',
                                        display: isLoadingConsent ? 'none' : 'block' 
                                    }}
                                    onLoad={() => setIsLoadingConsent(false)}
                                    onError={() => {
                                        setIsLoadingConsent(false);
                                        setConsentError('Failed to load image');
                                    }}
                                />
                            ) : (
                                <iframe 
                                    src={`http://localhost:4005/${donor.ConsentForm.filename}`} 
                                    style={{ 
                                        width: '100%', 
                                        height: '500px', 
                                        border: 'none',
                                        display: isLoadingConsent ? 'none' : 'block' 
                                    }}
                                    title="Consent Form"
                                    onLoad={() => setIsLoadingConsent(false)}
                                    onError={() => {
                                        setIsLoadingConsent(false);
                                        setConsentError('Failed to load document');
                                    }}
                                />
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseConsent}>Close</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </Box>
    );
}

export default DonerDetails;