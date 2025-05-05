import React, { useState, useEffect } from 'react';
import '../../Styles/BloodRequests.css';
import AdminNav from './AdminNav';
import AdSidemenu from './AdSidemenu';

function BloodRequests() {
    const [bloodRequests, setBloodRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:4005/ShowAllBloodRequest')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch blood requests');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                
                setBloodRequests(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="blood-requests-container">
                <AdminNav />
                <AdSidemenu />
                <div className="loading-message">Loading blood requests...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="blood-requests-container">
                <AdminNav />
                <AdSidemenu />
                <div className="error-message">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="blood-requests-container">
            <AdminNav />
            <AdSidemenu />
            <h1 className="blood-requests-title">Blood Requests</h1>
            <div className="blood-requests-wrapper">
                <div className="blood-requests-list">
                    {bloodRequests.map((request) => (
                        <div key={request._id} className="blood-request-card">
                            <div className="blood-request-header" >
                                <div className="request-id" style={{ textAlign: "center" }}>BLOOD REQUEST</div>
                              
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
                                                backgroundColor: request.IsDoner=="Approved" ||request.IsDoner=="Accepted" ? '#4CAF50' : '#DF7C00',
                                                display: 'inline-block',
                                                marginRight: '6px',
                                                width: '10px',
                                                height: '10px',
                                                borderRadius: '50%'
                                            }}
                                        ></span>
                                        <span className="status-text">
                                            {request.IsDoner=="Approved" ||request.IsDoner=="Accepted"  ? 'Accepted' : 'Pending'}
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
            </div>
        </div>
    );
}

export default BloodRequests;