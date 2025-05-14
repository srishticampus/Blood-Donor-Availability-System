import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Styles/BloodRequests.css';
import AdminNav from './AdminNav';
import AdSidemenu from './AdSidemenu';
import axiosInstance from '../Service/BaseUrl';
import { CircularProgress, Typography, Box } from '@mui/material';

function BloodRequests() {
    const [bloodRequests, setBloodRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axiosInstance.get('/ShowAllBloodRequest')
            .then(response => {
                console.log(response.data);
                
                setBloodRequests(response.data);
                const filtered = response.data.filter(request => 
                    request.IsHospital !== "Approved" && request.IsDoner !== "Fulfilled"
                );
                setFilteredRequests(filtered);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            const filtered = bloodRequests.filter(request => 
                request.IsHospital !== "Approved" && request.IsDoner !== "Fulfilled"
            );
            setFilteredRequests(filtered);
        } else {
            const lowercasedSearch = searchTerm.toLowerCase();
            const filtered = bloodRequests.filter(request => {
                if (request.IsHospital === "Approved" || request.IsDoner === "Fulfilled") {
                    return false;
                }
                
                const patientName = request.PatientName ? request.PatientName.toString().toLowerCase() : '';
                const bloodType = request.BloodType ? request.BloodType.toString().toLowerCase() : '';
                
                return (
                    patientName.includes(lowercasedSearch) ||
                    bloodType.includes(lowercasedSearch)
                );
            });
            setFilteredRequests(filtered);
        }
    }, [searchTerm, bloodRequests]);

    if (loading) {
        return (
            <div className="blood-requests-container">
                <AdminNav onSearch={setSearchTerm} placeholder="Search by patient or blood type..." />
                <AdSidemenu />
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="80vh"
                >
                    <CircularProgress size={60} />
                </Box>
            </div>
        );
    }

    if (error) {
        return (
            <div className="blood-requests-container">
                <AdminNav onSearch={setSearchTerm} placeholder="Search by patient or blood type..." />
                <AdSidemenu />
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="80vh"
                >
                    <Typography color="error">Error: {error}</Typography>
                </Box>
            </div>
        );
    }

    return (
        <div className="blood-requests-container">
            <AdminNav onSearch={setSearchTerm} placeholder="Search by patient or blood type..." />
            <AdSidemenu />
            <h1 className="blood-requests-title">Blood Requests</h1>
            <div className="blood-requests-wrapper">
                {filteredRequests.length > 0 ? (
                    <div className="blood-requests-list">
                        {filteredRequests.map((request) => (
                            <div key={request._id} className="blood-request-card">
                                <div className="blood-request-header">
                                    <div className="request-id">BLOOD REQUEST</div>
                                </div>

                                <div className="blood-request-details">
                                    <div className="detail-row">
                                        <span className="detail-label">Patient Name:</span>
                                        <span>{request.PatientName}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Blood Type:</span>
                                        <span className="blood-group">{request.BloodType}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Units Required:</span>
                                        <span>{request.UnitsRequired}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Contact Number:</span>
                                        <span>{request.ContactNumber}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Status:</span>
                                        <span className="status-container">
                                            <span
                                                className="status-dot"
                                                style={{
                                                    backgroundColor: request.IsDoner === "Approved" || request.IsDoner === "Accepted" ? '#4CAF50' : '#DF7C00',
                                                }}
                                            ></span>
                                            <span className="status-text">
                                                {request.IsDoner === "Approved" || request.IsDoner === "Accepted" ? 'Accepted' : 'Pending'}
                                            </span>
                                        </span>
                                    </div>
                                    {request.HospitalId && (
                                        <div className="detail-row">
                                            <span className="detail-label">Hospital:</span>
                                            <span>{request.HospitalId.FullName}</span>
                                        </div>
                                    )}
                                    {request.USERID && !request.HospitalId && (
                                        <div className="detail-row">
                                            <span className="detail-label">Requested By:</span>
                                            <span>{request.USERID.FullName}</span>
                                        </div>
                                    )}
                                    <div className="detail-row">
                                        <span className="detail-label">Doctor:</span>
                                        <span>{request.doctorName || 'Not specified'}</span>
                                    </div>
                                    {request.specialization && (
                                        <div className="detail-row">
                                            <span className="detail-label">Specialization:</span>
                                            <span>{request.specialization}</span>
                                        </div>
                                    )}
                                    {request.Date && (
                                        <div className="detail-row">
                                            <span className="detail-label">Date:</span>
                                            <span>{new Date(request.Date).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {request.Time && (
                                        <div className="detail-row">
                                            <span className="detail-label">Time:</span>
                                            <span>{request.Time}</span>
                                        </div>
                                    )}
                                    <div className="detail-row">
                                        <span className="detail-label">Requested On:</span>
                                        <span>{new Date(request.createdAt).toLocaleString()}</span>
                                    </div>
                                    {request.AcceptedBy && (
                                        <div className="detail-row">
                                            <span className="detail-label">Accepted By:</span>
                                            <span>{request.AcceptedBy.FullName} ({request.AcceptedBy.City})</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Box 
                        display="flex" 
                        justifyContent="center" 
                        alignItems="center" 
                        minHeight="60vh"
                        width="100%"
                    >
                        <Typography variant="h6" color="textSecondary">
                            {searchTerm ? 'No matching blood requests found' : 'No blood requests available'}
                        </Typography>
                    </Box>
                )}
            </div>
        </div>
    );
}

export default BloodRequests;