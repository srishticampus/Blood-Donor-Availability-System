import React from 'react';
import { Avatar } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Typography } from '@mui/material';
import AdminNav from './AdminNav';
import AdSidemenu from './AdSidemenu';

function OrganizationMembers() {
    return (
        <Box className="main-container">
            <AdminNav />
            <Box className="sidemenu">
                <AdSidemenu />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Health Details
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            alt="Alex Thomas"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
                        />
                        <Typography variant="h4" className="title-sub">
                            Health Information for Jane Doe
                        </Typography>
                    </Box>
                    <div>
                        <TableContainer component={Paper} className="table-container">
                            <Table aria-label="user health information table">
                                <TableHead>
                                    <TableRow className="table-head-row">
                                        <TableCell className="table-head-cell">Fields</TableCell>
                                        <TableCell className="table-head-cell">Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow hover className="tableRow">
                                        <TableCell className="tableCell">Health Status</TableCell>
                                        <TableCell className="tableCell">Stable</TableCell>
                                    </TableRow>
                                    <TableRow hover className="tableRow">
                                        <TableCell className="tableCell">Blood Group</TableCell>
                                        <TableCell className="tableCell">A+</TableCell>
                                    </TableRow>
                                    <TableRow hover className="tableRow">
                                        <TableCell className="tableCell">Vaccination Taken</TableCell>
                                        <TableCell className="tableCell">COVID-19, Tetanus</TableCell>
                                    </TableRow>
                                    <TableRow hover className="tableRow">
                                        <TableCell className="tableCell">Weight</TableCell>
                                        <TableCell className="tableCell">56 KG</TableCell>
                                    </TableRow>
                                    <TableRow hover className="tableRow">
                                        <TableCell className="tableCell">Medicicines</TableCell>
                                        <TableCell className="tableCell">None</TableCell>
                                    </TableRow>
                                    <TableRow hover className="tableRow">
                                        <TableCell className="tableCell">Surgical History</TableCell>
                                        <TableCell className="tableCell">Appendectony (2020)</TableCell>
                                    </TableRow>
                                    <TableRow hover className="tableRow">
                                        <TableCell className="tableCell">Pregnancy / Breastfeeding</TableCell>
                                        <TableCell className="tableCell">No</TableCell>
                                    </TableRow>
                                    <TableRow hover className="tableRow">
                                        <TableCell className="tableCell">Any Allergy</TableCell>
                                        <TableCell className="tableCell">Peanuts</TableCell>
                                    </TableRow>
                                    <TableRow hover className="tableRow">
                                        <TableCell className="tableCell">Consent Form</TableCell>
                                        <TableCell className="tableCell">Download</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </Box>
            </Box>
        </Box>
    );
}

export default OrganizationMembers;