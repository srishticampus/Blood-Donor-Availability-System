import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    CircularProgress,
    Paper
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DonerNav from './DonerNav';
import DonerSideMenu from './DonerSideMenu';
import axiosInstance from '../Service/BaseUrl'
function DonerContactUs() {
    const donerData = JSON.parse(localStorage.getItem('Doner') || '{}');
    const donerEmail = donerData.Email || '';

    const [formData, setFormData] = useState({
        email: donerEmail, 
        message: ''
    });
    const [errors, setErrors] = useState({
        message: '' 
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'message') {
            if (!value) {
                setErrors(prev => ({ ...prev, message: 'Message is required' }));
            } else {
                setErrors(prev => ({ ...prev, message: '' }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.message) {
            setErrors(prev => ({ ...prev, message: 'Message is required' }));
            toast.error('Please enter your enquiry message');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axiosInstance.post('/ContactUs', formData);
            toast.success('Your enquiry has been submitted successfully!');
            setFormData(prev => ({ ...prev, message: '' })); 
        } catch (error) {
            toast.error('There was an error submitting your enquiry. Please try again.');
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <DonerNav/>
            <DonerSideMenu/>
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
            <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <h1 style={{ textAlign: 'center' }}>
                        Contact Us
                    </h1>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3
                        }}
                    >
                        <Box>
                            <Typography variant="subtitle1" component="label" htmlFor="email" sx={{ mb: 1, display: 'block' }}>
                                Email ID
                            </Typography>
                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                type="email"
                                variant="outlined"
                                value={formData.email}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: true,
                                }}
                                sx={{ 
                                    '& .MuiInputBase-input.Mui-disabled': {
                                        color: 'rgba(0, 0, 0, 0.87)', 
                                        WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)' 
                                    },
                                    backgroundColor: '#f5f5f5' 
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="subtitle1" component="label" htmlFor="message" sx={{ mb: 1, display: 'block' }}>
                                Enquiry
                            </Typography>
                            <TextField
                                fullWidth
                                id="message"
                                name="message"
                                variant="outlined"
                                value={formData.message}
                                onChange={handleChange}
                                error={!!errors.message}
                                helperText={errors.message}
                                required
                                multiline
                                rows={4}
                            />
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                mt: 2,
                                backgroundColor: '#d32f2f',
                                '&:hover': {
                                    backgroundColor: '#b71c1c',
                                }
                            }}
                            disabled={isSubmitting}
                            size="large"
                        >
                            {isSubmitting ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </div>
    );
}

export default DonerContactUs;