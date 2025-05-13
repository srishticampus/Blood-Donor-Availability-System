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
    Button,
    Modal,
    TextField,
    CircularProgress,
    Tabs,
    Tab
} from '@mui/material';
import HosNav from './HosNav';
import HosSidemenu from './HosSidemenu';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../Service/BaseUrl';

function RejectionModal({ open, onClose, onConfirm }) {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        if (reason.trim()) {
            onConfirm(reason);
            setReason('');
            onClose();
        } else {
            toast.warning('Please enter a rejection reason');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2
            }}>
                <Typography variant="h6" gutterBottom>
                    Reason for Rejection
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter the reason for rejection..."
                    sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirm}
                    >
                        Confirm Rejection
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

function ManageUserBlood() {
    const [requests, setRequests] = useState([]);
    const [rejectedRequests, setRejectedRequests] = useState([]);
    const [otherHospitalRequests, setOtherHospitalRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const HOSPITAL_ID = localStorage.getItem("hospitalId");

    useEffect(() => {
        fetchBloodRequests();
    }, []);

    const fetchBloodRequests = () => {
        setLoading(true);
        axiosInstance.get(`/ShowAllBloodRequest`)
            .then(response => {
                console.log(response);

                // User requests pending for this hospital
                const userRequests = response.data.filter(request =>
                    request.USERID !== null &&
                    request.USERID !== undefined &&
                    request.IsHospital === "Pending" &&
                    request.IsDoner !== "Accepted"
                );
                setRequests(userRequests);

                // Requests rejected by other hospitals
                const otherHospitalRejected = response.data.filter(request =>
                    request.USERID !== null &&
                    request.USERID !== undefined &&
                    request.IsHospital === "Rejected" &&
                    request.IsDoner !== "Accepted" &&
                    request.RejectedBy.some(rejection =>
                        rejection.hospitalId && 
                        rejection.hospitalId._id && 
                        rejection.hospitalId._id.toString() !== HOSPITAL_ID
                    ) &&
                    !request.RejectedBy.some(rejection => 
                        rejection.hospitalId && 
                        rejection.hospitalId._id && 
                        rejection.hospitalId._id.toString() === HOSPITAL_ID
                    )
                );
                setRejectedRequests(otherHospitalRejected);

                // Requests from other hospitals
                const otherHospRequests = response.data.filter(request =>
                    request.HospitalId !== null &&
                    request.HospitalId !== undefined &&
                    request.HospitalId._id.toString() !== HOSPITAL_ID &&
                    request.IsHospital === "Pending" &&
                    request.IsDoner !== "Accepted"
                );
                setOtherHospitalRequests(otherHospRequests);

                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching blood requests:', error);
                toast.error('Failed to fetch blood requests');
                setLoading(false);
            });
    };

    const handleApprove = (requestId) => {
        axiosInstance.post(`/${requestId}/approve`, {
            hospitalId: HOSPITAL_ID
        })
            .then(response => {
                toast.success('Request approved successfully');
                fetchBloodRequests(); // Refresh all lists
            })
            .catch(error => {
                console.error('Error approving request:', error);
                toast.error(error.response?.data?.message || 'Failed to approve request');
            });
    };

    const handleRejectClick = (requestId) => {
        setSelectedRequestId(requestId);
        setRejectionModalOpen(true);
    };

    const handleConfirmRejection = (reason) => {
        axiosInstance.post(`/${selectedRequestId}/reject`, {
            hospitalId: HOSPITAL_ID,
            reason: reason
        })
            .then(response => {
                toast.success('Request rejected successfully');
                fetchBloodRequests(); // Refresh all lists
            })
            .catch(error => {
                console.error('Error rejecting request:', error);
                toast.error(error.response?.data?.message || 'Failed to reject request');
            });
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

    const isActionAllowed = (status) => {
        return status === 'Planned' || status === 'Very Urgent' || status === 'Emergency';
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const filterRequests = (requestList) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return requestList.filter(request => {
            const formattedBloodType = formatBloodType(request.BloodType || '').toLowerCase();
            
            return (
                (request.PatientName?.toString().toLowerCase().includes(lowerCaseSearchTerm)) ||
                (request.ContactNumber?.toString().toLowerCase().includes(lowerCaseSearchTerm)) ||
                (formattedBloodType.includes(lowerCaseSearchTerm)) ||
                (request.UnitsRequired?.toString().includes(searchTerm)) ||
                (request.Status?.toString().toLowerCase().includes(lowerCaseSearchTerm))
            );
        });
    };

    const filterRejectedRequests = (requestList) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return requestList.filter(request => {
            const formattedBloodType = formatBloodType(request.BloodType || '').toLowerCase();
            const rejectionInfo = request.RejectedBy?.find(
                r => r.hospitalId && 
                     r.hospitalId._id && 
                     r.hospitalId._id.toString() !== HOSPITAL_ID
            );
            
            return (
                (request.PatientName?.toString().toLowerCase().includes(lowerCaseSearchTerm)) ||
                (request.ContactNumber?.toString().toLowerCase().includes(lowerCaseSearchTerm)) ||
                (formattedBloodType.includes(lowerCaseSearchTerm)) ||
                (request.UnitsRequired?.toString().includes(searchTerm)) ||
                (request.Status?.toString().toLowerCase().includes(lowerCaseSearchTerm)) ||
                (rejectionInfo?.hospitalId?.FullName?.toString().toLowerCase().includes(lowerCaseSearchTerm)) ||
                (rejectionInfo?.reason?.toString().toLowerCase().includes(lowerCaseSearchTerm))
            );
        });
    };

    const filterOtherHospitalRequests = (requestList) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return requestList.filter(request => {
            const formattedBloodType = formatBloodType(request.BloodType || '').toLowerCase();
            
            return (
                (request.PatientName?.toString().toLowerCase().includes(lowerCaseSearchTerm)) ||
                (request.ContactNumber?.toString().toLowerCase().includes(lowerCaseSearchTerm)) ||
                (formattedBloodType.includes(lowerCaseSearchTerm)) ||
                (request.UnitsRequired?.toString().includes(searchTerm)) ||
                (request.Status?.toString().toLowerCase().includes(lowerCaseSearchTerm)) ||
                (request.HospitalId?.FullName?.toString().toLowerCase().includes(lowerCaseSearchTerm))
            );
        });
    };

    const renderRequestTable = (requestList, showHospitalColumn = false) => {
        return (
            <TableContainer component={Paper} className="table-container">
                <Table aria-label="emergency requests table">
                    <TableHead>
                        <TableRow className="table-head-row">
                            {showHospitalColumn && <TableCell className="table-head-cell">Hospital</TableCell>}
                            <TableCell className="table-head-cell">Name</TableCell>
                            <TableCell className="table-head-cell">Contact</TableCell>
                            <TableCell className="table-head-cell">Blood Type</TableCell>
                            <TableCell className="table-head-cell">Units</TableCell>
                            <TableCell className="table-head-cell">Date</TableCell>
                            <TableCell className="table-head-cell">Time</TableCell>
                            <TableCell className="table-head-cell">Status</TableCell>
                            <TableCell className="table-head-cell">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requestList.length > 0 ? (
                            requestList.map((request) => {
                                const formattedBloodType = formatBloodType(request.BloodType);
                                return (
                                    <TableRow key={request._id} hover>
                                        {showHospitalColumn && (
                                            <TableCell className="tableCell">
                                                {request.HospitalId?.FullName || 'N/A'}
                                            </TableCell>
                                        )}
                                        <TableCell className="tableCell">
                                            {request.PatientName || 'N/A'}
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
                                        <TableCell className="tableCell" style={{ display: "flex", justifyContent: "center" }}>
                                            {isActionAllowed(request.Status) ? (
                                                <Box sx={{ display: 'flex', gap: '10px' }}>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        onClick={() => handleApprove(request._id)}
                                                        disabled={request.Status === 'Approved'}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleRejectClick(request._id)}
                                                        disabled={request.Status === 'Rejected'}
                                                    >
                                                        Reject
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="textSecondary">
                                                    No actions available
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={showHospitalColumn ? 9 : 8} align="center" className="tableCell">
                                    No matching requests found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    const renderRejectedRequestsTable = (requestList) => {
        return (
            <TableContainer component={Paper} className="table-container">
                <Table aria-label="rejected requests table">
                    <TableHead>
                        <TableRow className="table-head-row">
                            <TableCell className="table-head-cell">Name</TableCell>
                            <TableCell className="table-head-cell">Contact</TableCell>
                            <TableCell className="table-head-cell">Blood Type</TableCell>
                            <TableCell className="table-head-cell">Units</TableCell>
                            <TableCell className="table-head-cell">Status</TableCell>
                            <TableCell className="table-head-cell">Rejected By</TableCell>
                            <TableCell className="table-head-cell">Reason</TableCell>
                            <TableCell className="table-head-cell">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requestList.length > 0 ? (
                            requestList.map((request) => {
                                const formattedBloodType = formatBloodType(request.BloodType);
                                const rejectionInfo = request.RejectedBy.find(
                                    r => r.hospitalId && 
                                         r.hospitalId._id && 
                                         r.hospitalId._id.toString() !== HOSPITAL_ID
                                );

                                return (
                                    <TableRow key={request._id + '-rejected'} hover>
                                        <TableCell className="tableCell">
                                            {request.PatientName || 'N/A'}
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
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                                                {getStatusIndicator(request.Status)}
                                                {request.Status || 'N/A'}
                                            </Box>
                                        </TableCell>
                                        <TableCell className="tableCell">
                                            {rejectionInfo?.hospitalId?.FullName || 'Unknown Hospital'}
                                        </TableCell>
                                        <TableCell className="tableCell">
                                            {rejectionInfo?.reason || 'No reason provided'}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: '10px' }}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={() => handleApprove(request._id)}
                                                    disabled={request.Status === 'Approved'}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleRejectClick(request._id)}
                                                    disabled={request.Status === 'Rejected'}
                                                >
                                                    Reject
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center" className="tableCell">
                                    No matching requests found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    if (loading) {
        return (
            <Box className="main-container">
                <HosNav searchTerm={searchTerm} onSearchChange={(e) => setSearchTerm(e.target.value)} />
                <Box className="sidemenu">
                    <HosSidemenu />
                    <Box className="content-box">
                        <Typography variant="h4" className="title">
                            Blood Request Management
                        </Typography>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            height: '200px' 
                        }}>
                            <CircularProgress />
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box className="main-container">
            <HosNav 
                searchTerm={searchTerm} 
                onSearchChange={(e) => setSearchTerm(e.target.value)} 
            />
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
                    
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="blood request tabs">
                            <Tab label="Pending User Requests" />
                            <Tab label="Rejected by Other Hospitals" />
                            <Tab label="Other Hospital Requests" />
                        </Tabs>
                    </Box>

                    {tabValue === 0 && (
                        <>
                            <Typography variant="h5" className="sub-title">
                                Pending User Blood Requests
                            </Typography>
                            {renderRequestTable(filterRequests(requests))}
                        </>
                    )}

                    {tabValue === 1 && (
                        <>
                            <Typography variant="h5" className="sub-title">
                                Requests Rejected by Other Hospitals
                            </Typography>
                            {renderRejectedRequestsTable(filterRejectedRequests(rejectedRequests))}
                        </>
                    )}

                    {tabValue === 2 && (
                        <>
                            <Typography variant="h5" className="sub-title">
                                Requests from Other Hospitals
                            </Typography>
                            {renderRequestTable(filterOtherHospitalRequests(otherHospitalRequests), true)}
                        </>
                    )}
                </Box>
            </Box>

            <RejectionModal
                open={rejectionModalOpen}
                onClose={() => setRejectionModalOpen(false)}
                onConfirm={handleConfirmRejection}
            />
        </Box>
    );
}

export default ManageUserBlood;