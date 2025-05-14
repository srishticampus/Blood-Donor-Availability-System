import React, { useState, useEffect } from 'react';
import '../../Styles/AddHealthDetails.css';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import DonerNav from './DonerNav';
import DonerSideMenu from './DonerSideMenu';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../Service/BaseUrl';

function AddHealthDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const donorData = JSON.parse(localStorage.getItem('Doner') || '{}');

  const [profileData, setProfileData] = useState(location.state?.donorProfileData || {});
  const [profileImageFile, setProfileImageFile] = useState(null);

  const [healthData, setHealthData] = useState({
    bloodgrp: donorData.bloodgrp || "",
    weight: donorData.weight || "",
    vaccinationsTaken: donorData.vaccinationsTaken?.join(',') || "",
    medicines: donorData.medicines?.join(',') || "",
    SurgicalHistory: donorData.SurgicalHistory?.join(',') || "",
    PregnancyorBreastfeed: donorData.PregnancyorBreastfeed || "",
    Allergy: donorData.Allergy?.join(',') || "",
    ConsentForm: donorData.ConsentForm || null
  });

  const [inputValues, setInputValues] = useState({
    vaccinationsTaken: '',
    medicines: '',
    SurgicalHistory: '',
    Allergy: ''
  });

  const [errors, setErrors] = useState({
    bloodgrp: false,
    weight: false,
    PregnancyorBreastfeed: false,
    vaccinationsTaken: false,
    medicines: false,
    SurgicalHistory: false,
    Allergy: false
  });

  useEffect(() => {
    if (!location.state?.donorProfileData) {
      navigate('/doner-edit-profile');
    }
  }, [location, navigate]);

  const validateFields = () => {
    const newErrors = {
      bloodgrp: !healthData.bloodgrp,
      weight: !healthData.weight,
      PregnancyorBreastfeed: !healthData.PregnancyorBreastfeed,
      vaccinationsTaken: !healthData.vaccinationsTaken,
      medicines: !healthData.medicines,
      SurgicalHistory: !healthData.SurgicalHistory,
      Allergy: !healthData.Allergy
    };
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error);
  };

  const handleInputChange = (field) => (e) => {
    setHealthData({ ...healthData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: false });
    }
  };

  const handleFileChange = (e) => {
    setHealthData({ ...healthData, ConsentForm: e.target.files[0] });
  };

  const addItem = (field) => {
    const value = inputValues[field];
    if (value.trim()) {
      const currentValue = healthData[field]
        ? `${healthData[field]},${value.trim()}`
        : value.trim();
      setHealthData({ ...healthData, [field]: currentValue });
      setInputValues({ ...inputValues, [field]: '' });
      setErrors({ ...errors, [field]: false });
    }
  };

  const handleKeyDown = (field) => (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem(field);
    }
  };

  const handleInputValueChange = (field) => (e) => {
    setInputValues({ ...inputValues, [field]: e.target.value });
  };

  const removeItem = (field, index) => {
    const items = healthData[field].split(',').filter(item => item.trim() !== '');
    items.splice(index, 1);
    const newValue = items.join(',');
    setHealthData({ ...healthData, [field]: newValue });
    setErrors({ ...errors, [field]: !newValue });
  };

  const renderItemsInRows = (field) => {
    const items = healthData[field] ? healthData[field].split(',').filter(item => item.trim() !== '') : [];
    const rows = [];

    for (let i = 0; i < items.length; i += 3) {
      rows.push(items.slice(i, i + 3));
    }

    return (
      <Box sx={{
        border: errors[field] ? '1px solid #d32f2f' : '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: '4px',
        padding: '8px',
        minHeight: '56px',
        '&:hover': {
          borderColor: errors[field] ? '#d32f2f' : 'rgba(0, 0, 0, 0.87)'
        }
      }}>
        {items.length === 0 ? (
          <Typography variant="body1" color={errors[field] ? "error" : "textSecondary"}>
            {errors[field] ? "This field is required" : "No items added yet"}
          </Typography>
        ) : (
          <>
            {rows.map((row, rowIndex) => (
              <Box key={rowIndex} sx={{ display: 'flex', mb: 1 }}>
                {row.map((item, itemIndex) => {
                  const globalIndex = rowIndex * 3 + itemIndex;
                  return (
                    <Box key={globalIndex} sx={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '16px',
                      padding: '4px 8px',
                      marginRight: '8px',
                      marginBottom: '4px'
                    }}>
                      <Typography variant="body2" sx={{ mr: 0.5 }}>
                        {item}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeItem(field, globalIndex)}
                        sx={{ p: 0 }}
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  );
                })}
              </Box>
            ))}
          </>
        )}
        <TextField
          fullWidth
          value={inputValues[field]}
          onChange={handleInputValueChange(field)}
          onKeyDown={handleKeyDown(field)}
          onBlur={() => addItem(field)}
          variant="standard"
          placeholder="Add new item and press Enter"
          InputProps={{ disableUnderline: true }}
          sx={{ mt: 1 }}
          error={errors[field]}
        />
        {errors[field] && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
            Please add at least one item
          </Typography>
        )}
      </Box>
    );
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
  
      for (const key in profileData) {
        if (profileData[key] !== undefined && key !== 'ProfilePhoto') {
          formData.append(key, profileData[key]);
        }
      }
  
      for (const key in healthData) {
        if (healthData[key] !== null && healthData[key] !== '') {
          if (key === 'ConsentForm' && healthData[key] instanceof File) {
            formData.append('ConsentForm', healthData[key]);
          } else {
            formData.append(key, healthData[key]);
          }
        }
      }
  
      if (profileData.ProfilePhoto instanceof File) {
        formData.append('ProfilePhoto', profileData.ProfilePhoto);
      } else if (typeof profileData.ProfilePhoto === 'string') {
        formData.append('ProfilePhotoPath', profileData.ProfilePhoto);
      }
  
      formData.append('id', donorData._id);
  
      const response = await axiosInstance.post('/donorEditProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.data.message === "Profile updated successfully") {
        toast.success("Profile updated successfully");
        localStorage.setItem('Doner', JSON.stringify(response.data.donor));
        setTimeout(() => navigate('/doner-Profile'), 2000);
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'An error occurred while updating the profile');
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <Box className="main-container">
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

      <Box sx={{ display: 'flex' }}>
        <DonerSideMenu sx={{ width: '280px', flexShrink: 0 }} />
        <Box component="main" className="main-content" sx={{ flexGrow: 1, p: 3, marginLeft: '280px', maxWidth: '1200px' }}>
          <DonerNav />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3, marginTop: '60px' }} className="title">
            Update Health Information
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Paper elevation={2} sx={{ p: 3, flex: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth error={errors.bloodgrp}>
                  <Typography variant="subtitle1" gutterBottom>
                    Blood Group *
                  </Typography>
                  <TextField
                    select
                    value={healthData.bloodgrp}
                    onChange={handleInputChange('bloodgrp')}
                    variant="outlined"
                    required
                    error={errors.bloodgrp}
                    helperText={errors.bloodgrp ? "Blood group is required" : ""}
                  >
                    <MenuItem value="">
                      <>Select Blood Group</>
                    </MenuItem>
                    {bloodGroups.map((group) => (
                      <MenuItem key={group} value={group}>
                        {group}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>

                <FormControl fullWidth error={errors.weight}>
                  <Typography variant="subtitle1" gutterBottom>
                    Weight (kg) *
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={healthData.weight}
                    onChange={handleInputChange('weight')}
                    variant="outlined"
                    required
                    error={errors.weight}
                    helperText={errors.weight ? "Weight is required" : ""}
                  />
                </FormControl>

                <FormControl fullWidth error={errors.vaccinationsTaken}>
                  <Typography variant="subtitle1" gutterBottom>
                    Vaccinations Taken *
                  </Typography>
                  {renderItemsInRows('vaccinationsTaken')}
                </FormControl>

                <FormControl fullWidth error={errors.medicines}>
                  <Typography variant="subtitle1" gutterBottom>
                    Medicines *
                  </Typography>
                  {renderItemsInRows('medicines')}
                </FormControl>

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{ width: '380px', position: "relative", left: "60px" }}
                >
                  Update
                </Button>
              </Box>
            </Paper>

            {/* Right Side Content */}
            <Paper elevation={2} sx={{ p: 3, flex: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth error={errors.SurgicalHistory}>
                  <Typography variant="subtitle1" gutterBottom>
                    Surgical History *
                  </Typography>
                  {renderItemsInRows('SurgicalHistory')}
                </FormControl>

                <FormControl component="fieldset" fullWidth error={errors.PregnancyorBreastfeed}>
                  <FormLabel component="legend">Pregnancy/Breastfeeding *</FormLabel>
                  <RadioGroup
                    row
                    value={healthData.PregnancyorBreastfeed}
                    onChange={handleInputChange('PregnancyorBreastfeed')}
                  >
                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio />} label="No" />
                    <FormControlLabel value="Not sure" control={<Radio />} label="Not sure" />
                  </RadioGroup>
                  {errors.PregnancyorBreastfeed && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                      This field is required
                    </Typography>
                  )}
                </FormControl>

                <FormControl fullWidth error={errors.Allergy}>
                  <Typography variant="subtitle1" gutterBottom>
                    Any Allergy *
                  </Typography>
                  {renderItemsInRows('Allergy')}
                </FormControl>

                <Typography variant="subtitle1" gutterBottom>
                  Consent Form
                </Typography>
                <Box
                  sx={{
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px',
                    padding: '10.5px 14px',
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      borderColor: 'rgba(0, 0, 0, 0.87)'
                    }
                  }}
                >
                  <input
                    type="file"
                    name="ConsentForm"                    
                    onChange={handleFileChange}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: '16px',
                      backgroundColor: 'transparent'
                    }}
                  />
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => navigate('/doner-edit-profile')}
                  sx={{ width: '380px', position: "relative", left: "60px", top: "30px" }}
                >
                  Back to Profile
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AddHealthDetails;