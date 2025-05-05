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
    Typography
} from '@mui/material';
import { Link } from 'react-router-dom';

function EmergencyAlert() {
    const [emergencyRequests, setEmergencyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:4005/ShowAllBloodRequest')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch emergency requests');
                }
                return response.json();
            })
            .then(data => {
                const emergencyOnly = data.filter(request => request.Status === "Emergency");
                setEmergencyRequests(emergencyOnly);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

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
                        <Typography>Loading emergency requests...</Typography>
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
                        <Typography color="error">Error: {error}</Typography>
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
                                    {/* <TableCell className="table-head-cell">View More</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {emergencyRequests.length > 0 ? (
                                    emergencyRequests.map((request) => (
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
                                            {/* <TableCell className="tableCell">
                                                <Link 
                                                    to={`/emergency-alerts/${request._id}`}
                                                    style={{
                                                        textDecoration: 'none',
                                                        color: '#2196F3',
                                                        fontWeight: 500,
                                                        '&:hover': {
                                                            textDecoration: 'underline'
                                                        }
                                                    }}
                                                >
                                                    View Details
                                                </Link>
                                            </TableCell> */}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            No emergency requests found
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