import React, { useState } from 'react';
import '../../Styles/Registration.css';
import profile from '../../Assets/dp.jpg';
import icon1 from '../../Assets/icon1.png';
import icon2 from '../../Assets/icon2.png';
import icon3 from '../../Assets/icon3.png';
import { TextField, Button, Select, MenuItem, FormControl, InputAdornment, IconButton, Radio, ListItemText, ListItemIcon } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';

function Registration() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    FullName: '',
    Email: '',
    PhoneNo: '',
    Password: '',
    confirmPassword: '',
    Category: ''
  });
  const [errors, setErrors] = useState({
    FullName: '',
    Email: '',
    PhoneNo: '',
    Password: '',
    confirmPassword: '',
    Category: '',
    ProfilePhoto: '' 
  });
  const [ProfilePhoto, setProfilePhoto] = useState(null);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleCategoryChange = (event) => {
    setFormData(prev => ({ ...prev, Category: event.target.value }));
    setErrors(prev => ({ ...prev, Category: '' }));
  };

  const validateFullName = (name) => {
    if (!name) return 'Full Name is required';
    const regex = /^[A-Za-z ]+$/;
    return regex.test(name) ? '' : 'Only alphabets are allowed';
  };

  const validatePassword = (password) => {
    if (!password) return { isValid: false, message: 'Password is required' };
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&#]{8,}$/;
    const messages = [];
    
    if (password.length < 8) messages.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) messages.push('One uppercase letter');
    if (!/[a-z]/.test(password)) messages.push('One lowercase letter');
    if (!/\d/.test(password)) messages.push('One number');
    if (!/[@$!%*?&#]/.test(password)) messages.push('One special character (@$!%*?&)');

    return {
      isValid: passwordRegex.test(password),
      message: messages.length ? `Password must contain: ${messages.join(', ')}` : ''
    };
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!regex.test(email)) return 'Invalid email format';
    
    const validTLDs = ['com', 'net', 'org', 'edu', 'gov', 'io', 'co', 'in'];
    const domainParts = email.split('@')[1]?.split('.');
    const tld = domainParts?.[domainParts.length - 1];
    
    return validTLDs.includes(tld?.toLowerCase()) ? '' : 'Unsupported email domain';
  };

  const validatePhoneNumber = (phone) => {
    if (!phone) return 'Phone number is required';
    if (phone.length !== 10) return 'Phone number must be 10 digits';
    if (!/^\d+$/.test(phone)) return 'Only numbers are allowed';
    if (['0', '1'].includes(phone[0])) return 'Invalid phone number format';
    return '';
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    const updateValue = id === 'PhoneNo' ? value.replace(/\D/g, '') : value;
    setFormData(prev => ({ ...prev, [id]: updateValue }));
    
    setErrors(prev => ({ ...prev, [id]: '' }));
    
    if (id === 'Password' && formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: formData.confirmPassword === value ? '' : 'Passwords do not match'
      }));
    }
    
    if (id === 'confirmPassword') {
      setErrors(prev => ({
        ...prev,
        confirmPassword: value === formData.Password ? '' : 'Passwords do not match'
      }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProfilePhoto(file || null);
    setErrors(prev => ({ ...prev, ProfilePhoto: '' }));
  };

  const validateForm = () => {
    const newErrors = {
      FullName: validateFullName(formData.FullName),
      Email: validateEmail(formData.Email),
      PhoneNo: validatePhoneNumber(formData.PhoneNo),
      Password: validatePassword(formData.Password).message,
      confirmPassword: formData.confirmPassword === formData.Password ? '' : 'Passwords do not match',
      Category: formData.Category ? '' : 'Please select a category',
      ProfilePhoto: !ProfilePhoto ? 'Profile image is required' : ''
    };

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = {
      ...formData,
      ProfilePhoto: ProfilePhoto
    };

    switch (formData.Category) {
      case 'Donor':
        navigate('/doner-registration', { state: formDataToSend });
        break;
      case 'User':
        navigate('/UserRegistration', { state: formDataToSend });
        break;
      case 'Hospital':
        navigate('/hospitalRegistration', { state: formDataToSend });
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div>
      <Nav />
      <div className='registration-container'>
        <form onSubmit={handleSubmit}>
          <div className='registration-box'>
            <p className='sign-up-title'>Sign up</p>

            <div className='profile-section'>
              <img
                src={ProfilePhoto ? URL.createObjectURL(ProfilePhoto) : profile}
                alt="Profile"
                className='profile-image'
              />
              <input
                type="file"
                id="profile-upload"
                className='file-upload'
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*"
              />
              <label htmlFor="profile-upload">
                <Button variant="contained" component="span" className='upload-label'>
                  choose Photo
                </Button>
              </label>
              {errors.ProfilePhoto && (
                <div className="profile-error" >
                  {errors.ProfilePhoto}
                </div>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor="FullName">Full Name </label>
              <TextField
                id="FullName"
                variant="outlined"
                fullWidth
                value={formData.FullName}
                onChange={handleInputChange}
                error={!!errors.FullName}
                helperText={errors.FullName}
              />
            </div>

            <div className='form-group'>
              <label htmlFor="Email">Email</label>
              <TextField
                id="Email"
                variant="outlined"
                fullWidth
                type="email"
                value={formData.Email}
                onChange={handleInputChange}
                error={!!errors.Email}
                helperText={errors.Email}
              />
            </div>

            <div className='form-group'>
              <label htmlFor="PhoneNo">Phone Number</label>
              <TextField
                id="PhoneNo"
                variant="outlined"
                fullWidth
                value={formData.PhoneNo}
                onChange={handleInputChange}
                error={!!errors.PhoneNo}
                helperText={errors.PhoneNo}
                inputProps={{
                  maxLength: 10,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
              />
            </div>

            <div className='form-group'>
              <label htmlFor="Password">Password</label>
              <TextField
                id="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                value={formData.Password}
                onChange={handleInputChange}
                error={!!errors.Password}
                helperText={errors.Password || " "}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </div>

            <div className='form-group'>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <TextField
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </div>

            <div className='form-group'>
              <FormControl fullWidth className='user-selection' error={!!errors.Category}>
                <Select
                  labelId="user-category-label"
                  id="Category"
                  value={formData.Category}
                  onChange={handleCategoryChange}
                  displayEmpty
                  renderValue={(selected) => selected || "Select User Category"}
                >
                  <MenuItem value="" disabled>
                    Select User Category
                  </MenuItem>
                  <MenuItem value="Donor">
                    <ListItemIcon>
                      <Radio checked={formData.Category === 'Donor'} />
                    </ListItemIcon>
                    <ListItemText primary="Donor" />
                    <img src={icon3} alt="Donor" style={{ marginRight: '250px', height: '20px' }} />
                  </MenuItem>
                  <MenuItem value="User">
                    <ListItemIcon>
                      <Radio checked={formData.Category === 'User'} />
                    </ListItemIcon>
                    <ListItemText primary="User" />
                    <img src={icon2} alt="User" style={{ marginRight: '250px', height: '20px' }} />
                  </MenuItem>
                  <MenuItem value="Hospital">
                    <ListItemIcon>
                      <Radio checked={formData.Category === 'Hospital'} />
                    </ListItemIcon>
                    <ListItemText primary="Hospital" />
                    <img src={icon1} alt="Hospital" style={{ marginRight: '250px', height: '20px' }} />
                  </MenuItem>
                </Select>
                {errors.Category && <div style={{ color: '#f44336', fontSize: '0.75rem', margin: '3px 14px 0' }}>{errors.Category}</div>}
              </FormControl>
            </div>

            <Button
              type="submit"
              variant="contained"
              color="error"
              fullWidth
              className='submit-button'
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;