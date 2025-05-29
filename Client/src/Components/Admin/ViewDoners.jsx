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
    Avatar,
    CircularProgress,
    Tooltip
} from '@mui/material';
import { Link } from 'react-router-dom';
import axiosInstance from '../Service/BaseUrl';
import {baseUrl} from '../../baseUrl';
import GoldBadge from '../../Assets/gold.png';
import BronzeBadge from '../../Assets/Bronze.png';
import SilverBadge from '../../Assets/silver.png';

function ViewDoner() {
    const [doners, setDoners] = useState([]);
    const [filteredDoners, setFilteredDoners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axiosInstance.post('/ViewAllDoner')
            .then((result) => {
                console.log(result);
                
                setDoners(result.data.data);
                setFilteredDoners(result.data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredDoners(doners);
        } else {
            const lowercasedSearch = searchTerm.toLowerCase();
            const filtered = doners.filter(donor => {
                const name = donor.FullName ? donor.FullName.toLowerCase() : '';
                const email = donor.Email ? donor.Email.toLowerCase() : '';
                const phone = donor.PhoneNo ? donor.PhoneNo.toString().toLowerCase() : '';
                const district = donor.District ? donor.District.toLowerCase() : '';
                const gender = donor.Gender ? donor.Gender.toLowerCase() : '';
                const dob = donor.DateOfBirth ? formatDate(donor.DateOfBirth).toLowerCase() : '';

                return (
                    name.includes(lowercasedSearch) ||
                    email.includes(lowercasedSearch) ||
                    phone.includes(lowercasedSearch) ||
                    district.includes(lowercasedSearch) ||
                    gender.includes(lowercasedSearch) ||
                    dob.includes(lowercasedSearch)
                );
            });
            setFilteredDoners(filtered);
        }
    }, [searchTerm, doners]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };

    const getDonationBadge = (donationHistory) => {
        if (!donationHistory || !Array.isArray(donationHistory)) {
            return null;
        }
        
        const donationCount = donationHistory.length;
        
        if (donationCount >= 20) {
            return (
                <Tooltip title={`Gold Donor (${donationCount} donations)`} placement="right">
                    <img src={GoldBadge} alt="Gold Badge" style={{ width: '30px' }} />
                </Tooltip>
            );
        } else if (donationCount >= 10) {
            return (
                <Tooltip title={`Silver Donor (${donationCount} donations)`} placement="right">
                    <img src={SilverBadge} alt="Silver Badge" style={{ width: '30px' }} />
                </Tooltip>
            );
        } else if (donationCount >= 0) {
            return (
                <Tooltip title={`Bronze Donor (${donationCount} donations)`} placement="right">
                    <img src={BronzeBadge} alt="Bronze Badge" style={{ width: '30px' }} />
                </Tooltip>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <Box className="main-container">
                <AdSidemenu />
                <Box className="sidemenu">
                    <AdminNav />
                    <Box className="content-box">
                        <Typography variant="h4" className="title">
                            View All Donors
                        </Typography>
                        <Box 
                            display="flex" 
                            justifyContent="center" 
                            alignItems="center" 
                            minHeight="60vh"
                        >
                            <CircularProgress size={60} />
                        </Box>
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
                    <Box className="content-box">
                        <Typography variant="h4" className="title">
                            View All Donors
                        </Typography>
                        <Box 
                            display="flex" 
                            justifyContent="center" 
                            alignItems="center" 
                            minHeight="60vh"
                        >
                            <Typography color="error" variant="h6">
                                Error: {error}
                            </Typography>
                        </Box>
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
                                    {/* <TableCell className="table-head-cell">Email</TableCell> */}
                                    <TableCell className="table-head-cell">Address</TableCell>
                                    <TableCell className="table-head-cell">Donation Level</TableCell>
                                    <TableCell className="table-head-cell">View More</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredDoners.length > 0 ? (
                                    filteredDoners.map((donor) => (
                                        <TableRow key={donor._id} hover>
                                            <TableCell className="tableCell">
                                                <Avatar 
                                                    alt={donor.FullName} 
                                                    src={`${baseUrl}${donor.ProfilePhoto?.filename}` || "" }
                                                    sx={{ width: 40, height: 40 }}
                                                />
                                            </TableCell>
                                            <TableCell className="tableCell">
                                                {donor.FullName}
                                            </TableCell>
                                            <TableCell className="tableCell">{formatDate(donor.DateOfBirth)}</TableCell>
                                            <TableCell className="tableCell">{donor.Gender}</TableCell>
                                            <TableCell className="tableCell">{donor.PhoneNo}</TableCell>
                                            {/* <TableCell className="tableCell">{donor.Email}</TableCell> */}
                                            <TableCell className="tableCell">{donor.District}</TableCell>
                                            <TableCell className="tableCell" align="center">
                                                {getDonationBadge(donor.donationHistory) || '-'}
                                            </TableCell>
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
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
                                            <Box 
                                                display="flex" 
                                                justifyContent="center" 
                                                alignItems="center" 
                                                height="200px"
                                            >
                                                <Typography variant="h6" color="textSecondary">
                                                    {searchTerm ? 'No matching donors found' : 'No donors available'}
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

export default ViewDoner;