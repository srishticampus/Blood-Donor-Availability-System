import React from 'react';
import AdminNav from './AdminNav';
import AdSidemenu from './AdSidemenu';
import '../../Styles/TableStyle.css'
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
    Typography
} from '@mui/material';

function Organaization() {
    const hospitalRequests = [
        {
            id: 1,
            name: "General Hospital",
            reqNumber: "5001",
            contact: "7025912190",
            email: "general@gamil.com",
            district: "Thrissur",
            City: "Varkala",
            license: "12345",
        },
        {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        },
        {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        },
        {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        },
        {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        },
        {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        },
        {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        }, {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        }, {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        }, {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        }, {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        }, {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        }, {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        }, {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        }, {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        }, {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        }, {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        }, {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        }, {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        }, {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        }, {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        }, {
            id: 2,
            name: "PRN Hoapital",
            reqNumber: "5509",
            contact: "9446847055",
            email: "PRN @gmail.com",
            district: "Kollam",
            City: "Varkala",
            license: "67890",
        },
    ];

    return (
        <Box className="main-container">
            <AdSidemenu />
            <Box className="sidemenu">
                <AdminNav />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Organaization Management
                    </Typography>
                    <Typography variant="h5" className="sub-title">
                    Organaization Requests
                    </Typography>
                    <TableContainer className="table-container">
                        <Table aria-label="hospital requests table">
                            <TableHead>
                                <TableRow className="table-head-row">
                                    <TableCell className="table-head-cell">Name</TableCell>
                                    <TableCell className="table-head-cell">Req. Number</TableCell>
                                    <TableCell className="table-head-cell">Contact</TableCell>
                                    <TableCell className="table-head-cell">Email</TableCell>
                                    <TableCell className="table-head-cell">District</TableCell>
                                    <TableCell className="table-head-cell">City</TableCell>
                                    <TableCell className="table-head-cell">License</TableCell>
                                    <TableCell className="table-head-cell">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {hospitalRequests.map((hospital) => (
                                    <TableRow key={hospital.id}>
                                        <TableCell className='tableCell'>{hospital.name}</TableCell>
                                        <TableCell className='tableCell'>{hospital.reqNumber}</TableCell>
                                        <TableCell className='tableCell'>{hospital.contact}</TableCell>
                                        <TableCell className='tableCell'>{hospital.email}</TableCell>
                                        <TableCell className='tableCell'>{hospital.district}</TableCell>
                                        <TableCell className='tableCell'>{hospital.City}</TableCell>
                                        <TableCell className='tableCell'>{hospital.license}</TableCell>
                                        <TableCell className="action-buttons">
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                className="action-button"
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                size="small"
                                                className="action-button"
                                            >
                                                Pending
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                className="action-button"
                                            >
                                                Reject
                                            </Button>
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

export default Organaization;