import React, { useState, useEffect } from 'react';
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
    CircularProgress,
    Tooltip
} from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DonerNav from './DonerNav';
import DonerSideMenu from './DonerSideMenu';
import axiosInstance from '../Service/BaseUrl';
function Approving() {
    const DonerId = localStorage.getItem("DonerId");
    const donorData = JSON.parse(localStorage.getItem('Doner') || '{}');
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approvingId, setApprovingId] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasDonated, setHasDonated] = useState(false);
    const [nextDonationDate, setNextDonationDate] = useState(null);

    useEffect(() => {
        fetchBloodRequests()
            .then(() => checkDonationEligibility())
            .catch(error => {
                console.error('Initialization error:', error);
                toast.error('Failed to initialize data');
            });
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredRequests(requests);
        } else {
            const filtered = requests.filter(request => {
                const patientMatch = request.PatientName?.toString().toLowerCase().includes(searchTerm.toLowerCase());
                const contactMatch = request.ContactNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase());
                const statusMatch = request.Status?.toString().toLowerCase().includes(searchTerm.toLowerCase());
                
                return patientMatch || contactMatch || statusMatch;
            });
            setFilteredRequests(filtered);
        }
    }, [searchTerm, requests]);

    const formatDisplayDate = (date) => {
        return date ? date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }) : '';
    };

    const checkDonationEligibility = () => {
        return new Promise((resolve) => {
            if (!donorData || !donorData.donationHistory || donorData.donationHistory.length === 0) {
                setHasDonated(false);
                setNextDonationDate(null);
                resolve({ eligible: true, nextDate: null });
                return;
            }

            const lastDonationDate = new Date(donorData.donationHistory[donorData.donationHistory.length - 1]);
            const currentDate = new Date();
            const timeDiff = currentDate - lastDonationDate;
            const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

            const nextDonationDate = calculateNextDonationDate();
            const formattedNextDate = formatDisplayDate(nextDonationDate);

            if (donorData.Gender === "Male" && daysDiff < 90) {
                setHasDonated(true);
                setNextDonationDate(nextDonationDate);
                resolve({ eligible: false, nextDate: formattedNextDate });
            } else if (donorData.Gender === "Female" && daysDiff < 120) {
                setHasDonated(true);
                setNextDonationDate(nextDonationDate);
                resolve({ eligible: false, nextDate: formattedNextDate });
            } else {
                setHasDonated(false);
                setNextDonationDate(null);
                resolve({ eligible: true, nextDate: null });
            }
        });
    };

    const calculateNextDonationDate = () => {
        if (!donorData || !donorData.donationHistory || donorData.donationHistory.length === 0) {
            return null;
        }

        const lastDonationDate = new Date(donorData.donationHistory[donorData.donationHistory.length - 1]);
        const nextDonationDate = new Date(lastDonationDate);
        
        if (donorData.Gender === "Male") {
            nextDonationDate.setDate(nextDonationDate.getDate() + 90);
        } else {
            nextDonationDate.setDate(nextDonationDate.getDate() + 120);
        }

        return nextDonationDate;
    };

const fetchBloodRequests = () => {
    return new Promise((resolve, reject) => {
        setLoading(true);
        axiosInstance.get(`/ShowAllBloodRequest`)
            .then(response => {
                console.log(response);

                if (response.data && Array.isArray(response.data)) {
                    const currentDonorId = localStorage.getItem("DonerId");

                    const filteredRequests = response.data.filter(request => {
                        // Check if current donor has accepted this request
                        const hasAccepted = request.AcceptedByDoner?.some(
                            a => a?.donerId && a.donerId._id === currentDonorId
                        );

                        // Check if current donor has already fulfilled this request
                        const hasFulfilled = request.AcceptedByDoner?.some(
                            a => a?.donerId && a.donerId._id === currentDonorId && a.donationStatus === "Fulfilled"
                        );

                        return hasAccepted && !hasFulfilled;
                    });

                    setRequests(filteredRequests);
                    setFilteredRequests(filteredRequests);
                    resolve(filteredRequests);
                } else {
                    setRequests([]);
                    setFilteredRequests([]);
                    resolve([]);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error('Failed to fetch requests');
                reject(error);
            })
            .finally(() => {
                setLoading(false);
            });
    });
};
    const handleApprove = (requestId) => {
        if (!DonerId || isProcessing) {
            toast.error('Donor ID not found');
            return;
        }

        if (hasDonated) {
            const restrictionPeriod = donorData.Gender === "Male" ? "3 months" : "4 months";
            toast.error(
                `You can only donate blood once every ${restrictionPeriod}. ` + 
                `Your next eligible donation date is ${formatDisplayDate(nextDonationDate)}.`
            );
            return;
        }

        setApprovingId(requestId);
        setIsProcessing(true);

        axiosInstance.post(`/FullFill/${requestId}`, { DonerId })
            .then(response => {
                if (response.data) {
                    toast.success('Donation marked as fulfilled');
                    setHasDonated(true);
                    setNextDonationDate(calculateNextDonationDate());
                    setRequests(prev => prev.filter(r => r._id !== requestId));
                    setFilteredRequests(prev => prev.filter(r => r._id !== requestId));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error(error.response?.data?.error || 'Failed to fulfill');
            })
            .finally(() => {
                setApprovingId(null);
                setIsProcessing(false);
            });
    };

    const handleReject = (requestId) => {
        if (!DonerId) {
            toast.error('Donor ID not found. Please login again.');
            return;
        }

        setRejectingId(requestId);

        axiosInstance.post(`/Cancel/${requestId}`, { donerId: DonerId })
            .then(response => {
                if (response.data) {
                    toast.success('Request rejected successfully');
                    setRequests(prevRequests =>
                        prevRequests.filter(request => request._id !== requestId)
                    );
                    setFilteredRequests(prevRequests =>
                        prevRequests.filter(request => request._id !== requestId)
                    );
                }
            })
            .catch(error => {
                console.error('Error rejecting request:', error);
                const errorMessage = error.response?.data?.error ||
                    error.response?.data?.message ||
                    'Failed to reject request';
                toast.error(errorMessage);
            })
            .finally(() => {
                setRejectingId(null);
            });
    };

    const getStatusIndicator = (status) => {
        switch (status) {
            case "Planned": return <span className="status-indicator status-pending"></span>;
            case "Very Urgent": return <span className="status-indicator status-urgent"></span>;
            case "Emergency": return <span className="status-indicator status-emergency"></span>;
            case "Fulfilled": return <span className="status-indicator status-fulfilled"></span>;
            case "Approved": return <span className="status-indicator status-approved"></span>;
            case "Rejected": return <span className="status-indicator status-rejected"></span>;
            default: return <span className="status-indicator status-pending"></span>;
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
            case "A+": return { ...baseStyle, color: "#D32F2F", backgroundColor: "#FFEBEB" };
            case "A-": return { ...baseStyle, color: "#D32F2F", backgroundColor: "#FFD5D5" };
            case "B+": return { ...baseStyle, color: "#2F8FD3", backgroundColor: "#DBF0FF" };
            case "B-": return { ...baseStyle, color: "#2F8FD3", backgroundColor: "#C4E4FF" };
            case "AB+": return { ...baseStyle, color: "#6B2FD3", backgroundColor: "#E9DDFF" };
            case "AB-": return { ...baseStyle, color: "#6B2FD3", backgroundColor: "#D8C7FF" };
            case "O+": return { ...baseStyle, color: "#D32F84", backgroundColor: "#FFD9ED" };
            case "O-": return { ...baseStyle, color: "#ADD32F", backgroundColor: "#F3FFCA" };
            default: return { ...baseStyle, color: "#666", backgroundColor: "#f0f0f0" };
        }
    };

    const formatBloodType = (bloodType) => {
        if (!bloodType) return '';
        const match = bloodType.match(/\(?([ABO][+-])\)?/i);
        return match ? match[1].toUpperCase() : bloodType.toUpperCase();
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

    return (
        <Box className="main-container">
            <DonerNav searchTerm={searchTerm} onSearchChange={setSearchTerm} />
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
                <DonerSideMenu />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Blood Donation Requests
                    </Typography>
                    <Typography variant="h6" className="sub-title">
                        Approving Blood Donation Request
                    </Typography>

                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                            <CircularProgress size={60} />
                        </Box>
                    ) : (
                        <TableContainer component={Paper} className="table-container">
                            <Table aria-label="blood requests table">
                                <TableHead>
                                    <TableRow className="table-head-row">
                                        <TableCell className="table-head-cell">Patient</TableCell>
                                        <TableCell className="table-head-cell">Doctor</TableCell>
                                        <TableCell className="table-head-cell">Contact</TableCell>
                                        <TableCell className="table-head-cell">Blood Type</TableCell>
                                        <TableCell className="table-head-cell">Units</TableCell>
                                        <TableCell className="table-head-cell">When Needed</TableCell>
                                        <TableCell className="table-head-cell">Status</TableCell>
                                        <TableCell className="table-head-cell">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredRequests.length > 0 ? (
                                        filteredRequests.map((request) => {
                                            const formattedBloodType = formatBloodType(request.BloodType);
                                            const rejectedByCurrentDonor = request.RejectedByDoner?.some(
                                                rejection => rejection.donerId === DonerId
                                            );

                                            if (rejectedByCurrentDonor) return null;

                                            const restrictionPeriod = donorData.Gender === "Male" ? "3 months" : "4 months";
                                            const tooltipText = hasDonated 
                                                ? `You must wait ${restrictionPeriod} between donations. Next eligible date: ${formatDisplayDate(nextDonationDate)}` 
                                                : "Mark this donation as fulfilled";

                                            return (
                                                <TableRow key={request._id} hover>
                                                    <TableCell className="tableCell">
                                                        {request.PatientName || 'N/A'}
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
                                                        <Box>
                                                            <Typography>{formatDate(request.Date)}</Typography>
                                                            <Typography variant="body2">
                                                                {formatTime(request.Time)}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell className="tableCell">
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                                                            {getStatusIndicator(request.Status)}
                                                            {request.Status || 'N/A'}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell className="tableCell">
                                                        <Box display="flex" gap={1} justifyContent={'center'}>
                                                            <Tooltip title={tooltipText}>
                                                                <span>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="success"
                                                                        onClick={() => {
                                                                            if (hasDonated) {
                                                                                toast.error(
                                                                                    `You can only donate blood once every ${restrictionPeriod}. ` + 
                                                                                    `Your next eligible donation date is ${formatDisplayDate(nextDonationDate)}.`
                                                                                );
                                                                            } else {
                                                                                handleApprove(request._id);
                                                                            }
                                                                        }}
                                                                        disabled={approvingId === request._id || hasDonated}
                                                                        size="small"
                                                                    >
                                                                        {approvingId === request._id ? (
                                                                            <CircularProgress size={20} />
                                                                        ) : 'FullFilled'}
                                                                    </Button>
                                                                </span>
                                                            </Tooltip>
                                                            <Button
                                                                variant="outlined"
                                                                style={{ backgroundColor: "#E53935", color: "white" }}
                                                                onClick={() => handleReject(request._id)}
                                                                disabled={rejectingId === request._id || hasDonated}
                                                                size="small"
                                                            >
                                                                {rejectingId === request._id ? (
                                                                    <CircularProgress size={20} />
                                                                ) : 'Canceled'}
                                                            </Button>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center" className="tableCell">
                                                <Box 
                                                    display="flex" 
                                                    justifyContent="center" 
                                                    alignItems="center" 
                                                    height="300px"
                                                    flexDirection="column"
                                                >
                                                    <Typography variant="h6" color="textSecondary" gutterBottom>
                                                        {searchTerm ? 
                                                            'No matching requests found' : 
                                                            'No available blood requests matching your blood type'}
                                                    </Typography>
                                                    {/* {!searchTerm && (
                                                        <Typography variant="body2" color="textSecondary">
                                                            Please check back later or contact the blood bank
                                                        </Typography>
                                                    )} */}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default Approving;