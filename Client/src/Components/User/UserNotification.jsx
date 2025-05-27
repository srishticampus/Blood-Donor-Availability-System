import React, { useState, useEffect } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import '../../Styles/Notification.css';
import UserNav from './UserNav';
import UserSideMenu from './UserSideMenu';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../Service/BaseUrl';
function UserNotification() {
    const USERID = localStorage.getItem("UserId");
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedNotification, setExpandedNotification] = useState(null);

    useEffect(() => {
        if (!USERID) {
            toast.error('User ID not found');
            setLoading(false);
            return;
        }

        const fetchNotifications = async () => {
            try {
                const response = await axiosInstance.get(`/ShowRequestUser/${USERID}`);
                const requests = response.data;
                
                const pendingNotifications = requests.filter(request => 
                    request.ReadbyUser === "Pending" && (
                        request.IsDoner === "Accepted" || 
                        request.IsHospital === "Accepted" || 
                        (request.AcceptedByDoner && request.AcceptedByDoner.some(d => d.donationStatus === "Fulfilled"))
                    )
                );

                const notificationList = pendingNotifications.map(request => {
                    let message = '';
                    let donorDetails = null;
                    
                    if (request.AcceptedByDoner && request.AcceptedByDoner.some(d => d.donationStatus === "Fulfilled")) {
                        const fulfilledDonation = request.AcceptedByDoner.find(d => d.donationStatus === "Fulfilled");
                        donorDetails = fulfilledDonation.donerId;
                        message = `Blood donation fulfilled for ${request.PatientName} by donor ${donorDetails.FullName}`;
                    } 
                    else if (request.IsDoner === "Accepted" && request.IsHospital === "Accepted") {
                        message = `Both donor and hospital accepted your request for ${request.PatientName}`;
                    } 
                    else if (request.IsDoner === "Accepted") {
                        message = `Donor accepted your blood request for ${request.PatientName}`;
                    } 
                    else if (request.IsHospital === "Accepted") {
                        message = `Hospital accepted your blood request for ${request.PatientName}`;
                    }

                    return {
                        id: request._id,
                        message: message,
                        date: new Date(request.createdAt).toLocaleDateString(),
                        unread: true, 
                        requestData: request,
                        donorDetails: donorDetails,
                        hasDonorInfo: !!donorDetails
                    };
                });

                setNotifications(notificationList);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                toast.error('Failed to load notifications');
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [USERID]);

    const markAsRead = async (id) => {
        try {
            await axiosInstance.patch(`/notifications/${id}/user-read`);
            
            setNotifications(notifications.filter(notification => notification.id !== id));
            
            toast.success('Notification marked as read');
        } catch (error) {
            console.error('Error marking notification as read:', error);
            toast.error('Failed to mark notification as read');
        }
    };

    const dismissNotification = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
        toast.success('Notification dismissed');
    };

    const toggleDonorDetails = (id) => {
        setExpandedNotification(expandedNotification === id ? null : id);
    };

    if (loading) {
        return (
            <div className="admin-layout">
                <UserNav/>
                <UserSideMenu/>
                <div className="notification-content">
                    <h1 className="notification-title">Notification</h1>
                    <p>Loading notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <UserNav/>
            <UserSideMenu/>
            <div className="notification-content">
                <h1 className="notification-title"> Notifications</h1>
                <div className="notification-list">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div 
                                key={notification.id} 
                                className="notification-card unread" 
                            >
                                <p className="notification-message">{notification.message}</p>
                                <p className="notification-date">
                                    <strong>Date:</strong> {notification.date}
                                </p>
                                
                                {notification.hasDonorInfo && (
                                    <>
                                        <button 
                                            className="view-donor-btn"
                                            onClick={() => toggleDonorDetails(notification.id)}
                                        >
                                            {expandedNotification === notification.id ? 
                                                'Hide Donor Details' : 'View Donor Details'}
                                        </button>
                                        
                                        {expandedNotification === notification.id && (
                                            <div className="donor-details">
                                                <h4>Donor Information:</h4>
                                                <p><strong>Name:</strong> {notification.donorDetails.FullName}</p>
                                                <p><strong>Contact:</strong> {notification.donorDetails.PhoneNo}</p>
                                                <p><strong>Blood Group:</strong> {notification.donorDetails.bloodgrp}</p>
                                                <p><strong>Location:</strong> {notification.donorDetails.City}, {notification.donorDetails.District}</p>
                                                <p><strong>Donation Fulfilled On:</strong> {
                                                    new Date(
                                                        notification.requestData.AcceptedByDoner
                                                            .find(d => d.donationStatus === "Fulfilled")
                                                            .AccepteddAt
                                                    ).toLocaleString()
                                                }</p>
                                            </div>
                                        )}
                                    </>
                                )}
                                
                                <div className="notification-actions">
                                    <button 
                                        className="action-button mark-read"
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <CheckIcon />
                                    </button>
                                    {/* <button 
                                        className="action-button dismiss"
                                        onClick={() => dismissNotification(notification.id)}
                                    >
                                        <CloseIcon />
                                    </button> */}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{display:'flex',justifyContent:"center",alignItems:"center"}}>
                        <h3 className="no-notifications">No pending notifications found</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserNotification;