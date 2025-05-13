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
  CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import axiosInstance from '../Service/BaseUrl';
function EmergencyPopup({ requests, onClose, DonerId, onRequestUpdate }) {
  const [open, setOpen] = useState(false);
  const [emergencyRequest, setEmergencyRequest] = useState(null);
  const [lastShownRequestId, setLastShownRequestId] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const donorData = JSON.parse(localStorage.getItem('Doner')) || '{}';

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
    if (onClose) onClose();
  };

  const handleAccept = async () => {
    if (!DonerId) {
      toast.error('Donor ID not found. Please login again.');
      return;
    }

    const { eligible, nextDate } = checkDonationEligibility();
    if (!eligible) {
      const restrictionPeriod = donorData.Gender === "Male" ? "3 months" : "4 months";
      toast.error(
        `You can only donate blood once every ${restrictionPeriod}. ` + 
        `Your next eligible donation date is ${nextDate}.`
      );
      setOpen(false);
      return;
    }

    setIsApproving(true);

    try {
      const response = await axiosInstance.post(
        `/${emergencyRequest._id}/Donerapprove`,
        { DonerId }
      );

      if (response.data) {
        toast.success('Blood request approved successfully!');
        setOpen(false);

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

  const handleReject = () => {
    setOpen(false);
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
  const { eligible, nextDate } = checkDonationEligibility();
  const restrictionPeriod = donorData.Gender === "Male" ? "3 months" : "4 months";

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
            : `You must wait ${restrictionPeriod} between donations. Next eligible date: ${nextDate}`}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 2, pt: 0 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAccept}
          disabled={isApproving || !eligible}
          sx={{
            mr: 2,
            px: 3,
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold',
            minWidth: '120px'
          }}
          startIcon={isApproving ? <CircularProgress size={20} /> : null}
        >
          {isApproving ? 'Approving...' : 'Accept'}
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