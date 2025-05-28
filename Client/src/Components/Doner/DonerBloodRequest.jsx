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
    Tooltip,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DonerNav from './DonerNav';
import DonerSideMenu from './DonerSideMenu';
import EmergencyPopup from './EmergencyPopup';
import axiosInstance from '../Service/BaseUrl';
import { Link } from 'react-router-dom';

function DonerBloodRequest() {
    const DonerId = localStorage.getItem("DonerId");
    const donorBloodType = (localStorage.getItem('DonerBloodType') || "").replace(/"/g, '').trim().toUpperCase();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approvingId, setApprovingId] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [donorData, setDonorData] = useState({});
    const [healthInfoComplete, setHealthInfoComplete] = useState(true);
    const [predictionDialogOpen, setPredictionDialogOpen] = useState(false);
    const [currentRequestId, setCurrentRequestId] = useState(null);
    const [predictionData, setPredictionData] = useState({
        recency: '',
        frequency: '',
        monetary: '',
        time: ''
    });
    const [predictionResult, setPredictionResult] = useState(null);
    const [predictionLoading, setPredictionLoading] = useState(false);

    useEffect(() => {
        fetchBloodRequests();
        fetchDonorData();
    }, []);

    const fetchDonorData = async () => {
        try {
            const response = await axiosInstance.post(`/findDoner/${DonerId}`);
            const data = response.data.data;
            console.log(data);
            
            setDonorData(data);
            
            const isHealthInfoComplete = 
                data.SurgicalHistory && data.SurgicalHistory.length > 0 &&
                data.medicines && data.medicines.length > 0 &&
                data.vaccinationsTaken && data.vaccinationsTaken.length > 0;
            
            setHealthInfoComplete(isHealthInfoComplete);
        } catch (error) {
            console.error('Error fetching donor data:', error);
            setHealthInfoComplete(false);
        }
    };

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
        return date && !isNaN(new Date(date)) ? new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : '';
    };

    const checkDonationEligibility = () => {
        // Check if donor is pregnant or breastfeeding
        if (donorData.PregnancyorBreastfeed === "Yes") {
            return { 
                eligible: false, 
                nextDate: null,
                restrictionReason: "Pregnant or breastfeeding donors cannot donate blood for safety reasons."
            };
        }

        if (!donorData || !donorData.donationHistory || donorData.donationHistory.length === 0) {
            return { eligible: true, nextDate: null, restrictionReason: null };
        }

        const lastDonationDate = new Date(donorData.donationHistory[donorData.donationHistory.length - 1]);
        const currentDate = new Date();
        const timeDiff = currentDate - lastDonationDate;
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

        let minDaysRequired;
        if (donorData.Gender === "Female") {
            minDaysRequired = 120; // 4 months
        } else {
            minDaysRequired = 90; // 3 months for Male/Third Gender
        }

        const nextDonationDate = calculateNextDonationDate();
        const formattedNextDate = formatDisplayDate(nextDonationDate);

        if (daysDiff < minDaysRequired) {
            const restrictionPeriod = donorData.Gender === "Female" ? "4 months" : "3 months";
            return { 
                eligible: false, 
                nextDate: formattedNextDate,
                restrictionReason: `You can only donate blood once every ${restrictionPeriod}. Your next eligible donation date is ${formattedNextDate}.`
            };
        }

        return { eligible: true, nextDate: null, restrictionReason: null };
    };

    const calculateNextDonationDate = () => {
        if (!donorData || !donorData.donationHistory || donorData.donationHistory.length === 0) {
            return null;
        }

        const lastDonationDate = new Date(donorData.donationHistory[donorData.donationHistory.length - 1]);
        const nextDonationDate = new Date(lastDonationDate);

        if (donorData.Gender === "Female") {
            nextDonationDate.setDate(nextDonationDate.getDate() + 120);
        } else {
            nextDonationDate.setDate(nextDonationDate.getDate() + 90);
        }

        return nextDonationDate;
    };

    const fetchBloodRequests = () => {
        setLoading(true);
        axiosInstance.get(`/ShowAllBloodRequest`)
            .then(response => {
                if (response.data && Array.isArray(response.data)) {
                    const cleanDonorBloodType = donorBloodType.replace(/"/g, '').trim().toUpperCase();
                    const currentDonorId = localStorage.getItem("DonerId");

                    const filteredRequests = response.data.filter(request => {
                        if (request.IsHospital === "Approved") return false;

                        if (!request.BloodType) return false;

                        const requestBloodType = formatBloodType(request.BloodType);
                        if (requestBloodType !== cleanDonorBloodType) return false;

                        if (request.AcceptedByDoner && Array.isArray(request.AcceptedByDoner)) {
                            const hasAccepted = request.AcceptedByDoner.some(
                                acceptance => acceptance.donerId && acceptance.donerId._id === currentDonorId
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

    const handleOpenPredictionDialog = (requestId) => {
        setCurrentRequestId(requestId);
        setPredictionDialogOpen(true);
        setPredictionResult(null);
        setPredictionData({
            recency: '',
            frequency: '',
            monetary: '',
            time: ''
        });
    };

    const handleClosePredictionDialog = () => {
        setPredictionDialogOpen(false);
        setPredictionResult(null);
    };

    const handlePredictionInputChange = (e) => {
        const { name, value } = e.target;
        setPredictionData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePredictionSubmit = async () => {
        setPredictionLoading(true);
        try {
            const response = await axiosInstance.post('/predict', {
                recency: parseInt(predictionData.recency),
                frequency: parseInt(predictionData.frequency),
                monetary: parseInt(predictionData.monetary),
                time: parseInt(predictionData.time)
            });
            
            if (response.data && response.data.data) {
                setPredictionResult(response.data.data);
            } else {
                throw new Error('Invalid prediction response');
            }
        } catch (error) {
            console.error('Prediction error:', error);
            toast.error('Failed to get prediction');
        } finally {
            setPredictionLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        if (!DonerId) {
            toast.error('Donor ID not found. Please login again.');
            return;
        }

        if (!healthInfoComplete) {
            toast.error('Please complete your health information before accepting requests');
            return;
        }

        const { eligible, nextDate, restrictionReason } = checkDonationEligibility();
        if (!eligible) {
            toast.error(restrictionReason);
            return;
        }

        handleOpenPredictionDialog(requestId);
    };

    const handleConfirmAccept = async () => {
        if (!currentRequestId) return;

        setApprovingId(currentRequestId);
        try {
            const response = await axiosInstance.post(
                `/${currentRequestId}/Donerapprove`,
                { DonerId }
            );

            if (response.data) {
                toast.success('Request approved successfully');
                setRequests(prevRequests =>
                    prevRequests.filter(request => request._id !== currentRequestId)
                );
                handleClosePredictionDialog();
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

        if (!healthInfoComplete) {
            toast.error('Please complete your health information before rejecting requests');
            return;
        }

        setRejectingId(requestId);

        try {
            const response = await axiosInstance.post(
                `/${requestId}/DonerReject`,
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

                    {!healthInfoComplete && (
                        <Alert severity="warning" sx={{ mb: 3 }}>
                            Please complete your health information 
                            <Link to="/doner-edit-profile" style={{ textDecoration: 'none', color: '#1976d2' , fontSize:"17px"}} className='waring-profile-incomplete'> Click Here</Link>
                        </Alert>
                    )}

                    <TableContainer component={Paper} className="table-container">
                        <Table aria-label="blood requests table">
                            <TableHead>
                                <TableRow className="table-head-row">
                                    <TableCell className="table-head-cell">Patient</TableCell>
                                    <TableCell className="table-head-cell">Contact</TableCell>
                                    <TableCell className="table-head-cell">Blood Type</TableCell>
                                    <TableCell className="table-head-cell">Units</TableCell>
                                    <TableCell className="table-head-cell">When Needed</TableCell>
                                    <TableCell className="table-head-cell" >Address</TableCell>
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

                                        const { eligible, nextDate, restrictionReason } = checkDonationEligibility();
                                        const tooltipText = eligible
                                            ? healthInfoComplete 
                                                ? "Accept this request" 
                                                : "Complete your health information to accept requests"
                                            : restrictionReason;

                                        return (
                                            <TableRow key={request._id} hover>
                                                <TableCell className="tableCell">
                                                    {request.PatientName || 'N/A'}
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
                                                <TableCell className="tableCell" >
                                                    <Box>
                                                        <Typography>{request.address}</Typography>
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
                                                                    disabled={approvingId === request._id || !eligible || !healthInfoComplete}
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
                                                            disabled={rejectingId === request._id || !healthInfoComplete}
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

            {healthInfoComplete && (
                <EmergencyPopup
                    requests={requests.filter(req => req.Status === "Emergency" || req.Status === "Very Urgent")}
                    onClose={() => { }}
                    DonerId={DonerId}
                    onRequestUpdate={handleRequestUpdate}
                />
            )}

            {/* Donation Prediction Dialog */}
<Dialog
    open={predictionDialogOpen}
    onClose={handleClosePredictionDialog}
    maxWidth="sm"
    fullWidth
>
    <DialogTitle style={{textAlign:"center"}}>
        <Typography variant="h5" fontWeight="bold">
            Donation Prediction
        </Typography>
        <Typography variant="subtitle2">
            Please provide your donation history details
        </Typography>
    </DialogTitle>
    <DialogContent>
        {!predictionResult ? (
            <>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Months since last donation"
                    name="recency"
                    type="number"
                    value={predictionData.recency}
                    onChange={handlePredictionInputChange}
                    inputProps={{ min: 0 }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Total number of donations"
                    name="frequency"
                    type="number"
                    value={predictionData.frequency}
                    onChange={handlePredictionInputChange}
                    inputProps={{ min: 0 }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Total blood donated (c.c.)"
                    name="monetary"
                    type="number"
                    value={predictionData.monetary}
                    onChange={handlePredictionInputChange}
                    inputProps={{ min: 0 }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Months since first donation"
                    name="time"
                    type="number"
                    value={predictionData.time}
                    onChange={handlePredictionInputChange}
                    inputProps={{ min: 0 }}
                />
            </>
        ) : (
            <>
                <Alert 
                    severity={predictionResult.class === 1 ? 'success' : 'warning'}
                    sx={{ mb: 2 }}
                >
                    <Typography variant="body1" fontWeight="bold">
                        Prediction: {predictionResult.class === 1 ? 'Likely to donate' : 'Unlikely to donate'}
                    </Typography>
                    <Typography variant="body2">
                        Probability: {(predictionResult.probability * 100).toFixed(2)}%
                    </Typography>
                    {predictionResult.message && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {predictionResult.message}
                        </Typography>
                    )}
                </Alert>
            </>
        )}
    </DialogContent>
    <DialogActions sx={{ justifyContent: 'space-between', padding: '16px 24px' }}>
        {!predictionResult ? (
            <>
                <Button 
                    onClick={handleClosePredictionDialog}
                    color="secondary"
                    sx={{ marginRight: 'auto' }}  // Aligns to the left
                >
                    Cancel
                </Button>
                <Button
                    onClick={handlePredictionSubmit}
                    color="primary"
                    disabled={predictionLoading || 
                        !predictionData.recency || 
                        !predictionData.frequency || 
                        !predictionData.monetary || 
                        !predictionData.time}
                    startIcon={predictionLoading ? <CircularProgress size={20} /> : null}
                    sx={{ marginLeft: 'auto' }}  // Aligns to the right
                >
                    {predictionLoading ? 'Predicting...' : 'Predict'}
                </Button>
            </>
        ) : (
            <>
                {predictionResult.class === 1 ? (
                    <>
                        <Button 
                            onClick={() => setPredictionResult(null)}
                            color="secondary"
                            sx={{ marginRight: 'auto' }}  // Aligns to the left
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleConfirmAccept}
                            color="primary"
                            disabled={approvingId === currentRequestId}
                            startIcon={approvingId === currentRequestId ? <CircularProgress size={20} /> : null}
                            sx={{ marginLeft: 'auto' }}  // Aligns to the right
                        >
                            {approvingId === currentRequestId ? 'Approving...' : 'Confirm Donation'}
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={handleClosePredictionDialog}
                        color="primary"
                        sx={{ width: '100%' }}  // Makes the Close button full width
                    >
                        Close
                    </Button>
                )}
            </>
        )}
    </DialogActions>
</Dialog>        </Box>
    );
}

export default DonerBloodRequest;