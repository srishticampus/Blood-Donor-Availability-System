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
} from '@mui/material';
import HosNav from './HosNav';
import HosSidemenu from './HosSidemenu';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from '../../baseUrl';

function ApprovedRequest() {
    const hospitalId = localStorage.getItem('hospitalId');
    console.log(hospitalId);

    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBloodRequests();
    }, []);

    useEffect(() => {
        // Filter requests whenever searchTerm or requests change
        if (searchTerm === '') {
            setFilteredRequests(requests);
        } else {
            const filtered = requests.filter(request => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    (request.PatientName && request.PatientName.toLowerCase().includes(searchLower)) ||
                    (request.specialization && request.specialization.toLowerCase().includes(searchLower)) ||
                    (request.doctorName && request.doctorName.toLowerCase().includes(searchLower)) ||
                    (request.ContactNumber && request.ContactNumber.toString().includes(searchLower)) ||
                    (request.BloodType && request.BloodType.toLowerCase().includes(searchLower)) ||
                    (request.Status && request.Status.toLowerCase().includes(searchLower))
                );
            });
            setFilteredRequests(filtered);
        }
    }, [searchTerm, requests]);

    const fetchBloodRequests = () => {
        setLoading(true);
        axios.get(`${baseUrl}ShowAllBloodRequest`)
            .then(response => {
                // Filter for requests approved by this hospital
                const approvedRequests = response.data.filter(request => 
                    request.IsHospital === "Approved" && 
                    request.AcceptedBy && 
                    request.AcceptedBy._id && 
                    request.AcceptedBy._id.toString() === hospitalId
                );
                
                setRequests(approvedRequests);
                setFilteredRequests(approvedRequests);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching blood requests:', error);
                toast.error('Failed to fetch blood requests');
                setLoading(false);
            });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const getStatusIndicator = (status) => {
        switch (status) {
            case "Planned":
                return <span className="status-indicator status-pending"></span>;
            case "Very Urgent":
                return <span className="status-indicator status-urgent"></span>;
            case "Emergency":
                return <span className="status-indicator status-emergency"></span>;
            case "Fulfilled":
                return <span className="status-indicator status-fulfilled"></span>;
            case "Approved":
                return <span className="status-indicator status-approved"></span>;
            case "Rejected":
                return <span className="status-indicator status-rejected"></span>;
            default:
                return <span className="status-indicator status-pending"></span>;
        }
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

    const formatBloodType = (bloodType) => {
        if (!bloodType) return '';
        const parts = bloodType.split('(');
        if (parts.length > 1) {
            return parts[1].replace(')', '').trim();
        }
        return bloodType;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (e) {
            return dateString;
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        try {
            const time = new Date(`1970-01-01T${timeString}`);
            return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return timeString;
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
                            Blood Request Management
                        </Typography>
                        <Typography>Loading...</Typography>
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
                        Blood Request Management
                    </Typography>
                    <Typography variant="h5" className="sub-title">
                        Approved User Blood Requests
                    </Typography>
                    <TableContainer component={Paper} className="table-container">
                        <Table aria-label="approved requests table">
                            <TableHead>
                                <TableRow className="table-head-row">
                                    <TableCell className="table-head-cell">Name</TableCell>
                                    <TableCell className="table-head-cell">Specification</TableCell>
                                    <TableCell className="table-head-cell">Doctor Name</TableCell>
                                    <TableCell className="table-head-cell">Contact</TableCell>
                                    <TableCell className="table-head-cell">Blood Type</TableCell>
                                    <TableCell className="table-head-cell">Units</TableCell>
                                    <TableCell className="table-head-cell">Date</TableCell>
                                    <TableCell className="table-head-cell">Time</TableCell>
                                    <TableCell className="table-head-cell">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRequests.length > 0 ? (
                                    filteredRequests.map((request) => {
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
                                                    {formatDate(request.Date) || 'N/A'}
                                                </TableCell>
                                                <TableCell className="tableCell">
                                                    {formatTime(request.Time) || 'N/A'}
                                                </TableCell>
                                                <TableCell className="tableCell">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                                                        {getStatusIndicator(request.Status)}
                                                        {request.Status || 'N/A'}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center" className="tableCell">
                                            {searchTerm ? 'No matching requests found' : 'No approved user blood requests found'}
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

export default ApprovedRequest;