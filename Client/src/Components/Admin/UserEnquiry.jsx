import React, { useState, useEffect } from 'react';
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
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';
import axiosInstance from '../Service/BaseUrl'
function UserEnquiry() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await axiosInstance.post('/ShowAllContactUs');
        console.log(response)
        setEnquiries(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch enquiries. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchEnquiries();
  }, []);

  const getStatusIndicator = (status) => {
    if (status === "Unread") {
      return <span className="status-indicator status-unread"></span>;
    } else if (status === "Read") {
      return <span className="status-indicator status-read"></span>;
    } else if (status === "Responded") {
      return <span className="status-indicator status-responded"></span>;
    }
    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <Box className="main-container">
        <AdSidemenu />
        <Box className="sidemenu">
          <AdminNav />
          <Box className="content-box" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress />
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
          <AdminNav />
          <Box className="content-box" sx={{ padding: 3 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="main-container">
      <AdSidemenu />
      <Box className="sidemenu">
        <AdminNav />
        <Box className="content-box">
          <Typography variant="h4" className="title">
            User Enquiries
          </Typography>
          <TableContainer component={Paper} className="table-container">
            <Table aria-label="user enquiries table">
              <TableHead>
                <TableRow className="table-head-row">
                  <TableCell className="table-head-cell">User Email</TableCell>
                  <TableCell className="table-head-cell">Enquiry Message</TableCell>
                  <TableCell className="table-head-cell">Date</TableCell>
                  <TableCell className="table-head-cell">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enquiries.length > 0 ? (
                  enquiries.map((enquiry) => (
                    <TableRow key={enquiry._id} hover>
                      <TableCell className="tableCell">{enquiry.email}</TableCell>
                      <TableCell className="tableCell">
                        {enquiry.message.length > 50 
                          ? `${enquiry.message.substring(0, 50)}...` 
                          : enquiry.message}
                      </TableCell>
                      <TableCell className="tableCell">
                        {formatDate(enquiry.createdAt)}
                      </TableCell>
                      <TableCell className="tableCell">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {getStatusIndicator(enquiry.status || 'Unread')}
                          {enquiry.status || 'Unread'}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" className="tableCell">
                      No enquiries found
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

export default UserEnquiry;