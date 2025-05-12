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
  Paper, 
  Button,
  Box,
  Typography
} from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';

function HospitalReqt() {
  const [hospital, setHospital] = useState([]);

  useEffect(() => {
    axios.post(`${baseUrl}viewAllHos`)
      .then((result) => {
        const pendingHospitals = result.data.data.filter(
          hospital => hospital.isAdminApprove === false
        );
        setHospital(pendingHospitals);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleApprove = (hospitalId) => {
    axios.post(`${baseUrl}hospitalApprove`, { id: hospitalId })
      .then((result) => {
        console.log(result);
        setHospital(prevHospitals => prevHospitals.filter(hospital => hospital._id !== hospitalId));
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  const handleReject = (hospitalId) => {
    axios.post(`${baseUrl}hospitalReject`, { id: hospitalId })
      .then((result) => {
        console.log(result);
        setHospital(prevHospitals => prevHospitals.filter(hospital => hospital._id !== hospitalId));
      })
      .catch((error) => {
        console.error(error);
      });
  };
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
            Pending Hospital Requests
          </Typography>
          <TableContainer className="table-container">
            <Table aria-label="hospital requests table">
              <TableHead>
                <TableRow className="table-head-row">
                  <TableCell className="table-head-cell">Name</TableCell>
                  <TableCell className="table-head-cell">Req. Number</TableCell>
                  <TableCell className="table-head-cell">Contact</TableCell>
                  <TableCell className="table-head-cell">Email</TableCell>
                  <TableCell className="table-head-cell">City</TableCell>
                  <TableCell className="table-head-cell">Operating Hours</TableCell>
                  <TableCell className="table-head-cell">License</TableCell>
                  <TableCell className="table-head-cell">Actions</TableCell>
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
                    <TableCell className='tableCell'>{hospital.RegistrationNumber}</TableCell>
                    <TableCell className="action-buttons">
                      <Button 
                        variant="contained" 
                        color="success" 
                        size="small" 
                        className="action-button"
                        onClick={() => handleApprove(hospital._id)}
                      >
                        Approve
                      </Button>
                     
                      <Button 
                        variant="contained" 
                        color="error" 
                        size="small" 
                        className="action-button"
                        onClick={() => handleReject(hospital._id)}
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

export default HospitalReqt;
