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
import EmergencyPopup from './EmergencyPopup';
import { baseUrl } from '../../baseUrl';

function DonerBloodRequest() {
    const DonerId = localStorage.getItem("DonerId");
    const donorData = JSON.parse(localStorage.getItem('Doner') || '{}');
    const donorBloodType = (localStorage.getItem('DonerBloodType') || "").replace(/"/g, '').trim().toUpperCase();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approvingId, setApprovingId] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBloodRequests();
    }, []);

    const filterRequests = (requests, term) => {
        if (!term) return requests;

        const lowerCaseTerm = term.toLowerCase();

        return requests.filter(request => {
            return (
                (request.PatientName && request.PatientName.toLowerCase().includes(lowerCaseTerm)) ||
                String(request.ContactNumber).toLowerCase().includes(lowerCaseTerm) ||
                (request.Status && request.Status.toLowerCase().includes(lowerCaseTerm))
            );
        });
    };

    const formatDisplayDate = (date) => {
        return date ? date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : '';
    };

    const checkDonationEligibility = () => {
        if (!donorData || !donorData.donationHistory || donorData.donationHistory.length === 0) {
            return { eligible: true, nextDate: null };
        }

        const lastDonationDate = new Date(donorData.donationHistory[donorData.donationHistory.length - 1]);
        const currentDate = new Date();
        const timeDiff = currentDate - lastDonationDate;
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

        const nextDonationDate = calculateNextDonationDate();
        const formattedNextDate = formatDisplayDate(nextDonationDate);

        if (donorData.Gender === "Male" && daysDiff < 90) {
            return { eligible: false, nextDate: formattedNextDate };
        } else if (donorData.Gender === "Female" && daysDiff < 120) {
            return { eligible: false, nextDate: formattedNextDate };
        }

        return { eligible: true, nextDate: null };
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
    };;

    const fetchBloodRequests = () => {
        setLoading(true);
        axios.get(`${baseUrl}ShowAllBloodRequest`)
            .then(response => {
                console.log(response);
                
                if (response.data && Array.isArray(response.data)) {
                    const cleanDonorBloodType = donorBloodType.replace(/"/g, '').trim().toUpperCase();
                    const currentDonorId = localStorage.getItem("DonerId");
    
                    const filteredRequests = response.data.filter(request => {
                        // Skip if request is already approved by hospital
                        if (request.IsHospital === "Approved") return false;
    
                        if (!request.BloodType) return false;
    
                        const requestBloodType = formatBloodType(request.BloodType);
                        if (requestBloodType !== cleanDonorBloodType) return false;
    
                        if (request.AcceptedByDoner && Array.isArray(request.AcceptedByDoner)) {
                            const hasAccepted = request.AcceptedByDoner.some(
                                acceptance => acceptance.donerId._id === currentDonorId
                            );
                            if (hasAccepted) return false;
                        }
    
                        if (request.RejectedByDoner && Array.isArray(request.RejectedByDoner)) {
                            const hasRejected = request.RejectedByDoner.some(
                                rejection => rejection.donerId === currentDonorId
                            );
                            if (hasRejected) return false;
                        }
    
                        return request.IsDoner === "Pending";
                    });
    
                    setRequests(filteredRequests);
                } else {
                    setRequests([]);
                    toast.warning('No blood requests data found');
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching blood requests:', error);
                toast.error('Failed to fetch blood requests');
                setLoading(false);
            });
    };
    const handleApprove = async (requestId) => {
        if (!DonerId) {
            toast.error('Donor ID not found. Please login again.');
            return;
        }

        // Check donation eligibility
        const { eligible, nextDate } = checkDonationEligibility();
        if (!eligible) {
            const restrictionPeriod = donorData.Gender === "Male" ? "3 months" : "4 months";
            toast.error(
                `You can only donate blood once every ${restrictionPeriod}. ` +
                `Your next eligible donation date is ${nextDate}.`
            );
            return;
        }

        setApprovingId(requestId);

        try {
            const response = await axios.post(
                `${baseUrl}${requestId}/Donerapprove`,
                { DonerId }
            );

            if (response.data) {
                toast.success('Request approved successfully');
                setRequests(prevRequests =>
                    prevRequests.filter(request => request._id !== requestId)
                );
            }
        } catch (error) {
            console.error('Error approving request:', error);
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.message ||
                'Failed to approve request';
            toast.error(errorMessage);
        } finally {
            setApprovingId(null);
        }
    };

    const handleReject = async (requestId) => {
        if (!DonerId) {
            toast.error('Donor ID not found. Please login again.');
            return;
        }

        setRejectingId(requestId);

        try {
            const response = await axios.post(
                `${baseUrl}${requestId}/DonerReject`,
                { donerId: DonerId }
            );

            if (response.data) {
                toast.success('Request rejected successfully');
                setRequests(prevRequests =>
                    prevRequests.filter(request => request._id !== requestId)
                );
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.message ||
                'Failed to reject request';
            toast.error(errorMessage);
        } finally {
            setRejectingId(null);
        }
    };

    const handleRequestUpdate = (updatedRequestId) => {
        setRequests(prevRequests =>
            prevRequests.filter(request => request._id !== updatedRequestId)
        );
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

    if (loading) {
        return (
            <Box className="main-container">
                <DonerNav
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
                <Box className="sidemenu">
                    <DonerSideMenu />
                    <Box className="content-box">
                        <Typography variant="h4" className="title">
                            Blood Request Management
                        </Typography>
                        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                            <CircularProgress />
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box className="main-container">
            <DonerNav
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
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
                <DonerSideMenu />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Blood Donation Requests
                    </Typography>
                    <Typography variant="h6" className="sub-title">
                        Available Requests Matching Your Blood Type: {donorBloodType}
                    </Typography>

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
                                {filterRequests(requests, searchTerm).length > 0 ? (
                                    filterRequests(requests, searchTerm).map((request) => {
                                        const formattedBloodType = formatBloodType(request.BloodType);
                                        const isRejected = request.IsDoner === "Rejected";
                                        const rejectedByCurrentDonor = request.RejectedByDoner?.some(
                                            rejection => rejection.donerId === DonerId
                                        );

                                        if (rejectedByCurrentDonor) return null;

                                        const { eligible, nextDate } = checkDonationEligibility();
                                        const restrictionPeriod = donorData.Gender === "Male" ? "3 months" : "4 months";
                                        const tooltipText = eligible
                                            ? "Accept this request"
                                            : `You must wait ${restrictionPeriod} between donations. Next eligible date: ${nextDate}`;

                                        return (
                                            <TableRow key={request._id} hover>
                                                <TableCell className="tableCell">
                                                    {request.PatientName || 'N/A'}
                                                </TableCell>
                                                <TableCell className="tableCell">
                                                    {request.doctorName || 'N/A'}
                                                </TableCell>
                                                <TableCell className="tableCell">
                                                    {String(request.ContactNumber) || "N/A"}
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
                                                    <Box display="flex" gap={1} justifyContent={"center"}>
                                                        <Tooltip title={tooltipText}>
                                                            <span>
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={() => handleApprove(request._id)}
                                                                    disabled={approvingId === request._id || !eligible}
                                                                    size="small"
                                                                >
                                                                    {approvingId === request._id ? (
                                                                        <CircularProgress size={20} />
                                                                    ) : 'Accept'}
                                                                </Button>
                                                            </span>
                                                        </Tooltip>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            onClick={() => handleReject(request._id)}
                                                            disabled={rejectingId === request._id}
                                                            size="small"
                                                        >
                                                            {rejectingId === request._id ? (
                                                                <CircularProgress size={20} />
                                                            ) : 'Reject'}
                                                        </Button>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" className="tableCell">
                                            <Box py={4}>
                                                <Typography variant="h6" color="textSecondary">
                                                    {searchTerm ?
                                                        'No requests match your search criteria' :
                                                        'No available blood requests matching your blood type'}
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

            <EmergencyPopup
                requests={requests.filter(req => req.Status === "Emergency")}
                onClose={() => { }}
                DonerId={DonerId}
                onRequestUpdate={handleRequestUpdate}
            />
        </Box>
    );
}

export default DonerBloodRequest;