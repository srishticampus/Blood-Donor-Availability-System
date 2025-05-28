import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  TextField,
  Alert
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../Service/BaseUrl';

function EmergencyPopup({ requests, onClose, DonerId, onRequestUpdate }) {
  const [open, setOpen] = useState(false);
  const [emergencyRequest, setEmergencyRequest] = useState(null);
  const [lastShownRequestId, setLastShownRequestId] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [showPredictionForm, setShowPredictionForm] = useState(false);
  const [predictionData, setPredictionData] = useState({
    recency: '',
    frequency: '',
    monetary: '',
    time: ''
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [donorData, setDonorData] = useState({});
  const [healthInfoComplete, setHealthInfoComplete] = useState(true);
  const [isPregnantOrBreastfeeding, setIsPregnantOrBreastfeeding] = useState(false);

  // Fetch donor data on component mount
  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const response = await axiosInstance.post(`/findDoner/${DonerId}`);
        const data = response.data.data;
        setDonorData(data);
        console.log(data);
        
        // Check if donor is pregnant or breastfeeding
        if (data.PregnancyorBreastfeed === "Yes") {
          setIsPregnantOrBreastfeeding(true);
        }
        
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

    if (DonerId) {
      fetchDonorData();
    }
  }, [DonerId]);

  const checkDonationEligibility = () => {
    // First check if pregnant or breastfeeding
    if (isPregnantOrBreastfeeding) {
      return { eligible: false, reason: "Pregnant or breastfeeding donors cannot donate blood" };
    }

    if (!donorData || !donorData.donationHistory || donorData.donationHistory.length === 0) {
      return { eligible: true, nextDate: null };
    }

    // Get the most recent donation date
    const lastDonationDate = new Date(donorData.donationHistory[donorData.donationHistory.length - 1]);
    const currentDate = new Date();
    const timeDiff = currentDate - lastDonationDate;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    // Calculate minimum days required based on gender
    let minDaysRequired;
    if (donorData.Gender === "Female") {
      minDaysRequired = 120; // 4 months
    } else {
      minDaysRequired = 90; // 3 months for Male/Third Gender
    }

    const nextDonationDate = calculateNextDonationDate();
    const formattedNextDate = formatDisplayDate(nextDonationDate);

    if (daysDiff < minDaysRequired) {
      return { 
        eligible: false, 
        reason: `You can only donate blood once every ${donorData.Gender === "Female" ? "4 months" : "3 months"}. Your next eligible donation date is ${formattedNextDate}.`
      };
    }

    return { eligible: true, nextDate: null };
  };

  const calculateNextDonationDate = () => {
    if (!donorData || !donorData.donationHistory || donorData.donationHistory.length === 0) {
      return null;
    }

    const lastDonationDate = new Date(donorData.donationHistory[donorData.donationHistory.length - 1]);
    const nextDonationDate = new Date(lastDonationDate);

    // Add appropriate days based on gender
    if (donorData.Gender === "Female") {
      nextDonationDate.setDate(nextDonationDate.getDate() + 120); // 4 months
    } else {
      nextDonationDate.setDate(nextDonationDate.getDate() + 90); // 3 months for Male/Third Gender
    }

    return nextDonationDate;
  };

  const formatDisplayDate = (date) => {
    return date ? date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : '';
  };

  useEffect(() => {
    if (requests && requests.length > 0) {
      const emergencyRequests = requests.filter(req =>
        (req.Status === "Emergency" || req.Status === "Very Urgent") &&
        req.IsDoner === "Pending"
      );

      if (emergencyRequests.length > 0) {
        const sortedRequests = [...emergencyRequests].sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        const mostRecentRequest = sortedRequests[0];

        if (mostRecentRequest._id !== lastShownRequestId) {
          setEmergencyRequest(mostRecentRequest);
          setOpen(true);
          setLastShownRequestId(mostRecentRequest._id);
        }
      }
    }
  }, [requests, lastShownRequestId]);

  const handleClose = (event, reason) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    setOpen(false);
    setShowPredictionForm(false);
    setPredictionResult(null);
    if (onClose) onClose();
  };

  const handleAccept = async () => {
    if (!DonerId) {
      toast.error('Donor ID not found. Please login again.');
      return;
    }

    if (isPregnantOrBreastfeeding) {
      toast.error('Pregnant or breastfeeding donors cannot donate blood');
      return;
    }

    if (!healthInfoComplete) {
      toast.error('Please complete your health information before accepting requests');
      return;
    }

    const { eligible, reason } = checkDonationEligibility();
    if (!eligible) {
      toast.error(reason);
      setOpen(false);
      return;
    }

    setShowPredictionForm(true);
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

  const handleConfirmAccept = async () => {
    setIsApproving(true);
    try {
      const response = await axiosInstance.post(
        `/${emergencyRequest._id}/Donerapprove`,
        { DonerId }
      );

      if (response.data) {
        toast.success('Blood request approved successfully!');
        setOpen(false);
        setShowPredictionForm(false);
        setPredictionResult(null);

        if (onRequestUpdate) {
          onRequestUpdate(emergencyRequest._id);
        }

        if (onClose) onClose();
      }
    } catch (error) {
      console.error('Error approving request:', error);
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to approve request';
      toast.error(errorMessage);
    } finally {
      setIsApproving(false);
    }
  };

  const handleBackToRequest = () => {
    setShowPredictionForm(false);
    setPredictionResult(null);
  };

  const handleCancel = () => {
    setOpen(false);
    setShowPredictionForm(false);
    setPredictionResult(null);
    if (onClose) onClose();
  };

  const handleReject = () => {
    setOpen(false);
    setShowPredictionForm(false);
    setPredictionResult(null);
    if (onClose) onClose();
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

  if (!emergencyRequest) return null;

  const formattedBloodType = formatBloodType(emergencyRequest.BloodType);
  const { eligible, reason } = checkDonationEligibility();

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      onClose={handleClose}
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: '16px',
          width: '400px',
          animation: emergencyRequest.Status === "Emergency"
            ? 'pulse 0.5s infinite'
            : 'pulse 1s infinite',
          '@keyframes pulse': {
            '0%': { boxShadow: '0 0 0 0 rgba(255,0,0,0.4)' },
            '70%': { boxShadow: '0 0 0 10px rgba(255,0,0,0)' },
            '100%': { boxShadow: '0 0 0 0 rgba(255,0,0,0)' }
          }
        }
      }}
    >
      {!showPredictionForm ? (
        <>
          <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
            <Typography variant="h5" fontWeight="bold" color="error">
              {emergencyRequest.Status === "Emergency"
                ? "🚨 EMERGENCY 🚨"
                : "⚠️ URGENT REQUEST ⚠️"}
            </Typography>
            <Typography variant="subtitle2">
              Urgent requests for blood donation near you
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ px: 3, py: 1 }}>
            {isPregnantOrBreastfeeding && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Pregnant or breastfeeding donors cannot donate blood
              </Alert>
            )}

            {!healthInfoComplete && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Please complete your health information before accepting requests
              </Alert>
            )}

            <DetailRow label="Patient Name" value={emergencyRequest.PatientName} />
            <DetailRow label="Contact Number" value={emergencyRequest.ContactNumber} />
            <DetailRow label="Blood Type" value={
              <Chip
                label={formattedBloodType || 'N/A'}
                size="small"
                sx={{
                  backgroundColor: '#D32F2F',
                  color: 'white',
                  padding: "15px",
                  fontWeight: 'bold',
                  border: '1px solid #ef9a9a'
                }}
              />
            } />
            <DetailRow
              label="Units Required"
              value={`${emergencyRequest.UnitsRequired || 0} ${emergencyRequest.UnitsRequired === 1 ? 'unit' : 'units'}`}
            />
            <DetailRow label="Status" value={
              <Chip
                label={emergencyRequest.Status}
                size="small"
                sx={{
                  backgroundColor: emergencyRequest.Status === "Emergency" ? '#D32F2F' : '#FF9800',
                  color: 'white',
                  padding: "15px",
                  fontWeight: 'bold',
                  border: '1px solid #ef9a9a'
                }}
              />
            } />
            <DetailRow label="Date" value={formatDate(emergencyRequest.Date)} />
            <DetailRow label="Time" value={formatTime(emergencyRequest.Time)} />

            {donorData.donationHistory && donorData.donationHistory.length > 0 && (
              <DetailRow 
                label="Last Donation" 
                value={formatDisplayDate(new Date(donorData.donationHistory[donorData.donationHistory.length - 1]))} 
              />
            )}

            <Typography 
              variant="body2" 
              sx={{
                color: eligible ? '#4caf50' : '#f44336',
                textAlign: 'center',
                mt: 2,
                mb: 1,
                fontWeight: '500'
              }}
            >
              {eligible 
                ? "You are eligible to donate"
                : reason}
            </Typography>
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'center', pb: 2, pt: 0 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAccept}
              disabled={isApproving || !eligible || !healthInfoComplete || isPregnantOrBreastfeeding}
              sx={{
                mr: 2,
                px: 3,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 'bold',
                minWidth: '120px'
              }}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReject}
              disabled={isApproving}
              sx={{
                px: 3,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 'bold',
                minWidth: '120px'
              }}
            >
              Later
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              Donation Prediction
            </Typography>
            <Typography variant="subtitle2">
              Please provide your donation history
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ px: 3, py: 1 }}>
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
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Patient: {emergencyRequest.PatientName || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Blood Type: {formattedBloodType || 'N/A'}
                </Typography>
              </>
            )}
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'center', pb: 2, pt: 0 }}>
            {!predictionResult ? (
              <>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancel}
                  disabled={predictionLoading}
                  sx={{
                    mr: 2,
                    px: 3,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    minWidth: '120px'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePredictionSubmit}
                  disabled={predictionLoading || 
                    !predictionData.recency || 
                    !predictionData.frequency || 
                    !predictionData.monetary || 
                    !predictionData.time}
                  sx={{
                    px: 3,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    minWidth: '120px'
                  }}
                  startIcon={predictionLoading ? <CircularProgress size={20} /> : null}
                >
                  {predictionLoading ? 'Predicting...' : 'Predict'}
                </Button>
              </>
            ) : (
              <>
                {predictionResult.class === 1 ? (
                  <>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleBackToRequest}
                      sx={{
                        mr: 2,
                        px: 3,
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        minWidth: '120px'
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleConfirmAccept}
                      disabled={isApproving}
                      sx={{
                        px: 3,
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        minWidth: '120px'
                      }}
                      startIcon={isApproving ? <CircularProgress size={20} /> : null}
                    >
                      {isApproving ? 'Approving...' : 'Confirm'}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCancel}
                    sx={{
                      px: 3,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      minWidth: '120px'
                    }}
                  >
                    Close
                  </Button>
                )}
              </>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

function DetailRow({ label, value }) {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      py: 1.5,
      borderBottom: '1px solid #eee'
    }}>
      <Typography variant="body1" color="text.secondary">{label}:</Typography>
      {typeof value === 'string' ? (
        <Typography variant="body1" fontWeight="500">{value || 'N/A'}</Typography>
      ) : value}
    </Box>
  );
}

export default EmergencyPopup;