import React, { useState, useEffect } from 'react';
import '../../Styles/TableStyle.css';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress
} from '@mui/material';
import HosNav from './HosNav';
import HosSidemenu from './HosSidemenu';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import axiosInstance from '../Service/BaseUrl'

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

function AllBloodRequest() {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const hospitalId = localStorage.getItem('hospitalId');
    
        if (!hospitalId) {
            toast.error('Hospital ID not found');
            setLoading(false);
            return;
        }
    
        setLoading(true);
        axiosInstance.get(`/ShowRequest/${hospitalId}`)
            .then(response => {
                console.log(response);
                
                const filteredData = response.data.filter(request => 
                    request.IsHospital !== "Approved" && request.IsDoner !== "Fulfilled"
                );
                
                setRequests(filteredData);
                setFilteredRequests(filteredData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching blood requests:', error);
                // toast.error('Failed to fetch blood requests');
                setLoading(false);
            });
    }, []);
    
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredRequests(requests);
        } else {
            const filtered = requests.filter(request => {
                const searchLower = searchTerm.toLowerCase();
                const formattedBloodType = formatBloodType(request.BloodType).toLowerCase();
                
                return (
                    (request.PatientName && request.PatientName.toLowerCase().includes(searchLower)) ||
                    (request.ContactNumber && request.ContactNumber.toString().includes(searchLower)) ||
                    (request.BloodType && formattedBloodType.includes(searchLower)) ||
                    (request.UnitsRequired && request.UnitsRequired.toString().includes(searchLower)) ||
                    (request.Status && request.Status.toLowerCase().includes(searchLower))
                );
            });
            setFilteredRequests(filtered);
        }
    }, [searchTerm, requests]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDeleteClick = (requestId) => {
        setSelectedRequestId(requestId);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = () => {
        if (!selectedRequestId) return;
        
        axios.post(`${baseUrl}bloodRequests/${selectedRequestId}`)
            .then(response => {
                const updatedRequests = requests.filter(request => request._id !== selectedRequestId);
                setRequests(updatedRequests);
                setFilteredRequests(updatedRequests);
                toast.success('Blood request deleted successfully');
                setOpenDeleteDialog(false);
            })
            .catch(error => {
                console.error('Error deleting blood request:', error);
                toast.error('Failed to delete blood request');
                setOpenDeleteDialog(false);
            });
    };

    const handleDeleteCancel = () => {
        setOpenDeleteDialog(false);
        setSelectedRequestId(null);
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
            default:
                return <span className="status-indicator status-pending"></span>;
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

    if (loading) {
        return (
            <Box className="main-container">
                <HosNav searchTerm={searchTerm} onSearchChange={handleSearchChange} />
                <Box className="sidemenu">
                    <HosSidemenu />
                    <Box className="content-box" sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: 'calc(100vh - 200px)'
                    }}>
                        <Typography variant="h4" className="title" sx={{ mb: 3 }}>
                            Blood Request Management
                        </Typography>
                        <CircularProgress size={60} thickness={4} />
                        <Typography variant="h6" sx={{ mt: 3 }}>
                            Loading blood requests...
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box className="main-container">
            <HosNav searchTerm={searchTerm} onSearchChange={handleSearchChange} />
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
                <HosSidemenu />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Blood Request Management
                    </Typography>
                    <Typography variant="h5" className="sub-title">
                        All Request for Blood
                    </Typography>
                    <TableContainer component={Paper} className="table-container">
                        <Table aria-label="emergency requests table">
                            <TableHead>
                                <TableRow className="table-head-row">
                                    <TableCell className="table-head-cell">Name</TableCell>
                                    <TableCell className="table-head-cell">Contact Number</TableCell>
                                    <TableCell className="table-head-cell">Blood Type</TableCell>
                                    <TableCell className="table-head-cell">Units</TableCell>
                                    <TableCell className="table-head-cell">Status</TableCell>
                                    <TableCell className="table-head-cell">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRequests.length > 0 ? (
                                    filteredRequests.map((request) => {
                                        const formattedBloodType = formatBloodType(request.BloodType);
                                        const bloodTypeStyle = getBloodTypeStyle(formattedBloodType);

                                        return (
                                            <TableRow key={request._id} hover>
                                                <TableCell className="tableCell">
                                                    {request.PatientName}
                                                </TableCell>
                                                <TableCell className="tableCell">{request.ContactNumber}</TableCell>
                                                <TableCell className="tableCell">
                                                    <Box sx={bloodTypeStyle}>
                                                        {formattedBloodType}
                                                    </Box>
                                                </TableCell>
                                                <TableCell className="tableCell">
                                                    {request.UnitsRequired} {request.UnitsRequired === 1 ? 'Unit' : 'Units'}
                                                </TableCell>
                                                <TableCell className="tableCell">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                                                        {getStatusIndicator(request.Status)}
                                                        {request.Status}
                                                    </Box>
                                                </TableCell>
                                                <TableCell className="tableCell" style={{ display: "flex", justifyContent: "center" }}>
                                                    <Box sx={{ display: 'flex', gap: '10px' }}>
                                                        <Link to={`/editBloodReq/${request._id}`}>
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                size="small"
                                                            >
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleDeleteClick(request._id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" className="tableCell">
                                            {searchTerm ? 'No matching blood requests found' : 'No blood requests found'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>

            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{textAlign:"center" , borderRadius:"25px"}}
            >
                <DialogTitle id="alert-dialog-title" style={{backgroundColor:"#D32F2F" , color:"white"}}>Confirm Deletion</DialogTitle>
                <DialogContent style={{marginTop:"30px"}}>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this blood request?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AllBloodRequest;