import React, { useState } from 'react';
import { Button, TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../../Styles/Forgot.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from '../common/Nav';
import axiosInstance from '../Service/BaseUrl';
function UserResetPassword() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const handleMouseDownPassword = (e) => e.preventDefault();

    const validatePassword = (pass) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(pass);
        const hasLowerCase = /[a-z]/.test(pass);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
        
        return {
            isValid: pass.length >= minLength && hasUpperCase && hasLowerCase && hasSpecialChar,
            messages: [
                pass.length >= minLength ? null : `Password must be at least ${minLength} characters`,
                hasUpperCase ? null : 'Password must contain at least one uppercase letter',
                hasLowerCase ? null : 'Password must contain at least one lowercase letter',
                hasSpecialChar ? null : 'Password must contain at least one special character'
            ].filter(msg => msg !== null)
        };
    };

    const handleResetPassword = () => {
        if (!password || !confirmPassword) {
            toast.error("Both password fields are required.");
            return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            toast.error(passwordValidation.messages.join('\n'));
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        axiosInstance.post(`/ForgotPass-user/${id}`, {Password: password})
            .then(res => {
                toast.success("Password reset successfully!");
                setTimeout(() => navigate('/UserLogin'), 2000); 

            })
            .catch(err => {
                console.error(err);
                toast.error("Failed to reset password. Please try again.");
            });
    };

    return (
        <div className="forgot-container">
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
            <div className="forgot-form">
                <h3 className="forgot-title">Reset Password</h3>
                <div className="form-group">
                    <label htmlFor="password" className="forgot-label">Password</label>
                    <TextField
                        id="password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        size="small"
                        className="forgot-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    <label htmlFor="confirm-password" className="forgot-label">Confirm Password</label>
                    <TextField
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        size="small"
                        className="forgot-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                <Button
                    variant="contained"
                    className="forgot-button"
                    onClick={handleResetPassword}
                >
                    Reset Password
                </Button>
            </div>
        </div>
    );
}

export default UserResetPassword;