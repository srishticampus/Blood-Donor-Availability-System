import React, { useEffect, useState } from 'react';
import '../../Styles/TableStyle.css';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Box,
  Typography,
  Paper
} from '@mui/material';
import axios from 'axios';
import UserNav from './UserNav';
import UserSideMenu from './UserSideMenu';

function HospitalList() {
  const [hospital, setHospital] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.post('http://localhost:4005/viewAllHos')
      .then((result) => {
        console.log(result);
        
        const approvedHospitals = result.data.data.filter(
          hospital => hospital.isAdminApprove === true
        );
        setHospital(approvedHospitals);
        setFilteredHospitals(approvedHospitals); // Initialize filtered hospitals
      })
      .catch(error => {
        console.error('Error fetching hospitals:', error);
      });
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredHospitals(hospital);
    } else {
      const filtered = hospital.filter(hospital => {
        const searchLower = searchTerm.toLowerCase();
        const fullName = String(hospital.FullName || '').toLowerCase();
        const city = String(hospital.City || '').toLowerCase();
        const phoneNo = String(hospital.PhoneNo || '').toLowerCase();
        const email = String(hospital.Email || '').toLowerCase();
        const district = String(hospital.District || '').toLowerCase();
        
        return (
          fullName.includes(searchLower) ||
          city.includes(searchLower) ||
          phoneNo.includes(searchLower) ||
          email.includes(searchLower) ||
          district.includes(searchLower)
        );
      });
      setFilteredHospitals(filtered);
    }
  }, [searchTerm, hospital]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <Box className="main-container">
      <UserNav onSearch={handleSearch} />
      <Box className="sidemenu">
        <UserSideMenu />
        <Box className="content-box">
          <Typography variant="h4" className="title">
            Hospital List
          </Typography>
          <Typography variant="h5" className="sub-title">
            View Hospitals
          </Typography>
          <TableContainer component={Paper} className="table-container">
            <Table aria-label="approved hospitals table">
              <TableHead>
                <TableRow className="table-head-row">
                  <TableCell className="table-head-cell">Name</TableCell>
                  <TableCell className="table-head-cell">Registration Number</TableCell>
                  <TableCell className="table-head-cell">Contact</TableCell>
                  <TableCell className="table-head-cell">Email</TableCell>
                  <TableCell className="table-head-cell">Address</TableCell>
                  <TableCell className="table-head-cell">District</TableCell>
                  <TableCell className="table-head-cell">Operating Hours</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHospitals.length > 0 ? (
                  filteredHospitals.map((hospital) => (
                    <TableRow key={hospital._id}>
                      <TableCell className='tableCell'>{hospital.FullName}</TableCell>
                      <TableCell className='tableCell'>{hospital.RegistrationNumber}</TableCell>
                      <TableCell className='tableCell'>{hospital.PhoneNo}</TableCell>
                      <TableCell className='tableCell'>{hospital.Email}</TableCell>
                      <TableCell className='tableCell'>{hospital.Address}</TableCell>
                      <TableCell className='tableCell'>{hospital.City}</TableCell>
                      <TableCell className='tableCell'>{hospital.OpeningTime} - {hospital.ClosingTime}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" className="tableCell">
                      {hospital.length === 0 ? 'No hospitals found' : 'No matching hospitals found'}
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

export default HospitalList;