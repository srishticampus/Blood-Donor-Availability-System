import React, { useState, useEffect } from 'react';
import '../../Styles/TableStyle.css'
import {
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Typography,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import HosNav from './HosNav';
import HosSidemenu from './HosSidemenu';
import axios from 'axios';
import axiosInstance from '../Service/BaseUrl';

function WilligDoners() {
    const [donors, setDonors] = useState([]);
    const [filteredDonors, setFilteredDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const response = await axiosInstance.post('/ViewAllDoner');
                console.log(response);
                
                const processedDonors = processDonors(response.data.data);
                setDonors(processedDonors);
                setFilteredDonors(processedDonors); 
                setLoading(false);
            } catch (error) {
                console.error('Error fetching donors:', error);
                setLoading(false);
            }
        };

        fetchDonors();
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredDonors(donors);
        } else {
            const filtered = donors.filter(donor => 
                donor.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                donor.PhoneNo.includes(searchTerm) ||
                donor.bloodgrp.toLowerCase().includes(searchTerm.toLowerCase()) ||
                donor.Healthstatus.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDonors(filtered);
        }
    }, [searchTerm, donors]);

    const processDonors = (donorData) => {
        const currentDate = new Date();
        
        return donorData.map(donor => {
            // First check for pregnancy/breastfeeding status
            if (donor.PregnancyorBreastfeed === "Yes") {
                return { ...donor, Healthstatus: 'Not Eligible' };
            }

            // If no donation history, consider as healthy (if not pregnant/breastfeeding)
            if (!donor.donationHistory || donor.donationHistory.length === 0) {
                return { ...donor, Healthstatus: 'Healthy' };
            }

            const lastDonationDate = new Date(donor.donationHistory[0]);
            const timeDiff = currentDate - lastDonationDate;
            const monthsDiff = timeDiff / (1000 * 60 * 60 * 24 * 30);
            
            let requiredGap;
            if (donor.Gender === 'Male') {
                requiredGap = 3; 
            } else {
                requiredGap = 4; 
            }

            if (monthsDiff < requiredGap) {
                return { ...donor, Healthstatus: 'Recent Doner' };
            } else {
                return { ...donor, Healthstatus: 'Healthy' };
            }
        });
    };

    const getHealthStatusStyle = (status) => {
        switch (status) {
            case 'Healthy':
                return {
                    color: '#2E7D32',
                    backgroundColor: '#E8FFE9',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    display: 'inline-block'
                };
            case 'Recent Doner':
                return {
                    color: '#616161',
                    backgroundColor: '#E9E9E9',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    display: 'inline-block'
                };
            case 'Not Eligible':
                return {
                    color: '#D32F2F',
                    backgroundColor: '#FFEBEE',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    display: 'inline-block'
                };
            default:
                return {
                    padding: '6px 12px',
                    borderRadius: '16px',
                    display: 'inline-block'
                };
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Box className="main-container">
            <HosNav searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            <Box className="sidemenu">
                <HosSidemenu />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Donor Management
                    </Typography>
                    <Typography variant="h5" className="sub-title">
                        Willing Donors
                    </Typography>
                    <TableContainer className="table-container">
                        <Table aria-label="donor requests table">
                            <TableHead>
                                <TableRow className="table-head-row">
                                    <TableCell className="table-head-cell">Name</TableCell>
                                    <TableCell className="table-head-cell">Contact Number</TableCell>
                                    <TableCell className="table-head-cell">Date of Birth</TableCell>
                                    <TableCell className="table-head-cell">Gender</TableCell>
                                    <TableCell className="table-head-cell">Blood Group</TableCell>
                                    <TableCell className="table-head-cell">Health Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredDonors.map((donor) => (
                                    <TableRow key={donor._id}>
                                        <TableCell className='tableCell'>{donor.FullName}</TableCell>
                                        <TableCell className='tableCell'>{donor.PhoneNo}</TableCell>
                                        <TableCell className='tableCell'>
                                            {new Date(donor.DateOfBirth).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className='tableCell'>{donor.Gender}</TableCell>
                                        <TableCell className='tableCell'>{donor.bloodgrp}</TableCell>
                                        <TableCell className='tableCell'>
                                            <span style={getHealthStatusStyle(donor.Healthstatus)}>
                                                {donor.Healthstatus}
                                            </span>
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

export default WilligDoners;