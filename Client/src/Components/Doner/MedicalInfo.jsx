import React, { useState, useRef } from 'react';
import {
  MenuItem, FormControl, Switch, Select, ListItemText,
  Button, TextField, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions,
  IconButton, Box
} from '@mui/material';
import '../../Styles/MedicalInfo.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Nav from '../common/Nav';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../Service/BaseUrl';

function MedicalInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state || {};
  const selectRef = useRef(null);

  const [medicalInfo, setMedicalInfo] = useState({
    ProfilePhoto: formData.ProfilePhoto || null,
    FullName: formData.FullName || '',
    DateOfBirth: formData.DateOfBirth || '',
    Email: formData.Email || '',
    Password: formData.Password || '',
    AadharNumber: formData.AadharNumber || '',
    Gender: formData.Gender || '',
    PhoneNo: formData.PhoneNo || '',
    Pincode: formData.Pincode || '',
    District: formData.District || '',
    City: formData.City || '',
    bloodgrp: '',
    issues: [],
    weight: ''
  });

  const [error, setError] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [isMedicallyFit, setIsMedicallyFit] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const seriousHealthIssues = [
    "Thalassemia", "Heart Disease", "Severe lung disease",
    "Cancer", "AIDS", "Neurological Illness"
  ];

  const handleBloodGrpChange = (event) => {
    setMedicalInfo(prev => ({ ...prev, bloodgrp: event.target.value }));
  };

  const handleIssueChange = (event) => {
    const selectedIssues = event.target.value;
    setMedicalInfo(prev => ({ ...prev, issues: selectedIssues }));

    const hasSeriousIssue = selectedIssues.some(issue =>
      seriousHealthIssues.includes(issue)
    );

    setIsMedicallyFit(!hasSeriousIssue);
  };

  const handleWeightChange = (event) => {
    const inputWeight = event.target.value;
    setMedicalInfo(prev => ({ ...prev, weight: inputWeight }));

    if (inputWeight === '') {
      setError('');
      return;
    }

    const weightNum = Number(inputWeight);
    if (isNaN(weightNum)) {
      setError('* Please enter a valid number');
      return;
    }

    if (weightNum < 45) {
      setError('* Weight must be equal to or greater than 45');
    } else if (weightNum > 100) {
      setError('* Weight must be less than or equal to 100');
    } else {
      setError('');
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
    navigate('/');
  };

  const handleSubmit = () => {
    const hasSeriousIssue = medicalInfo.issues.some(issue =>
      seriousHealthIssues.includes(issue)
    );

    if (hasSeriousIssue) {
      setAlertOpen(true);
      return;
    }

    const weightNum = Number(medicalInfo.weight);
    if (weightNum < 45 || weightNum > 100 || !medicalInfo.bloodgrp) return;

    const completeData = new FormData();
    completeData.append('ProfilePhoto', medicalInfo.ProfilePhoto);
    completeData.append('DateOfBirth', medicalInfo.DateOfBirth);
    completeData.append('FullName', medicalInfo.FullName);
    completeData.append('Email', medicalInfo.Email);
    completeData.append('Password', medicalInfo.Password);
    completeData.append('AadharNumber', medicalInfo.AadharNumber);
    completeData.append('Gender', medicalInfo.Gender);
    completeData.append('PhoneNo', medicalInfo.PhoneNo);
    completeData.append('Pincode', medicalInfo.Pincode);
    completeData.append('District', medicalInfo.District);
    completeData.append('City', medicalInfo.City);
    completeData.append('bloodgrp', medicalInfo.bloodgrp);
    completeData.append('issues', medicalInfo.issues.join(', '));
    completeData.append('weight', medicalInfo.weight);

    axiosInstance.post('/registration', completeData)
      .then(response => {
        console.log('Registration successful:', response.data);
        toast.success('Registration successfully');
        setTimeout(() => navigate('/login'), 2000); 
      })
      .catch(error => {
        if (error.response) {
          setTimeout(() => navigate('/register'), 2000);
          const { data } = error.response;
          if (data.message === 'Email already exists') {
            toast.error('This email is already registered');
          } else if (data.message === 'Phone number already exists') {
            toast.error('This phone number is already registered');
          } else if (data.message === 'Aadhar number already registered') {
            toast.error('This Aadhar number is already registered');
          } else {
            toast.error(data.message || 'Registration failed. Please try again.');
          }
        } else {
          toast.error('Network error. Please check your connection and try again.');
        }
      });
  };

  const handleSaveHealthIssues = () => {
    setDropdownOpen(false);
    if (selectRef.current) {
      selectRef.current.blur();
    }
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const healthIssues = [
    "Thalassemia", "Diabetes", "Heart Disease", "Severe lung disease",
    "Cancer", "AIDS", "Hepatitis B and C", "Neurological Illness",
    "Undergoing Steroid Therapy", "Epilepsy", "None"
  ];

  return (
    <div className='main-MedicalInfo-container'>
      <Nav />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ marginTop: "80px" }}
      />

      <div className='MedicalInfo-container'>
        <h1 className='medical-title'>Medical Information</h1>

        <div className='select-Blood-grp'>
          <FormControl fullWidth margin="normal">
            <Select
              value={medicalInfo.bloodgrp}
              onChange={handleBloodGrpChange}
              displayEmpty
              renderValue={(selected) => selected || "Select Blood Group"}
            >
              <MenuItem value="" disabled>Blood Type</MenuItem>
              {bloodGroups.map((group) => (
                <MenuItem key={group} value={group}>
                  <ListItemText primary={group} />
                  <Switch checked={medicalInfo.bloodgrp === group} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className='select-Health-details'>
          <FormControl fullWidth margin="normal">
            <Select
              multiple
              ref={selectRef}
              open={dropdownOpen}
              onOpen={() => setDropdownOpen(true)}
              onClose={() => setDropdownOpen(false)}
              value={medicalInfo.issues}
              onChange={handleIssueChange}
              renderValue={(selected) => selected.length > 0 ? selected.join(', ') : "Health Details"}
              displayEmpty
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              {healthIssues.map((issue) => (
                <MenuItem key={issue} value={issue}>
                  <ListItemText primary={issue} />
                  <Switch checked={medicalInfo.issues.includes(issue)} />
                </MenuItem>
              ))}
              <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handleSaveHealthIssues}
                  sx={{ mt: 1 }}
                >
                  Save
                </Button>
              </Box>
            </Select>
          </FormControl>
        </div>

        <TextField
          type='number'
          fullWidth
          margin='normal'
          variant='outlined'
          label='Enter Your Weight (in kg)'
          value={medicalInfo.weight}
          onChange={handleWeightChange}
          error={!!error}
          helperText={error}
          inputProps={{ 
            min: 45,
            max: 100,
            step: "0.1"
          }}
        />

        <Button
          variant="contained"
          className='registration-button'
          onClick={handleSubmit}
          disabled={
            !!error ||
            !medicalInfo.weight ||
            Number(medicalInfo.weight) < 45 ||
            Number(medicalInfo.weight) > 100 ||
            !medicalInfo.bloodgrp
          }
        >
          Complete Registration
        </Button>

        <Dialog
          open={alertOpen}
          onClose={handleAlertClose}
          PaperProps={{
            style: {
              minWidth: '350px',
              maxWidth: '500px',
              Height: '200px',
              maxHeight: '300px',
              borderRadius: '10px',
              textAlign: 'center'
            }
          }}
        >
          <DialogTitle style={{
            textAlign: "center",
            backgroundColor: "#D32F2F",
            color: "white",
            padding: '20px'
          }}>
            Registration Not Allowed
          </DialogTitle>
          <DialogContent style={{ padding: '20px' }}>
            <DialogContentText style={{
              fontSize: '16px',
              textAlign: 'center',
              margin: '20px 0'
            }}>
              If health condition is not fit
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{
            justifyContent: 'center',
            padding: '0 20px 20px'
          }}>
            <IconButton
              variant="contained"
              onClick={handleAlertClose}
              style={{
                color: "#D32F2F",
                fontSize: '40px',
                zIndex: 1,
              }}
            >
              <CancelIcon style={{ fontSize: "60px" }} />
            </IconButton>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default MedicalInfo;