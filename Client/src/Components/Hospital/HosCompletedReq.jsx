import React from 'react';
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
  Typography
} from '@mui/material';
import HosNav from './HosNav';
import HosSidemenu from './HosSidemenu';

function HosCompletedReq() {
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
        bloodType: "A+",
        donationType: "Plasma",
        donationDate: "2023-05-16",
        units: "2 Units",
        status: "Fulfilled",
        donorName: "Robert Johnson",
        donorContact: "8765432110"
    },
    {
        id: 3,
        name: "Alice Brown",
        contact: "7654321098",
        bloodType: "B+",
        donationType: "Platelets",
        donationDate: "2023-05-17",
        units: "1 Unit",
        status: "Fulfilled",
        donorName: "Emily Davis",
        donorContact: "7654321109"
    },
    {
        id: 4,
        name: "Charlie Green",
        contact: "6543210987",
        bloodType: "AB-",
        donationType: "Whole Blood",
        donationDate: "2023-05-18",
        units: "1 Unit",
        status: "Fulfilled",
        donorName: "Daniel Wilson",
        donorContact: "6543211098"
    },
    {
        id: 5,
        name: "Eve White",
        contact: "5432109876",
        bloodType: "O-",
        donationType: "Plasma",
        donationDate: "2023-05-19",
        units: "2 Units",
        status: "Fulfilled",
        donorName: "Sophia Martinez",
        donorContact: "5432110987"
    }
];

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

  return (
    <Box className="main-container">
      <HosNav />
      <Box className="sidemenu">
        <HosSidemenu />
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
                </TableRow>
              </TableHead>
              <TableBody>
                {completedDonations.map((donation) => (
                  <TableRow key={donation.id} hover>
                    <TableCell className="tableCell">{donation.name}</TableCell>
                    <TableCell className="tableCell">{donation.contact}</TableCell>
                    <TableCell className="tableCell">
                      <Box component="span" sx={getBloodTypeStyle(donation.bloodType)}>
                        {donation.bloodType}
                      </Box>
                    </TableCell>
                    <TableCell className="tableCell">{donation.donationType}</TableCell>
                    <TableCell className="tableCell">{donation.donationDate}</TableCell>
                    <TableCell className="tableCell">{donation.units}</TableCell>
                    <TableCell>
                      <Box className="statusPill">
                        <CheckIcon className="statusIcon" />
                        {donation.status}
                      </Box>
                    </TableCell>
                    <TableCell className="tableCell">{donation.donorName}</TableCell>
                    <TableCell className="tableCell">{donation.donorContact}</TableCell>
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

export default HosCompletedReq;
