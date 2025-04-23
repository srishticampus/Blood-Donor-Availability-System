import React from 'react';
import AdminNav from './AdminNav';
import AdSidemenu from './AdSidemenu';
import '../../Styles/TableStyle.css';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Box,
  Typography
} from '@mui/material';

function CompletedRequests() {
  const completedDonations = [
    {
      id: 1,
      name: "John Doe",
      contact: "9876543210",
      bloodType: "O+",
      donationType: "Whole Blood",
      donationDate: "2023-05-15",
      units: "1 Unit",
      status: "Fulfilled",
      donorName: "Michael Smith",
      donorContact: "9876543211"
    },
    {
      id: 2,
      name: "Jane Smith",
      contact: "8765432109",
      bloodType: "A-",
      donationType: "Plasma",
      donationDate: "2023-05-16",
      units: "2 Units",
      status: "Fulfilled",
      donorName: "Robert Johnson",
      donorContact: "8765432110"
    },
  ];

  const getStatusIndicator = (status) => {
    if (status === "Fulfilled") {
      return <span className="status-indicator status-fulfilled"></span>;
    }
    return null;
  };

  return (
    <Box className="main-container">
      <AdSidemenu />
      <Box className="sidemenu">
        <AdminNav />
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
                  <TableCell className="table-head-cell">Name</TableCell>
                  <TableCell className="table-head-cell">Contact</TableCell>
                  <TableCell className="table-head-cell">Blood Type</TableCell>
                  <TableCell className="table-head-cell">Donation Type</TableCell>
                  <TableCell className="table-head-cell">Date</TableCell>
                  <TableCell className="table-head-cell">Units</TableCell>
                  <TableCell className="table-head-cell">Status</TableCell>
                  <TableCell className="table-head-cell">Donor Name</TableCell>
                  <TableCell className="table-head-cell">Donor Contact</TableCell>
                  <TableCell className="table-head-cell">View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {completedDonations.map((donation) => (
                  <TableRow key={donation.id} hover>
                    <TableCell className="tableCell">{donation.name}</TableCell>
                    <TableCell className="tableCell">{donation.contact}</TableCell>
                    <TableCell className="tableCell">{donation.bloodType}</TableCell>
                    <TableCell className="tableCell">{donation.donationType}</TableCell>
                    <TableCell className="tableCell">{donation.donationDate}</TableCell>
                    <TableCell className="tableCell">{donation.units}</TableCell>
                    <TableCell className="tableCell-fulfilled">
                      {getStatusIndicator(donation.status)}
                      {donation.status}
                    </TableCell>
                    <TableCell className="tableCell">{donation.donorName}</TableCell>
                    <TableCell className="tableCell">{donation.donorContact}</TableCell>
                    <TableCell className="tableCell">
                      <Link to={`/completed-requests/${donation.id}`} className="view-link">View</Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default CompletedRequests;
