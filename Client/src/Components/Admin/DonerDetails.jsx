import React, { useState, useEffect } from 'react';
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
import axiosInstance from '../Service/BaseUrl';
import {baseUrl} from '../../baseUrl';

function DonerDetails() {
    const { id } = useParams();
    const [donor, setDonor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openConsentDialog, setOpenConsentDialog] = useState(false);
    const [isLoadingConsent, setIsLoadingConsent] = useState(false);
    const [consentError, setConsentError] = useState(null);

    const profilePhotoUrl = donor?.ProfilePhoto?.filename 
        ? `${baseUrl}${donor?.ProfilePhoto?.filename}`
        : dp; 
    
    useEffect(() => {
        axiosInstance.post(`/ViewDonerProfile/${id}`)
            .then(response => {
                setDonor(response.data.data);
                console.log(response.data.data);
                
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

    const displayArrayData = (arrayData) => {
        if (!arrayData || arrayData.length === 0) return "None";
        return arrayData.join(', ');
    };

    const displayData = (data, fallback = "N/A") => {
        if (data === undefined || data === null || data === '') return fallback;
        return data;
    };

    const getHealthStatus = () => {
        if (donor.PregnancyorBreastfeed === "Yes") {
            return "Not Eligible";
        }
        
        return "Healthy";
    };

    if (loading) {
        return (
            <Box className="main-container">
                <AdSidemenu />
                <Box className="sidemenu">
                    <AdminNav />
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '70vh' 
                    }}>
                        <CircularProgress size={60} />
                    </Box>
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="main-container">
                <AdSidemenu />
                <Box className="sidemenu">
                    <AdminNav />
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '70vh' 
                    }}>
                        <Typography color="error">Error: {error}</Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    if (!donor) {
        return (
            <Box className="main-container">
                <AdSidemenu />
                <Box className="sidemenu">
                    <AdminNav />
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '70vh' 
                    }}>
                        <Typography variant="h6">No donor data found</Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box className="main-container">
            <AdSidemenu />
            <Box className="sidemenu">
                <AdminNav />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Donor Health Details
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Avatar
                            alt={displayData(donor.FullName, "Donor")}
                            src={profilePhotoUrl}
                            sx={{ width: 60, height: 60 }}
                        />
                        <Typography variant="h4" className="title-sub">
                            Health Information for {displayData(donor.FullName, "Donor")}
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
                                        {getHealthStatus()}
                                    </TableCell>
                                </TableRow>
                                <TableRow hover className="tableRow">
                                    <TableCell className="tableCell">Blood Group</TableCell>
                                    <TableCell className="tableCell">{displayData(donor.bloodgrp)}</TableCell>
                                </TableRow>
                                <TableRow hover className="tableRow">
                                    <TableCell className="tableCell">Vaccination Taken</TableCell>
                                    <TableCell className="tableCell">
                                        {displayArrayData(donor.vaccinationsTaken)}
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
                                        {displayArrayData(donor.medicines)}
                                    </TableCell>
                                </TableRow>
                                <TableRow hover className="tableRow">
                                    <TableCell className="tableCell">Surgical History</TableCell>
                                    <TableCell className="tableCell">
                                        {displayArrayData(donor.SurgicalHistory)}
                                    </TableCell>
                                </TableRow>
                                <TableRow hover className="tableRow">
                                    <TableCell className="tableCell">Pregnancy / Breastfeeding</TableCell>
                                    <TableCell className="tableCell">
                                        {displayData(donor.PregnancyorBreastfeed, "No")}
                                    </TableCell>
                                </TableRow>
                                <TableRow hover className="tableRow">
                                    <TableCell className="tableCell">Any Allergy</TableCell>
                                    <TableCell className="tableCell">
                                        {displayArrayData(donor.Allergy)}
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
                            Consent Form - {donor.ConsentForm?.filename || "Unknown"}
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
                                    src={`${baseUrl}${donor.ConsentForm.filename}`} 
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
                                    src={`${baseUrl}${donor.ConsentForm?.filename}`} 
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