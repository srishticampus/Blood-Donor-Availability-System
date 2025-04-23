import React from 'react';
import { Avatar, Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Typography } from '@mui/material';
import HosNav from './HosNav';
import HosSidemenu from './HosSidemenu';
import { Link } from 'react-router-dom';
function HosPatDetails() {
    return (
        <Box className="main-container">
            <HosNav />
            <Box className="sidemenu">
                <HosSidemenu />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Patient Details
                    </Typography>

                    <div>
                        <TableContainer component={Paper} className="table-container">
                            <Table aria-label="user health information table">
                                <TableBody>
                                    <TableRow hover className="tableRow">
                                        <TableCell className="tableCell">Patient Name</TableCell>
                                        <TableCell className="tableCell">John Doe</TableCell>
                                    </TableRow>
                                    <TableRow hover className="tableRow">
                                        <TableCell className="tableCell">Bystander Contact No</TableCell>
                                        <TableCell className="tableCell">7025912190</TableCell>
                                    </TableRow>
                                    <TableRow hover className="tableRow">
                                        <TableCell className="tableCell">Diagnosis</TableCell>
                                        <TableCell className="tableCell">Acute Bronchitis</TableCell>
                                    </TableRow>
                                    <TableRow hover className="tableRow">
                                        <TableCell className="tableCell">Blood Type</TableCell>
                                        <TableCell className="tableCell">O+</TableCell>
                                    </TableRow>
                                   
                                </TableBody>
                            </Table>

                        </TableContainer>
                    </div>
                </Box>
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Hospital Details
                    </Typography>

                    <div>
                        <TableContainer component={Paper} className="table-container">
                            <Table aria-label="user health information table">
                                <TableBody>
                                    <TableRow hover className="tableRow">
                                        <TableCell className="tableCell">Room No / Ward No</TableCell>
                                        <TableCell className="tableCell">A-203</TableCell>
                                    </TableRow>
                                    <TableRow hover className="tableRow">
                                        <TableCell className="tableCell">Blood Transfusion Status</TableCell>
                                        <TableCell className="tableCell">Completed</TableCell>
                                    </TableRow>
                                    <TableRow hover className="tableRow">
                                        <TableCell className="tableCell">Admission Date</TableCell>
                                        <TableCell className="tableCell">21-05-1973</TableCell>
                                    </TableRow>
                                    <TableRow hover className="tableRow">
                                        <TableCell className="tableCell">Discharge Date</TableCell>
                                        <TableCell className="tableCell">15-12-2002</TableCell>
                                    </TableRow>
                                    <TableRow hover className="tableRow">
                                        <TableCell className="tableCell">Doctor Assigned</TableCell>
                                        <TableCell className="tableCell">Hussin</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                        </TableContainer>
                    </div>
                    <div >
                        <Link to='/edithospatDetails' className='hospital-action'>
                        <Button variant="contained" className='profile-edit-btn'>Edit</Button>
                        </Link>

                    </div>

                </Box>
            </Box>
        </Box>
    );
}

export default HosPatDetails;