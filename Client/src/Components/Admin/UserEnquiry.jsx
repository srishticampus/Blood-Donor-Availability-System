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
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import axiosInstance from '../Service/BaseUrl';
import { toast , ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserEnquiry() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/ShowAllContactUs');
      setEnquiries(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch enquiries. Please try again later.');
      setLoading(false);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.post(`/deleteContact/${id}`);
      setEnquiries(enquiries.filter(enquiry => enquiry._id !== id));
      toast.success('Enquiry deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      console.error('Error deleting enquiry:', err);
      toast.error('Failed to delete enquiry!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
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
                  <TableCell className="table-head-cell">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enquiries.length > 0 ? (
                  enquiries.map((enquiry) => (
                    <TableRow key={enquiry._id} hover>
                      <TableCell className="tableCell">{enquiry.email}</TableCell>
                      <TableCell className="tableCell">
                        <Tooltip title={enquiry.message} placement="top" arrow>
                          <span>
                            {enquiry.message.length > 50
                              ? `${enquiry.message.substring(0, 50)}...`
                              : enquiry.message}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="tableCell">
                        {formatDate(enquiry.createdAt)}
                      </TableCell>
                      <TableCell className="tableCell">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconButton onClick={() => handleDelete(enquiry._id)}>
                            <DeleteIcon style={{ color: "red" }} />
                          </IconButton>
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