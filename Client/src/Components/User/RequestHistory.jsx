import React, { useState, useEffect } from 'react';
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
    Chip,
    CircularProgress,
    Skeleton
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserNav from './UserNav';
import UserSideMenu from './UserSideMenu';
import axiosInstance from '../Service/BaseUrl';

const getBloodTypeStyle = (bloodType) => {
    const baseStyle = {
        fontWeight: 'bold',
        padding: '2px 4px',
        borderRadius: '6px',
        display: 'inline-block',
        minWidth: '36px',
        textAlign: 'center',
        fontSize: '0.85rem'
    };

    switch (bloodType) {
        case "A+":
            return { ...baseStyle, color: "#D32F2F", backgroundColor: "#FFEBEB" };
        case "A-":
            return { ...baseStyle, color: "#D32F2F", backgroundColor: "#FFD5D5" };
        case "B+":
            return { ...baseStyle, color: "#2F8FD3", backgroundColor: "#DBF0FF" };
        case "B-":
            return { ...baseStyle, color: "#2F8FD3", backgroundColor: "#C4E4FF" };
        case "AB+":
            return { ...baseStyle, color: "#6B2FD3", backgroundColor: "#E9DDFF" };
        case "AB-":
            return { ...baseStyle, color: "#6B2FD3", backgroundColor: "#D8C7FF" };
        case "O+":
            return { ...baseStyle, color: "#D32F84", backgroundColor: "#FFD9ED" };
        case "O-":
            return { ...baseStyle, color: "#ADD32F", backgroundColor: "#F3FFCA" };
        default:
            return {
                ...baseStyle,
                color: "#666",
                backgroundColor: "#f0f0f0"
            };
    }
};

function RequestHistory() {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const USERID = localStorage.getItem('UserId');
        console.log(USERID);

        if (!USERID) {
            toast.error('User ID not found');
            setLoading(false);
            return;
        }

        setLoading(true);
        axiosInstance.get(`/ShowRequestUser/${USERID}`)
            .then(response => {
                console.log(response);
                setRequests(response.data);
                setFilteredRequests(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching blood requests:', error);
                toast.error('Failed to fetch blood requests');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredRequests(requests);
        } else {
            const filtered = requests.filter(request => {
                const searchLower = searchTerm.toLowerCase();
                const patientName = String(request.PatientName || '').toLowerCase();
                const contactNumber = String(request.ContactNumber || '').toLowerCase();
                const bloodType = String(formatBloodType(request.BloodType) || '').toLowerCase();
                const status = String(getRequestStatus(request) || '').toLowerCase();

                return (
                    patientName.includes(searchLower) ||
                    contactNumber.includes(searchLower) ||
                    bloodType.includes(searchLower) ||
                    status.includes(searchLower)
                );
            });
            setFilteredRequests(filtered);
        }
    }, [searchTerm, requests]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const getStatusIndicator = (status) => {
        switch (status) {
            case "Planned":
                return <span className="status-indicator status-pending" style={{ backgroundColor: "#FFA500" }}></span>;
            case "Very Urgent":
                return <span className="status-indicator status-urgent"></span>;
            case "Emergency":
                return <span className="status-indicator status-emergency"></span>;
            case "Fulfilled":
                return <span className="status-indicator status-fulfilled"></span>;
            case "Pending":
                return <span className="status-indicator status-pending" style={{ backgroundColor: "#FFA500" }}></span>;
            default:
                return <span className="status-indicator status-pending" style={{ backgroundColor: "#FFA500" }}></span>;
        }
    };

    const formatBloodType = (bloodType) => {
        if (!bloodType) return '';
        const parts = bloodType.split('(');
        if (parts.length > 1) {
            return parts[1].replace(')', '').trim();
        }
        return bloodType;
    };

    const getRequestStatus = (request) => {
        if (request.IsDoner === "Fulfilled" || request.IsHospital === "Approved") {
            return "Fulfilled";
        }
        return "Pending";
    };

    const isDonorAccepted = (request) => {
        return request.AcceptedByDoner && 
               request.AcceptedByDoner.length > 0 &&
               request.AcceptedByDoner.some(donor => 
                   donor.donationStatus === "Accepted" || donor.donationStatus === "Fulfilled"
               );
    };

    const renderSkeletonRows = () => {
        return Array(5).fill().map((_, index) => (
            <TableRow key={index}>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                        <Skeleton variant="rounded" width={100} height={24} />
                        <Skeleton variant="rounded" width={100} height={24} />
                    </Box>
                </TableCell>
            </TableRow>
        ));
    };

    if (loading) {
        return (
            <Box className="main-container">
                <UserNav onSearch={handleSearch} />
                <Box className="sidemenu">
                    <UserSideMenu />
                    <Box className="content-box">
                        <Typography variant="h4" className="title">
                            <Skeleton variant="text" width={300} />
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '60vh',
                            flexDirection: 'column',
                            gap: 2
                        }}>
                            <CircularProgress size={60} thickness={4} />
                            <Typography variant="h6">Loading your request history...</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box className="main-container">
            <UserNav onSearch={handleSearch} />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                style={{ marginTop: "80px" }}
            />
            <Box className="sidemenu">
                <UserSideMenu />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Your Blood Requests
                    </Typography>
                    <Typography variant="h5" className="sub-title">
                        All requests with their current status
                    </Typography>
                    <TableContainer component={Paper} className="table-container">
                        <Table aria-label="blood requests table">
                            <TableHead>
                                <TableRow className="table-head-row">
                                    <TableCell className="table-head-cell">Name</TableCell>
                                    <TableCell className="table-head-cell">Contact</TableCell>
                                    <TableCell className="table-head-cell">Blood Type</TableCell>
                                    <TableCell className="table-head-cell">Units</TableCell>
                                    <TableCell className="table-head-cell">Status</TableCell>
                                    <TableCell className="table-head-cell">Approval</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    renderSkeletonRows()
                                ) : filteredRequests.length > 0 ? (
                                    filteredRequests.map((request) => {
                                        const formattedBloodType = formatBloodType(request.BloodType);
                                        const bloodTypeStyle = getBloodTypeStyle(formattedBloodType);
                                        const status = getRequestStatus(request);
                                        const donorAccepted = isDonorAccepted(request);
                                        const isHospitalAccepted = request.IsHospital === "Approved";

                                        return (
                                            <TableRow key={request._id} hover>
                                                <TableCell className="tableCell">
                                                    {request.PatientName}
                                                </TableCell>
                                                <TableCell className="tableCell">{request.ContactNumber}</TableCell>
                                                <TableCell className="tableCell">
                                                    <Box sx={bloodTypeStyle}>
                                                        {formattedBloodType}
                                                    </Box>
                                                </TableCell>
                                                <TableCell className="tableCell">
                                                    {request.UnitsRequired} {request.UnitsRequired === 1 ? 'Unit' : 'Units'}
                                                </TableCell>
                                                <TableCell className="tableCell">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                                                        {getStatusIndicator(status)}
                                                        {status}
                                                    </Box>
                                                </TableCell>
                                                <TableCell className="tableCell" style={{ width: "100px" }}>
                                                    <Box sx={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                                                        {donorAccepted ? (
                                                            <Chip
                                                                label="Donor Accepted"
                                                                color="success"
                                                                size="small"
                                                                sx={{ 
                                                                    fontWeight: 'bold',
                                                                    backgroundColor: '#4CAF50',
                                                                    color: 'white'
                                                                }}
                                                            />
                                                        ) : (
                                                            <Chip
                                                                label="Donor Pending"
                                                                color="default"
                                                                size="small"
                                                            />
                                                        )}
                                                        {isHospitalAccepted ? (
                                                            <Chip
                                                                label="Hospital Accepted"
                                                                color="success"
                                                                size="small"
                                                                sx={{ 
                                                                    fontWeight: 'bold',
                                                                    backgroundColor: '#4CAF50',
                                                                    color: 'white'
                                                                }}
                                                            />
                                                        ) : (
                                                            <Chip
                                                                label="Hospital Pending"
                                                                color="default"
                                                                size="small"
                                                            />
                                                        )}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" className="tableCell">
                                            {requests.length === 0 ? 'No blood requests found' : 'No matching requests found'}
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

export default RequestHistory;