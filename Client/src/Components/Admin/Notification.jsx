import React, { useState, useEffect } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import '../../Styles/Notification.css';
import AdminNav from './AdminNav';
import AdSidemenu from './AdSidemenu';
import { Box, Typography, CircularProgress } from '@mui/material';
import axiosInstance from '../Service/BaseUrl';

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBloodRequests();
    }, []);

    const fetchBloodRequests = () => {
        axiosInstance.get('/ShowAllBloodRequest')
            .then(response => {
                const bloodRequests = response.data;
                const generatedNotifications = generateNotifications(bloodRequests);
                setNotifications(generatedNotifications);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching blood requests:', error);
                setError(error.message);
                setLoading(false);
            });
    };

    const generateNotifications = (bloodRequests) => {
        const notifs = [];

        bloodRequests.forEach(request => {
            if (request.ReadbyAdmin === "Pending") {
                if (request.IsHospital === "Approved" && request.AcceptedBy) {
                    notifs.push({
                        id: request._id + '-hospital-approved',
                        type: 'hospital-approved',
                        message: `Hospital ${request.AcceptedBy.FullName} approved blood request for ${request.PatientName}`,
                        date: request.HospitalApprovedAt || request.createdAt,
                        requestId: request._id,
                        unread: true
                    });
                }

                if (request.RejectedBy?.length > 0) {
                    request.RejectedBy.forEach(rejection => {
                        notifs.push({
                            id: request._id + '-hospital-rejected-' + rejection._id,
                            type: 'hospital-rejected',
                            message: `Hospital ${rejection.hospitalId.FullName} rejected blood request for ${request.PatientName}. Reason: ${rejection.reason}`,
                            date: rejection.rejectedAt,
                            requestId: request._id,
                            unread: true
                        });
                    });
                }

                if (request.AcceptedByDoner?.length > 0) {
                    request.AcceptedByDoner.forEach(donor => {
                        notifs.push({
                            id: request._id + '-donor-accepted-' + donor._id,
                            type: 'donor-accepted',
                            message: `Donor ${donor.donerId?.FullName} accepted blood request for ${request.PatientName}`,
                            date: donor.AccepteddAt,
                            requestId: request._id,
                            unread: true
                        });
                    });
                }

                if (request.RejectedByDoner?.length > 0) {
                    request.RejectedByDoner.forEach(rejection => {
                        notifs.push({
                            id: request._id + '-donor-rejected-' + rejection._id,
                            type: 'donor-rejected',
                            message: `Donor ${rejection.donerId.FullName} rejected blood request for ${request.PatientName}`,
                            date: rejection.rejectedAt,
                            requestId: request._id,
                            unread: true
                        });
                    });
                }

                if (request.IsDoner === "Fulfilled") {
                    notifs.push({
                        id: request._id + '-request-fulfilled',
                        type: 'request-fulfilled',
                        message: `Blood request for ${request.PatientName} has been fulfilled`,
                        date: request.DonerFulfilledAt || request.createdAt,
                        requestId: request._id,
                        unread: true
                    });
                }
            }
        });

        return notifs.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const updateReadStatus = (requestId) => {
        return axiosInstance.patch(`/notifications/${requestId}/admin-read`)
            .catch(error => {
                console.error('Error updating read status:', error);
                throw error;
            });
    };

    const markAsRead = (id, requestId) => {
        updateReadStatus(requestId)
            .then(() => {
                setNotifications(notifications.map(notif =>
                    notif.id === id ? { ...notif, unread: false } : notif
                ));
            })
            .catch(error => {
                console.error('Error marking as read:', error);
            });
    };

    const dismissNotification = (id, requestId) => {
        updateReadStatus(requestId)
            .then(() => {
                setNotifications(notifications.filter(notif => notif.id !== id));
            })
            .catch(error => {
                console.error('Error dismissing notification:', error);
            });
    };

    if (loading) {
        return (
            <Box className="admin-layout">
                <AdminNav />
                <AdSidemenu />
                <Box className="notification-content">
                    <Typography variant="h4" className="notification-title">Notifications</Typography>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        minHeight="60vh"
                    >
                        <CircularProgress size={60} />
                        <Typography variant="h6" mt={2}>Loading notifications...</Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="admin-layout">
                <AdminNav />
                <AdSidemenu />
                <Box className="notification-content">
                    <Typography variant="h4" className="notification-title">Notifications</Typography>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        minHeight="60vh"
                    >
                        <Typography color="error" variant="h6">Error: {error}</Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box className="admin-layout">
            <AdminNav />
            <AdSidemenu />
            <Box className="notification-content">
                <h1 className="notification-title">Notifications</h1>                <Box className="notification-list">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <Box
                                key={notification.id}
                                className={`notification-card ${notification.unread ? 'unread' : 'read'}`}
                            >
                                <Box className="notification-header">
                                    <Typography className={`notification-type ${notification.type}`}>
                                        {notification.type.split('-').join(' ')}
                                    </Typography>
                                    <Typography className="notification-date">
                                        {new Date(notification.date).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Typography className="notification-message">{notification.message}</Typography>
                                <Box className="notification-actions">
                                    {notification.unread && (
                                        <button
                                            className="action-button mark-read"
                                            onClick={() => markAsRead(notification.id, notification.requestId)}
                                        >
                                            <CheckIcon /> Mark as read
                                        </button>
                                    )}
                                    <button
                                        className="action-button dismiss"
                                        onClick={() => dismissNotification(notification.id, notification.requestId)}
                                    >
                                        <CloseIcon /> Dismiss
                                    </button>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            height="200px"
                            width="100%"
                        >
                            <Typography variant="h6" color="textSecondary">
                                No pending notifications for admin
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default Notification;