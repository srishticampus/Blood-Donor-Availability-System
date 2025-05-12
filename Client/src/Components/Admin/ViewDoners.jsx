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
    Paper,
    Box,
    Typography,
    Avatar
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';

function ViewDoner() {
    const [doners, setDoners] = useState([]);

    useEffect(() => {
        axios.post(`${baseUrl}ViewAllDoner`)
            .then((result) => {
                console.log(result.data.data);
                setDoners(result.data.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const formatDate = (dateString) => {
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };

    return (
        <Box className="main-container">
            <AdSidemenu />
            <Box className="sidemenu">
                <AdminNav />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        View All Donors
                    </Typography>
                    <Typography variant="h5" className="sub-title">
                        Donors Table
                    </Typography>
                    <TableContainer component={Paper} className="table-container">
                        <Table aria-label="donors table">
                            <TableHead>
                                <TableRow className="table-head-row">
                                    <TableCell className="table-head-cell">Profile</TableCell>
                                    <TableCell className="table-head-cell">Name</TableCell>
                                    <TableCell className="table-head-cell">DOB</TableCell>
                                    <TableCell className="table-head-cell">Gender</TableCell>
                                    <TableCell className="table-head-cell">Mobile</TableCell>
                                    <TableCell className="table-head-cell">Email</TableCell>
                                    <TableCell className="table-head-cell">Address</TableCell>
                                    <TableCell className="table-head-cell">View More</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {doners.map((donor) => (
                                    <TableRow key={donor._id} hover>
                                        <TableCell className="tableCell">
                                            <Avatar 
                                                alt={donor.FullName} 
                                                src={`${baseUrl}${donor.ProfilePhoto?.filename}`} 
                                                sx={{ width: 40, height: 40 }}
                                            />
                                        </TableCell>
                                        <TableCell className="tableCell">{donor.FullName}</TableCell>
                                        <TableCell className="tableCell">{formatDate(donor.DateOfBirth)}</TableCell>
                                        <TableCell className="tableCell">{donor.Gender}</TableCell>
                                        <TableCell className="tableCell">{donor.PhoneNo}</TableCell>
                                        <TableCell className="tableCell">{donor.Email}</TableCell>
                                        <TableCell className="tableCell">{donor.District}</TableCell>
                                        <TableCell className="tableCell">
                                            <Link 
                                                to={`/doner-details/${donor._id}`}
                                                style={{
                                                    textDecoration: 'none',
                                                    color: '#2196F3',
                                                    fontWeight: 500
                                                }}
                                            >
                                                View Details
                                            </Link>
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

export default ViewDoner;