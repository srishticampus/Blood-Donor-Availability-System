import React, { useState, useEffect } from 'react';
import AdminNav from './AdminNav';
import AdSidemenu from './AdSidemenu';
import '../../Styles/TableStyle.css';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    CircularProgress
} from '@mui/material';
import axiosInstance from '../Service/BaseUrl';

function EmergencyAlert() {
    const [emergencyRequests, setEmergencyRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axiosInstance.get('/ShowAllBloodRequest')
            .then(response => {
                console.log(response.data);
                
                const emergencyOnly = response.data.filter(request => request.Status === "Emergency");
                setEmergencyRequests(emergencyOnly);
                setFilteredRequests(emergencyOnly);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredRequests(emergencyRequests);
        } else {
            const lowercasedSearch = searchTerm.toLowerCase();
            const filtered = emergencyRequests.filter(request => {
                const patientName = request.PatientName ? request.PatientName.toString().toLowerCase() : '';
                const contact = request.ContactNumber ? request.ContactNumber.toString().toLowerCase() : '';
                const bloodType = request.BloodType ? request.BloodType.toString().toLowerCase() : '';
                const units = request.UnitsRequired ? request.UnitsRequired.toString().toLowerCase() : '';
                const doctor = request.doctorName ? request.doctorName.toString().toLowerCase() : '';
                const specialization = request.specialization ? request.specialization.toString().toLowerCase() : '';

                return (
                    patientName.includes(lowercasedSearch) ||
                    contact.includes(lowercasedSearch) ||
                    bloodType.includes(lowercasedSearch) ||
                    units.includes(lowercasedSearch) ||
                    doctor.includes(lowercasedSearch) ||
                    specialization.includes(lowercasedSearch)
                );
            });
            setFilteredRequests(filtered);
        }
    }, [searchTerm, emergencyRequests]);

    const getStatusIndicator = (status) => {
        if (status === "Pending") {
            return <span className="status-indicator status-pending"></span>;
        } else if (status === "Emergency") {
            return <span className="status-indicator status-emergency"></span>;
        } else if (status === "Fulfilled" || status === "Planned") {
            return <span className="status-indicator status-fulfilled"></span>;
        } else {
            return null;
        }
    };

    if (loading) {
        return (
            <Box className="main-container">
                <AdSidemenu />
                <Box className="sidemenu">
                    <AdminNav />
                    <Box className="content-box">
                        <Typography variant="h4" className="title">
                            Emergency Alerts
                        </Typography>
                        <Box 
                            display="flex" 
                            flexDirection="column" 
                            alignItems="center" 
                            justifyContent="center" 
                            minHeight="60vh"
                        >
                            <CircularProgress size={60} />
                            <Typography variant="h6" mt={2}>
                                Loading emergency requests...
                            </Typography>
                        </Box>
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
                    <Box className="content-box">
                        <Typography variant="h4" className="title">
                            Emergency Alerts
                        </Typography>
                        <Box 
                            display="flex" 
                            flexDirection="column" 
                            alignItems="center" 
                            justifyContent="center" 
                            minHeight="60vh"
                        >
                            <Typography color="error" variant="h6">
                                Error: {error}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box className="main-container">
            <AdSidemenu />
            <Box className="sidemenu">
                <AdminNav onSearch={setSearchTerm} placeholder="Search emergency requests..." />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Emergency Alerts
                    </Typography>
                    <Typography variant="h5" className="sub-title">
                        Emergency Requests
                    </Typography>
                    <TableContainer component={Paper} className="table-container">
                        <Table aria-label="emergency requests table">
                            <TableHead>
                                <TableRow className="table-head-row">
                                    <TableCell className="table-head-cell">Patient Name</TableCell>
                                    <TableCell className="table-head-cell">Contact</TableCell>
                                    <TableCell className="table-head-cell">Blood Type</TableCell>
                                    <TableCell className="table-head-cell">Units Required</TableCell>
                                    <TableCell className="table-head-cell">Doctor</TableCell>
                                    <TableCell className="table-head-cell">Specialization</TableCell>
                                    <TableCell className="table-head-cell">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRequests.length > 0 ? (
                                    filteredRequests.map((request) => (
                                        <TableRow key={request._id} hover>
                                            <TableCell className="tableCell">
                                                {request.PatientName}
                                            </TableCell>
                                            <TableCell className="tableCell">{request.ContactNumber}</TableCell>
                                            <TableCell className="tableCell">{request.BloodType}</TableCell>
                                            <TableCell className="tableCell">{request.UnitsRequired} Units</TableCell>
                                            <TableCell className="tableCell">{request.doctorName}</TableCell>
                                            <TableCell className="tableCell">{request.specialization}</TableCell>
                                            <TableCell className="tableCell">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                                                    {getStatusIndicator(request.Status)}
                                                    {request.Status}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" className="tableCell">
                                            <Box 
                                                display="flex" 
                                                alignItems="center" 
                                                justifyContent="center" 
                                                height="200px"
                                            >
                                                <Typography variant="h6" color="textSecondary">
                                                    {searchTerm ? 'No matching emergency requests found' : 'No emergency requests found'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Box>
    );
}

export default EmergencyAlert;