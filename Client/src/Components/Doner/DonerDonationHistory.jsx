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
import DonerNav from './DonerNav';
import DonerSideMenu from './DonerSideMenu';
import axios from 'axios';
import axiosInstance from '../Service/BaseUrl';
function DonerDonationHistory() {
  const DonerId = localStorage.getItem("DonerId");
  const [completedDonations, setCompletedDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        const response = await axiosInstance.get('/ShowAllBloodRequest');
        console.log(response)
        const filteredData = response.data.filter(request =>
          request.AcceptedByDoner.some(donor =>
            donor.donerId &&
            donor.donerId._id.toString() === DonerId &&
            donor.donationStatus === "Fulfilled"
          )
        );
        console.log(filteredData);

        setCompletedDonations(filteredData);
        setFilteredDonations(filteredData);
      } catch (error) {
        console.error('Error fetching donation history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, [DonerId]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDonations(completedDonations);
    } else {
      const filtered = completedDonations.filter(donation =>
        donation.PatientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(donation.ContactNumber).toLowerCase().includes(searchTerm)
      );
      setFilteredDonations(filtered);
    }
  }, [searchTerm, completedDonations]);

  const getBloodTypeStyle = (bloodType) => {
    switch (bloodType) {
      case "A+":
        return { color: "#D32F2F", backgroundColor: "#FFEBEB", fontWeight: 'bold', padding: '4px 8px', borderRadius: '8px' };
      case "O-":
        return { color: "#ADD32F", backgroundColor: "#F3FFCA", fontWeight: 'bold', padding: '4px 8px', borderRadius: '8px' };
      case "B+":
        return { color: "#2F8FD3", backgroundColor: "#DBF0FF", fontWeight: 'bold', padding: '4px 8px', borderRadius: '8px' };
      case "AB-":
        return { color: "#6B2FD3", backgroundColor: "#E9DDFF", fontWeight: 'bold', padding: '4px 8px', borderRadius: '8px' };
      case "O+":
        return { color: "#D32F84", backgroundColor: "#FFD9ED", fontWeight: 'bold', padding: '4px 8px', borderRadius: '8px' };
      default:
        return {};
    }
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  if (loading) {
    return (
      <Box className="main-container">
        <DonerNav searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        <Box className="sidemenu">
          <DonerSideMenu />
          <Box className="content-box" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress size={60} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="main-container">
      <DonerNav searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <Box className="sidemenu">
        <DonerSideMenu />
        <Box className="content-box">
          <Typography variant="h4" className="title">
            Completed Requests
          </Typography>
          <Typography variant="h5" className="sub-title">
            Donation History
          </Typography>
          <TableContainer component={Paper} className="table-container">
            <Table aria-label="completed donations table">
              <TableHead>
                <TableRow className="table-head-row">
                  <TableCell className="table-head-cell">Patient Name</TableCell>
                  <TableCell className="table-head-cell">Contact</TableCell>
                  <TableCell className="table-head-cell">Blood Group</TableCell>
                  <TableCell className="table-head-cell">Donation Date</TableCell>
                  <TableCell className="table-head-cell">Units</TableCell>
                  <TableCell className="table-head-cell">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDonations.length > 0 ? (
                  filteredDonations.map((request) => (
                    <TableRow key={request._id} hover>
                      <TableCell className="tableCell">{request.PatientName}</TableCell>
                      <TableCell className="tableCell"> {String(request.ContactNumber) || "N/A"}</TableCell>
                      <TableCell className="tableCell">
                        <Box component="span" sx={getBloodTypeStyle(request.BloodType)}>
                          {request.BloodType}
                        </Box>
                      </TableCell>
                      <TableCell className="tableCell">
                        {new Date(request.Date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="tableCell">{request.UnitsRequired} Units</TableCell>
                      <TableCell style={{ display: "flex", justifyContent: "center" }}>
                        <Box className="statusPill">
                          <CheckIcon className="statusIcon" />
                          Fulfilled
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
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
                            'Not Available Donations History'}
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

export default DonerDonationHistory;