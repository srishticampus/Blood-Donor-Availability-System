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
    CircularProgress
} from '@mui/material';
import HosNav from './HosNav';
import HosSidemenu from './HosSidemenu';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../Service/BaseUrl';
function CanceledRequest() {
    const hospitalId = localStorage.getItem('hospitalId');
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBloodRequests();
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredRequests(requests);
        } else {
            const filtered = requests.filter(request => {
                const searchLower = searchTerm.toLowerCase();
                const hospitalRejection = request.RejectedBy?.find(
                    rejection => 
                        rejection.hospitalId && 
                        rejection.hospitalId._id === hospitalId
                );
                
                return (
                    (request.PatientName && request.PatientName.toLowerCase().includes(searchLower)) ||
                    (request.specialization && request.specialization.toLowerCase().includes(searchLower)) ||
                    (request.doctorName && request.doctorName.toLowerCase().includes(searchLower)) ||
                    (request.ContactNumber && request.ContactNumber.toString().includes(searchLower)) ||
                    (request.BloodType && request.BloodType.toLowerCase().includes(searchLower)) ||
                    (request.Status && request.Status.toLowerCase().includes(searchLower)) ||
                    (hospitalRejection?.reason && hospitalRejection.reason.toLowerCase().includes(searchLower))
                );
            });
            setFilteredRequests(filtered);
        }
    }, [searchTerm, requests, hospitalId]);

    const fetchBloodRequests = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/ShowAllBloodRequest`);
            console.log("API Response:", response.data);
    
            const rejectedRequests = response.data.filter(request => {
                const isRejectedByThisHospital = request.RejectedBy?.some(rejection => 
                    rejection.hospitalId && 
                    rejection.hospitalId._id === hospitalId
                );
                
                return isRejectedByThisHospital;
            });
    
            console.log("Filtered Rejected Requests:", rejectedRequests);
            setRequests(rejectedRequests);
            setFilteredRequests(rejectedRequests);
        } catch (error) {
            console.error('Error fetching blood requests:', error);
            toast.error('Failed to fetch blood requests');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const formatBloodType = (bloodType) => {
        if (!bloodType) return '';
        const parts = bloodType.split('(');
        if (parts.length > 1) {
            return parts[1].replace(')', '').trim();
        }
        return bloodType;
    };

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

    const getStatusIndicator = (status) => {
        const statusMap = {
            "Planned": "status-pending",
            "Very Urgent": "status-urgent",
            "Emergency": "status-emergency",
            "Fulfilled": "status-fulfilled",
            "Approved": "status-approved",
            "Rejected": "status-rejected"
        };

        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span className={`status-indicator ${statusMap[status] || "status-pending"}`}></span>
                <Typography variant="body2">{status || 'Pending'}</Typography>
            </Box>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    if (loading) {
        return (
            <Box className="main-container">
                <HosNav searchTerm={searchTerm} onSearchChange={handleSearchChange} />
                <Box className="sidemenu">
                    <HosSidemenu />
                    <Box className="content-box">
                        <Typography variant="h4" className="title">
                            Rejected Blood Requests
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box className="main-container">
            <HosNav searchTerm={searchTerm} onSearchChange={handleSearchChange} />
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
                <HosSidemenu />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Rejected Blood Requests
                    </Typography>
                    <Typography variant="h5" className="sub-title">
                        Requests rejected by this hospital
                    </Typography>

                    <TableContainer component={Paper} className="table-container" style={{width:"80vw"}}>
                        <Table aria-label="rejected requests table">
                            <TableHead>
                                <TableRow className="table-head-row">
                                    <TableCell className="table-head-cell">Patient Name</TableCell>
                                    <TableCell className="table-head-cell">Specification</TableCell>
                                    <TableCell className="table-head-cell">Doctor Name</TableCell>
                                    <TableCell className="table-head-cell">Contact</TableCell>
                                    <TableCell className="table-head-cell">Blood Type</TableCell>
                                    <TableCell className="table-head-cell">Units</TableCell>
                                    <TableCell className="table-head-cell">Status</TableCell>
                                    <TableCell className="table-head-cell">Rejection Reason</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRequests.length > 0 ? (
                                    filteredRequests.map((request) => {
                                        const hospitalRejection = request.RejectedBy.find(
                                            rejection => 
                                                rejection.hospitalId && 
                                                rejection.hospitalId._id === hospitalId
                                        );

                                        const formattedBloodType = formatBloodType(request.BloodType);

                                        return (
                                            <TableRow key={request._id} hover>
                                                <TableCell className="tableCell">
                                                    {request.PatientName || 'N/A'}
                                                </TableCell>
                                                <TableCell className="tableCell">
                                                    {request.specialization || 'N/A'}
                                                </TableCell>
                                                <TableCell className="tableCell">
                                                    {request.doctorName || 'N/A'}
                                                </TableCell>
                                                <TableCell className="tableCell">
                                                    {request.ContactNumber || 'N/A'}
                                                </TableCell>
                                                <TableCell className="tableCell">
                                                    <span style={getBloodTypeStyle(formattedBloodType)}>
                                                        {formattedBloodType || 'N/A'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="tableCell">
                                                    {request.UnitsRequired || 0} {request.UnitsRequired === 1 ? 'Unit' : 'Units'}
                                                </TableCell>
                                                <TableCell className="tableCell">
                                                    {getStatusIndicator(request.Status)}
                                                </TableCell>
                                                <TableCell className="tableCell">
                                                    {hospitalRejection?.reason || 'No reason provided'}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 2 }}>
                                            <Typography variant="body1">
                                                {searchTerm ? 'No matching rejected requests found' : 'No rejected requests found'}
                                            </Typography>
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

export default CanceledRequest;