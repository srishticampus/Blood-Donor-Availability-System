import React from 'react';
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
  Typography 
} from '@mui/material';
import { Link } from 'react-router-dom';

function ViewMembers() {
  const hospitalRequests = [
    {
      id: 1,
      name: "Sharath",
      DOB: "15/08/1985",
      Gender: "Male",
      contact: "9446847055",
      email: "general@gmail.com",
      district: "Thrissur",
    },
    {
      id: 2,
      name: "Rahul",
      DOB: "20/11/1987",
      Gender: "Male",
      contact: "9441234567",
      email: "rahul@gmail.com",
      district: "Kollam",
    },
    {
      id: 3,
      name: "Anita",
      DOB: "05/03/1990",
      Gender: "Female",
      contact: "9876543210",
      email: "anita@gmail.com",
      district: "Ernakulam",
    },{
        id: 3,
        name: "Anita",
        DOB: "05/03/1990",
        Gender: "Female",
        contact: "9876543210",
        email: "anita@gmail.com",
        district: "Ernakulam",
      },{
        id: 3,
        name: "Anita",
        DOB: "05/03/1990",
        Gender: "Female",
        contact: "9876543210",
        email: "anita@gmail.com",
        district: "Ernakulam",
      },{
        id: 3,
        name: "Anita",
        DOB: "05/03/1990",
        Gender: "Female",
        contact: "9876543210",
        email: "anita@gmail.com",
        district: "Ernakulam",
      },{
        id: 3,
        name: "Anita",
        DOB: "05/03/1990",
        Gender: "Female",
        contact: "9876543210",
        email: "anita@gmail.com",
        district: "Ernakulam",
      },{
        id: 3,
        name: "Anita",
        DOB: "05/03/1990",
        Gender: "Female",
        contact: "9876543210",
        email: "anita@gmail.com",
        district: "Ernakulam",
      },{
        id: 3,
        name: "Anita",
        DOB: "05/03/1990",
        Gender: "Female",
        contact: "9876543210",
        email: "anita@gmail.com",
        district: "Ernakulam",
      },{
        id: 3,
        name: "Anita",
        DOB: "05/03/1990",
        Gender: "Female",
        contact: "9876543210",
        email: "anita@gmail.com",
        district: "Ernakulam",
      },{
        id: 3,
        name: "Anita",
        DOB: "05/03/1990",
        Gender: "Female",
        contact: "9876543210",
        email: "anita@gmail.com",
        district: "Ernakulam",
      },{
        id: 3,
        name: "Anita",
        DOB: "05/03/1990",
        Gender: "Female",
        contact: "9876543210",
        email: "anita@gmail.com",
        district: "Ernakulam",
      },{
        id: 3,
        name: "Anita",
        DOB: "05/03/1990",
        Gender: "Female",
        contact: "9876543210",
        email: "anita@gmail.com",
        district: "Ernakulam",
      },{
        id: 3,
        name: "Anita",
        DOB: "05/03/1990",
        Gender: "Female",
        contact: "9876543210",
        email: "anita@gmail.com",
        district: "Ernakulam",
      },
  ];

  return (
    <Box className="main-container">
      <AdSidemenu />
      <Box className="sidemenu">
        <AdminNav />
        <Box className="content-box">
          <Typography variant="h4" className="title">
            Organization Management
          </Typography>
          <Typography variant="h5" className="sub-title">
            View Members
          </Typography>
          <TableContainer component={Paper} className="table-container">
            <Table aria-label="hospital requests table">
              <TableHead>
                <TableRow className="table-head-row">
                  <TableCell className="table-head-cell">Name</TableCell>
                  <TableCell className="table-head-cell">DOB</TableCell>
                  <TableCell className="table-head-cell">Gender</TableCell>
                  <TableCell className="table-head-cell">Mobile Number</TableCell>
                  <TableCell className="table-head-cell">Email</TableCell>
                  <TableCell className="table-head-cell">Address</TableCell>
                  <TableCell className="table-head-cell">View More</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hospitalRequests.map((hospital) => (
                  <TableRow key={hospital.id}>
                    <TableCell className="tableCell">{hospital.name}</TableCell>
                    <TableCell className="tableCell">{hospital.DOB}</TableCell>
                    <TableCell className="tableCell">{hospital.Gender}</TableCell>
                    <TableCell className="tableCell">{hospital.contact}</TableCell>
                    <TableCell className="tableCell">{hospital.email}</TableCell>
                    <TableCell className="tableCell">{hospital.district}</TableCell>
                    <TableCell className="tableCell">
                      <Link to='/member-details'>View More</Link>
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

export default ViewMembers;
