import React, { useState } from 'react';
import { 
  MenuItem, 
  FormControl, 
  Switch, 
  Select, 
  ListItemText, 
  Button, 
  TextField, 
  FormLabel, 
  Radio,
  FormHelperText
} from '@mui/material';
// import UserNav from '../User/UserNav';

function DonationRequest() {
    const [donationData, setDonationData] = useState({
        bloodGroup: '',
        PhoneNo: '',
        Pincode: '',
        District: '',
        City: ''
    });
    const [errors, setErrors] = useState({});

    const bloodGroups = [
        "A Positive (A+)", "A Negative (A-)", 
        "B Positive (B+)", "B Negative (B-)", 
        "O Positive (O+)", "O Negative (O-)", 
        "AB Positive (AB+)", "AB Negative (AB-)"
    ];

    const districts = ["Trivandrum", "Kollam", "Alappuzha"];
    const cities = {
        "Trivandrum": ["Thiruvananthapuram", "Neyyattinkara", "Attingal"],
        "Kollam": ["Kollam", "Paravur", "Karunagappally"],
        "Alappuzha": ["Alappuzha", "Cherthala", "Mavelikkara"]
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDonationData({
            ...donationData,
            [name]: value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }

        if (name === 'District') {
            setDonationData(prev => ({
                ...prev,
                City: ''
            }));
        }
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        if (!donationData.bloodGroup) {
            newErrors.bloodGroup = 'Blood Group is required';
            valid = false;
        }

        if (!donationData.PhoneNo) {
            newErrors.PhoneNo = 'Phone Number is required';
            valid = false;
        } else if (!/^\d{10}$/.test(donationData.PhoneNo)) {
            newErrors.PhoneNo = 'Phone Number must be 10 digits';
            valid = false;
        }

        if (!donationData.Pincode) {
            newErrors.Pincode = 'Pincode is required';
            valid = false;
        } else if (!/^\d{6}$/.test(donationData.Pincode)) {
            newErrors.Pincode = 'Pincode must be 6 digits';
            valid = false;
        }

        if (!donationData.District) {
            newErrors.District = 'District is required';
            valid = false;
        }

        if (!donationData.City) {
            newErrors.City = 'City is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Donation Request Data:', donationData);
            alert('Donation request submitted successfully!');
        }
    };

    return (
        <div className='main-MedicalInfo-container'>
                        {/* <UserNav/> */}
            <div className='MedicalInfo-container'>
            <h1 className='medical-title'>Medical Information</h1>

                <form onSubmit={handleSubmit}>
                    <div className='select-Blood-grp'>
                        <FormLabel component="label" className="req-form-label">Blood Group</FormLabel>
                        <FormControl fullWidth margin="normal" error={!!errors.bloodGroup} required>
                            <Select
                                value={donationData.bloodGroup}
                                onChange={handleChange}
                                renderValue={(selected) => selected || "Select Blood Group"}
                                displayEmpty
                                className='blood-group-select'
                                name="bloodGroup"
                            >
                                <MenuItem value="" disabled>
                                    Blood Type
                                </MenuItem>
                                {bloodGroups.map((group) => (
                                    <MenuItem key={group} value={group}>
                                        <ListItemText primary={group} />
                                        <Switch checked={donationData.bloodGroup === group} />
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.bloodGroup && <FormHelperText error>{errors.bloodGroup}</FormHelperText>}
                        </FormControl>

                        <FormLabel component="label" className="req-form-label">Phone Number</FormLabel>
                        <TextField
                            type="tel"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name='PhoneNo'
                            value={donationData.PhoneNo}
                            onChange={handleChange}
                            error={!!errors.PhoneNo}
                            helperText={errors.PhoneNo}
                            required
                            inputProps={{
                                maxLength: 10
                            }}
                        />

                        <FormLabel component="label" className="req-form-label">Pincode</FormLabel>
                        <TextField
                            type="number"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            placeholder='000000'
                            name='Pincode'
                            value={donationData.Pincode}
                            onChange={handleChange}
                            error={!!errors.Pincode}
                            helperText={errors.Pincode}
                            required
                            inputProps={{
                                maxLength: 6
                            }}
                        />

                        <FormLabel component="label" className="req-form-label">District</FormLabel>
                        <FormControl
                            fullWidth
                            margin="normal"
                            error={!!errors.District}
                            required
                        >
                            <Select
                                value={donationData.District}
                                onChange={handleChange}
                                renderValue={(selected) => selected || "Select District"}
                                displayEmpty
                                name='District'
                            >
                                <MenuItem value="" disabled>
                                    Select District
                                </MenuItem>
                                {districts.map((district) => (
                                    <MenuItem key={district} value={district}>
                                        <Radio checked={donationData.District === district} />
                                        <ListItemText primary={district} />
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.District && <FormHelperText error>{errors.District}</FormHelperText>}
                        </FormControl>

                        <FormLabel component="label" className="req-form-label">City</FormLabel>
                        <FormControl
                            fullWidth
                            margin="normal"
                            error={!!errors.City}
                            required
                            disabled={!donationData.District}
                        >
                            <Select
                                value={donationData.City}
                                onChange={handleChange}
                                renderValue={(selected) => selected || "Select City"}
                                name='City'
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select City
                                </MenuItem>
                                {donationData.District && cities[donationData.District]?.map((city) => (
                                    <MenuItem key={city} value={city}>
                                        <Radio checked={donationData.City === city} />
                                        <ListItemText primary={city} />
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.City && <FormHelperText error>{errors.City}</FormHelperText>}
                        </FormControl>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            className='registration-button'
                            sx={{ mt: 2 }}
                        >
                            Submit Request
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DonationRequest;