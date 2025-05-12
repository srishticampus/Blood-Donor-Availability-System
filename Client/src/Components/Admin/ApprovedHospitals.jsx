import React, { useEffect, useState } from 'react';
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
  Box,
  Typography
} from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';

function ApprovedHospitals() {
  const [hospital, setHospital] = useState([]);

  useEffect(() => {
    axios.post(`${baseUrl}viewAllHos`)
      .then((result) => {
        const approvedHospitals = result.data.data.filter(
          hospital => hospital.isAdminApprove === true
        );
        setHospital(approvedHospitals);
      })
      .catch(error => {
        console.error('Error fetching hospitals:', error);
      });
  }, []);

  return (
    <Box className="main-container">
      <AdSidemenu />
      <Box className="sidemenu">
        <AdminNav />
        <Box className="content-box">
          <Typography variant="h4" className="title">
            Hospital Management
          </Typography>
          <Typography variant="h5" className="sub-title">
            Approved Hospitals
          </Typography>
          <TableContainer className="table-container">
            <Table aria-label="approved hospitals table">
              <TableHead>
                <TableRow className="table-head-row">
                  <TableCell className="table-head-cell">Name</TableCell>
                  <TableCell className="table-head-cell">Registration Number</TableCell>
                  <TableCell className="table-head-cell">Contact</TableCell>
                  <TableCell className="table-head-cell">Email</TableCell>
                  <TableCell className="table-head-cell">District</TableCell>
                  <TableCell className="table-head-cell">Operating Hours</TableCell>
                  <TableCell className="table-head-cell">License</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {hospital.map((hospital) => (
                  <TableRow key={hospital._id}>
                    <TableCell className='tableCell'>{hospital.FullName}</TableCell>
                    <TableCell className='tableCell'>{hospital.RegistrationNumber}</TableCell>
                    <TableCell className='tableCell'>{hospital.PhoneNo}</TableCell>
                    <TableCell className='tableCell'>{hospital.Email}</TableCell>
                    <TableCell className='tableCell'>{hospital.City}</TableCell>
                    <TableCell className='tableCell'>{hospital.OpeningTime} - {hospital.ClosingTime}</TableCell>

                    <TableCell className='tableCell-approved'>
                      
                      Approved
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

export default ApprovedHospitals;