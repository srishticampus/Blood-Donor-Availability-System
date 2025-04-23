import React, { useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import '../../Styles/Notification.css';
import AdminNav from './AdminNav';
import AdSidemenu from './AdSidemenu';

function Notification() {
    let notifications=[
        {
            id: 1,
            message: "New blood donation request from John Doe",
            date: "2023-10-01",
            unread: true
        },
        {
            id: 2,
            message: "Emergency alert for blood type O+",
            date: "2023-10-02",
            unread: false
        },
        {
            id: 3,
            message: "New enquiry from user regarding donation process",
            date: "2023-10-03",
            unread: true
        },
    ];

    return (
        <div className="admin-layout">
            <AdminNav/>
            <AdSidemenu/>
            <div className="notification-content">
                <h1 className="notification-title">Notifications</h1>
                <div className="notification-list">
                    {notifications.map((notification) => (
                        <div 
                            key={notification.id} 
                            className={`notification-card ${notification.unread ? 'unread' : 'read'}`}
                        >
                            <p className="notification-message">{notification.message}</p>
                            <p className="notification-date"><strong>Date:</strong> {notification.date}</p>
                            <div className="notification-actions">
                                <button className="action-button mark-read">
                                    <CheckIcon />
                                </button>
                                <button className="action-button dismiss">
                                    <CloseIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Notification;