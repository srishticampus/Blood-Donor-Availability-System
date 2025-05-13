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
  CircularProgress
} from '@mui/material';
import UserNav from './UserNav';
import UserSideMenu from './UserSideMenu';
import axiosInstance from '../Service/BaseUrl';

function HospitalList() {
  const [hospital, setHospital] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axiosInstance.post('/viewAllHos')
      .then((result) => {
        const approvedHospitals = result.data.data.filter(
          hospital => hospital.isAdminApprove === true
        );
        setHospital(approvedHospitals);
        setFilteredHospitals(approvedHospitals);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching hospitals:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredHospitals(hospital);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = hospital.filter(h => {
        const name = h.FullName ? h.FullName.toString().toLowerCase() : '';
        const regNumber = h.RegistrationNumber ? h.RegistrationNumber.toString().toLowerCase() : '';
        const phone = h.PhoneNo ? h.PhoneNo.toString().toLowerCase() : '';
        const email = h.Email ? h.Email.toString().toLowerCase() : '';
        const city = h.City ? h.City.toString().toLowerCase() : '';
        const district = h.District ? h.District.toString().toLowerCase() : '';

        return (
          name.includes(lowercasedSearch) ||
          regNumber.includes(lowercasedSearch) ||
          phone.includes(lowercasedSearch) ||
          email.includes(lowercasedSearch) ||
          city.includes(lowercasedSearch) ||
          district.includes(lowercasedSearch)
        );
      });
      setFilteredHospitals(filtered);
    }
  }, [searchTerm, hospital]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (loading) {
    return (
      <Box className="main-container">
        <UserNav onSearch={handleSearch} />
        <Box className="sidemenu">
          <UserSideMenu />
          <Box className="content-box" sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
          }}>
            <CircularProgress size={60} />
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="main-container">
        <UserNav onSearch={handleSearch} />
        <Box className="sidemenu">
          <UserSideMenu />
          <Box className="content-box" sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '70vh' 
          }}>
            <Typography color="error">Error: {error}</Typography>
          </Box>
        </Box>
      </Box>
    );
  }

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
          <TableContainer className="table-container">
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
                    <TableCell colSpan={7} align="center" sx={{ height: '300px' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '100%' 
                      }}>
                        <Typography variant="h6" color="textSecondary">
                          {searchTerm ? 'No matching hospitals found' : 'No hospitals available'}
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

export default HospitalList;