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
import Nav from './Nav';

function ContactUs() {
    const [formData, setFormData] = useState({
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (email) => {
        // Strong email validation regex
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate email on change
        if (name === 'email') {
            if (!value) {
                setErrors(prev => ({ ...prev, email: 'Email is required' }));
            } else if (!validateEmail(value)) {
                setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
            } else {
                setErrors(prev => ({ ...prev, email: '' }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields before submission
        let isValid = true;
        const newErrors = { ...errors };

        if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        if (!formData.message) {
            newErrors.message = 'Message is required';
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post('http://localhost:4005/ContactUs', formData);
            toast.success('Your enquiry has been submitted successfully!');
            setFormData({ email: '', message: '' });
        } catch (error) {
            toast.error('There was an error submitting your enquiry. Please try again.');
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                                InputLabelProps={{ shrink: false }}
                                sx={{ '& .MuiInputLabel-root': { display: 'none' } }}
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
                                InputLabelProps={{ shrink: false }}
                                sx={{ '& .MuiInputLabel-root': { display: 'none' } }}
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

export default ContactUs;