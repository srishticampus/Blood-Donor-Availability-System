import React, { useState, useEffect } from 'react';
import AdminNav from './AdminNav';
import AdSidemenu from './AdSidemenu';
import '../../Styles/TableStyle.css';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import axiosInstance from '../Service/BaseUrl';

function CompletedRequests() {
  const [completedRequests, setCompletedRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBloodRequests();
  }, []);

  useEffect(() => {
    const filtered = completedRequests.filter(request => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (request.PatientName?.toLowerCase().includes(searchLower)) ||
        (request.ContactNumber?.toString().includes(searchTerm)) ||
        (request.BloodType?.toLowerCase().includes(searchLower)) ||
        (getApprovedByName(request)?.toLowerCase().includes(searchLower))
      );
    });
    setFilteredRequests(filtered);
  }, [searchTerm, completedRequests]);

  const fetchBloodRequests = () => {
    setLoading(true);
    axiosInstance.get(`/ShowAllBloodRequest`)
      .then((result) => {
        const filteredRequests = result.data.filter(request => 
          request.IsDoner === "Fulfilled" || request.IsHospital === "Approved"
        );
        setCompletedRequests(filteredRequests);
        setFilteredRequests(filteredRequests); 
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  const getStatusIndicator = () => {
    return <span className="status-indicator status-fulfilled"></span>;
  };

  const getApprovedByName = (request) => {
    if (request.IsDoner === "Fulfilled" && request.AcceptedByDoner?.length > 0) {
      if (request.AcceptedByDoner.length > 1) {
        return `${request.AcceptedByDoner.length} Donors`;
      }
      const donor = request.AcceptedByDoner[0];
      return donor.FullName || donor.donerId?.FullName || 'Donor';
    } 
    else if (request.IsHospital === "Approved" && request.AcceptedBy) {
      return request.AcceptedBy.FullName || 'Hospital';
    }
    return 'N/A';
  };

  const getCompletionDate = (request) => {
    if (request.IsDoner === "Fulfilled" && request.DonerFulfilledAt) {
      return new Date(request.DonerFulfilledAt).toLocaleDateString();
    } 
    else if (request.IsHospital === "Approved" && request.HospitalApprovedAt) {
      return new Date(request.HospitalApprovedAt).toLocaleDateString();
    }
    return request.Date ? new Date(request.Date).toLocaleDateString() : 'N/A';
  };

  if (loading) {
    return (
      <Box className="main-container">
        <AdSidemenu />
        <Box className="sidemenu">
          <AdminNav onSearch={setSearchTerm} />
          <Box className="content-box" sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '70vh' 
          }}>
            <CircularProgress size={60} />
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="main-container">
        <AdSidemenu />
        <Box className="sidemenu">
          <AdminNav onSearch={setSearchTerm} />
          <Box className="content-box" sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '70vh' 
          }}>
            <Typography color="error">Error: {error}</Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="main-container">
      <AdSidemenu />
      <Box className="sidemenu">
        <AdminNav onSearch={setSearchTerm} />
        <Box className="content-box">
          <Typography variant="h4" className="title">
            Completed Requests
          </Typography>
          <Typography variant="h5" className="sub-title">
            Donation History
          </Typography>
          <TableContainer className="table-container">
            <Table aria-label="completed donations table">
              <TableHead>
                <TableRow className="table-head-row">
                  <TableCell className="table-head-cell">Patient Name</TableCell>
                  <TableCell className="table-head-cell">Contact</TableCell>
                  <TableCell className="table-head-cell">Blood Type</TableCell>
                  <TableCell className="table-head-cell">Completion Date</TableCell>
                  <TableCell className="table-head-cell">Units</TableCell>
                  <TableCell className="table-head-cell">Status</TableCell>
                  <TableCell className="table-head-cell">Approved By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <TableRow key={request._id} hover>
                      <TableCell className="tableCell">{request.PatientName}</TableCell>
                      <TableCell className="tableCell">{request.ContactNumber}</TableCell>
                      <TableCell className="tableCell">{request.BloodType}</TableCell>
                      <TableCell className="tableCell">
                        {getCompletionDate(request)}
                      </TableCell>
                      <TableCell className="tableCell">{request.UnitsRequired} Unit</TableCell>
                      <TableCell className="tableCell-fulfilled" style={{ textAlign: 'center' }}>
                        {getStatusIndicator()}
                        Fulfilled
                      </TableCell>
                      <TableCell className="tableCell">
                        {getApprovedByName(request)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ height: '300px' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '100%' 
                      }}>
                        <Typography variant="h6" color="textSecondary">
                          {searchTerm ? 'No matching requests found' : 'No completed requests available'}
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
    </Box>
  );
}

export default CompletedRequests;