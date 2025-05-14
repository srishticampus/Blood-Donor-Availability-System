import React, { useState, useEffect } from 'react';
import '../../Styles/TableStyle.css';
import { Link } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../Service/BaseUrl';
function HosCompletedReq() {
  const HospitalId = localStorage.getItem('hospitalId');
  const [completedDonations, setCompletedDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompletedRequests();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredDonations(completedDonations);
    } else {
      const filtered = completedDonations.filter(donation => {
        const searchLower = searchTerm.toLowerCase();
        const formattedBloodType = formatBloodType(donation.BloodType).toLowerCase();
        
        return (
          (donation.PatientName && donation.PatientName.toLowerCase().includes(searchLower)) ||
          (donation.ContactNumber && donation.ContactNumber.toString().includes(searchLower)) ||
          (donation.BloodType && formattedBloodType.includes(searchLower)) ||
          (donation.UnitsRequired && donation.UnitsRequired.toString().includes(searchLower)) ||
          (donation.doctorName && donation.doctorName.toLowerCase().includes(searchLower)) ||
          (donation.specialization && donation.specialization.toLowerCase().includes(searchLower)) ||
          (donation.Date && formatDate(donation.Date).toLowerCase().includes(searchLower)) ||
          (donation.Time && donation.Time.toLowerCase().includes(searchLower))
        );
      });
      setFilteredDonations(filtered);
    }
  }, [searchTerm, completedDonations]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchCompletedRequests = () => {
    setLoading(true);
    axiosInstance.get('/ShowAllBloodRequest')
      .then(response => {
        const filteredRequests = response.data.filter(request => 
          request.IsHospital === "Approved" && 
          request.AcceptedBy && 
          request.AcceptedBy._id === HospitalId
        );
        setCompletedDonations(filteredRequests);
        setFilteredDonations(filteredRequests);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching completed requests:', error);
        toast.error('Failed to fetch completed requests');
        setLoading(false);
      });
  };

  const getBloodTypeStyle = (bloodType) => {
    const baseStyle = {
      fontWeight: 'bold',
      padding: '4px 8px',
      borderRadius: '8px',
      display: 'inline-block'
    };

    switch (bloodType) {
      case "A+": return { ...baseStyle, color: "#D32F2F", backgroundColor: "#FFEBEB" };
      case "O-": return { ...baseStyle, color: "#ADD32F", backgroundColor: "#F3FFCA" };
      case "B+": return { ...baseStyle, color: "#2F8FD3", backgroundColor: "#DBF0FF" };
      case "AB-": return { ...baseStyle, color: "#6B2FD3", backgroundColor: "#E9DDFF" };
      case "O+": return { ...baseStyle, color: "#D32F84", backgroundColor: "#FFD9ED" };
      case "B-": return { ...baseStyle, color: "#2F8FD3", backgroundColor: "#C4E4FF" };
      case "AB+": return { ...baseStyle, color: "#6B2FD3", backgroundColor: "#D8C7FF" };
      case "A-": return { ...baseStyle, color: "#D32F2F", backgroundColor: "#FFD5D5" };
      default: return baseStyle;
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

  if (loading) {
    return (
      <Box className="main-container">
        <HosNav searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        <Box className="sidemenu">
          <HosSidemenu />
          <Box className="content-box">
            <Typography variant="h4" className="title">
              Completed Requests
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
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
      <Box className="sidemenu">
        <HosSidemenu />
        <Box className="content-box">
          <Typography variant="h4" className="title">
            Completed Requests
          </Typography>
          <Typography variant="h5" className="sub-title">
            Approved Donation Requests
          </Typography>
          
          <TableContainer component={Paper} className="table-container">
            <Table aria-label="completed donations table">
              <TableHead>
                <TableRow className="table-head-row">
                  <TableCell className="table-head-cell">Patient Name</TableCell>
                  <TableCell className="table-head-cell">Contact</TableCell>
                  <TableCell className="table-head-cell">Blood Type</TableCell>
                  <TableCell className="table-head-cell">Units</TableCell>
                  <TableCell className="table-head-cell">Date</TableCell>
                  <TableCell className="table-head-cell">Time</TableCell>
                  <TableCell className="table-head-cell">Status</TableCell>
                  <TableCell className="table-head-cell">Doctor</TableCell>
                  <TableCell className="table-head-cell">Specialization</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDonations.length > 0 ? (
                  filteredDonations.map((request) => {
                    const formattedBloodType = formatBloodType(request.BloodType);
                    return (
                      <TableRow key={request._id} hover>
                        <TableCell className="tableCell">{request.PatientName || 'N/A'}</TableCell>
                        <TableCell className="tableCell">{request.ContactNumber || 'N/A'}</TableCell>
                        <TableCell className="tableCell">
                          <Box component="span" sx={getBloodTypeStyle(formattedBloodType)}>
                            {formattedBloodType || 'N/A'}
                          </Box>
                        </TableCell>
                        <TableCell className="tableCell">
                          {request.UnitsRequired || 0} {request.UnitsRequired === 1 ? 'Unit' : 'Units'}
                        </TableCell>
                        <TableCell className="tableCell">{formatDate(request.Date)}</TableCell>
                        <TableCell className="tableCell">{request.Time || 'N/A'}</TableCell>
                        <TableCell style={{display:"flex", justifyContent:"center"}}>
                          <Box className="statusPill">
                            <CheckIcon className="statusIcon" />
                            FullFilled
                          </Box>
                        </TableCell>
                        <TableCell className="tableCell">{request.doctorName || 'N/A'}</TableCell>
                        <TableCell className="tableCell">{request.specialization || 'N/A'}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center" className="tableCell">
                      {searchTerm ? 'No matching completed requests found' : 'No completed requests found that were approved by your hospital.'}
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

export default HosCompletedReq;