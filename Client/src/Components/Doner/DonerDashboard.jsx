import React from 'react';
import BloodImg from '../../Assets/UserBlood.png';
import { Avatar } from '@mui/material';
import dp from '../../Assets/dp.jpg'
import '../../Styles/DonerDashboard.css';
import DonerNav from './DonerNav';
import DonerSideMenu from './DonerSideMenu';

function DonerDashboard() {
  const donorData = JSON.parse(localStorage.getItem('Doner') || '{}');
  console.log(donorData);

  const profilePhotoUrl = donorData.ProfilePhoto?.filename 
    ? `http://localhost:4005/${donorData.ProfilePhoto.filename}`
    : dp; 

  return (
    <div className="doner-dashboard-wrapper">
      <DonerNav/>
      <DonerSideMenu/>
      <div className='user-dashboard-container'>
        <div className='user-dashboard-left-side'>
          <div className='Application-Details'>
            <img src={BloodImg} alt="Blood Connect Logo" /> 
            <h2>Blood Connect</h2>
          </div>

          <div className='doner-card-dashboard'>
            <div className="avatar-container">
              <Avatar
                alt={donorData.FullName}
                src={profilePhotoUrl}
                sx={{ width: 120, height: 120 }}
              />
            </div>

            <div className="text-container">
              <h3>{donorData.FullName}</h3>
              <p>Doner ID : 1234567890</p>
              <p>Blood Group : {donorData.bloodgrp}</p>
            </div>
          </div>

          <div className='request-accepted'>
            <h2> ✅ You have accepted ABC hospital John Doe. Thank you</h2>
          </div>
        </div>
        
        <div className='user-dashboard-right-side'>
          <div className='next-donation-date'>
            <h4>📅 Next Donation Date (Eligibility)</h4>
            <h3>Eligible from : July 12, 2025</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis neque deleniti voluptas nobis tempore optio magnam iusto architecto fugit adipisci nam dolore vitae rerum debitis itaque minus ad nisi, molestiae ipsam modi molestias doloribus commodi.</p>
          </div>

          <div className='Emergency-Alert'>
            <h2>Emergency Alert</h2>
            <p>Patient: Unni Krishnan</p>
            <p> <b>Contact No:</b> 9446847055</p>
            <p>Units Type: O-</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonerDashboard;