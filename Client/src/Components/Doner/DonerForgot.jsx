import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../Styles/Forgot.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../common/Nav';
import axiosInstance from '../Service/BaseUrl';

function DonerForgot() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        axiosInstance.post('/FindDonerEmail', { Email: email })
            .then((response) => {
                console.log(response);
                navigate(`/resetPassDoner/${response.data.data.Email}`)
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 404) {
                        toast.error('The email not found');
                    } else {
                        toast.error('Failed to send reset link. Please try again.');
                    }
                } else {
                    console.error('Error:', error);
                    toast.error('An unexpected error occurred');
                }
            });
    };

    return (
        <div className="forgot-container">
            <Nav/>
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

            <div className="forgot-form">
                <h3 className="forgot-title">Forgot Password</h3>

                <div className="form-group">
                    <label htmlFor="forgot-email" className="forgot-label">Email</label>
                    <TextField
                        id="forgot-email"
                        type='email'
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        size="small"
                        className="forgot-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <Button
                    variant="contained"
                    className="forgot-button"
                    onClick={handleSubmit}
                >
                    Send Reset Password
                </Button>
            </div>
        </div>
    );
}

export default DonerForgot;