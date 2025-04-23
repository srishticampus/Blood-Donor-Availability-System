import React from 'react';
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
    Typography,
    Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import HosNav from './HosNav';
import HosSidemenu from './HosSidemenu';

function AllBloodRequest() {
    const emergencyRequests = [
        {
            id: 1,
            name: "Sharath",
            contact: "9446847055",
            bloodType: "O+",
            units: "2 Units",
            status: "Pending",
        },
        {
            id: 2,
            name: "Rahul",
            contact: "9876543210",
            bloodType: "A-",
            units: "3 Units",
            status: "Urgent",
        },
        {
            id: 3,
            name: "Priya",
            contact: "8765432109",
            bloodType: "B+",
            units: "1 Unit",
            status: "Fulfilled",
        },
        {
            id: 4,
            name: "Anjali",
            contact: "9123456780",
            bloodType: "AB+",
            units: "4 Units",
            status: "Pending",
        },
        {
            id: 5,
            name: "Vikram",
            contact: "9988776655",
            bloodType: "O-",
            units: "2 Units",
            status: "Urgent",
        },
        {
            id: 6,
            name: "Meera",
            contact: "9876543211",
            bloodType: "A+",
            units: "1 Unit",
            status: "Fulfilled",
        },
        {
            id: 7,
            name: "Ravi",
            contact: "9123456789",
            bloodType: "B-",
            units: "3 Units",
            status: "Pending",
        },
        {
            id: 8,
            name: "Kiran",
            contact: "9876543222",
            bloodType: "AB-",
            units: "2 Units",
            status: "Urgent",
        },
        {
            id: 9,
            name: "Sita",
            contact: "8765432108",
            bloodType: "O+",
            units: "5 Units",
            status: "Fulfilled",
        },
        {
            id: 10,
            name: "Arjun",
            contact: "9446847056",
            bloodType: "A-",
            units: "2 Units",
            status: "Pending",
        },
        {
            id: 11,
            name: "Divya",
            contact: "9988776656",
            bloodType: "B+",
            units: "1 Unit",
            status: "Urgent",
        },
        {
            id: 12,
            name: "Manoj",
            contact: "9876543212",
            bloodType: "AB+",
            units: "3 Units",
            status: "Fulfilled",
        },
        {
            id: 13,
            name: "Sneha",
            contact: "9123456781",
            bloodType: "O-",
            units: "4 Units",
            status: "Pending",
        },
        {
            id: 14,
            name: "Ramesh",
            contact: "9876543223",
            bloodType: "A+",
            units: "2 Units",
            status: "Urgent",
        },
        {
            id: 15,
            name: "Geeta",
            contact: "8765432107",
            bloodType: "B-",
            units: "1 Unit",
            status: "Fulfilled",
        },
        {
            id: 16,
            name: "Ajay",
            contact: "9446847057",
            bloodType: "AB-",
            units: "3 Units",
            status: "Pending",
        },
        {
            id: 17,
            name: "Pooja",
            contact: "9988776657",
            bloodType: "O+",
            units: "2 Units",
            status: "Urgent",
        },
        {
            id: 18,
            name: "Nikhil",
            contact: "9876543213",
            bloodType: "A-",
            units: "1 Unit",
            status: "Fulfilled",
        },
        {
            id: 19,
            name: "Lakshmi",
            contact: "9123456782",
            bloodType: "B+",
            units: "4 Units",
            status: "Pending",
        },
        {
            id: 20,
            name: "Suresh",
            contact: "9876543224",
            bloodType: "AB+",
            units: "3 Units",
            status: "Urgent",
        }
    ];

    const getStatusIndicator = (status) => {
        if (status === "Pending") {
            return <span className="status-indicator status-pending"></span>;
        } else if (status === "Urgent") {
            return <span className="status-indicator status-urgent"></span>;
        } else if (status === "Fulfilled") {
            return <span className="status-indicator status-fulfilled"></span>;
        } else {
            return null;
        }
    };
    
    return (
        <Box className="main-container">
            <HosNav />
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
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {emergencyRequests.map((request) => (
                                    <TableRow key={request.id} hover>
                                        <TableCell className="tableCell">
                    
                                                {request.name}
                                        </TableCell>
                                        <TableCell className="tableCell">{request.contact}</TableCell>
                                        <TableCell className="tableCell">{request.bloodType}</TableCell>
                                        <TableCell className="tableCell">{request.units}</TableCell>
                                        <TableCell className="tableCell">
                                            <Box sx={{ display: 'flex', alignItems: 'center',justifyContent:"center" }}>
                                                {getStatusIndicator(request.status)}
                                                {request.status}
                                            </Box>
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

export default AllBloodRequest;