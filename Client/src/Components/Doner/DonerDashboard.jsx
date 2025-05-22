import React, { useEffect, useState } from 'react';
import BloodImg from '../../Assets/UserBlood.png';
import { Avatar, Button } from '@mui/material';
import dp from '../../Assets/dp.jpg'
import '../../Styles/DonerDashboard.css';
import DonerNav from './DonerNav';
import DonerSideMenu from './DonerSideMenu';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import axiosInstance from '../Service/BaseUrl';
import {baseUrl} from '../../baseUrl';

function DonerDashboard() {
  const DonerId = localStorage.getItem("DonerId");
  const [donorData, setDonorData] = useState({});
  const [donorBloodType, setDonorBloodType] = useState("");
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DonerId) {
      fetchDonorData();
    }
  }, [DonerId]);

  useEffect(() => {
    if (donorBloodType) {
      fetchEmergencyRequests();
    }
  }, [donorBloodType]);

  const fetchDonorData = async () => {
    try {
      const response = await axiosInstance.post(`/findDoner/${DonerId}`);
      const data = response.data.data; 
      
      setDonorData(data);
      const formattedBloodType = formatBloodType(data.bloodgrp || "");
      setDonorBloodType(formattedBloodType);
      
      localStorage.setItem('Doner', JSON.stringify(data));
      localStorage.setItem('DonerBloodType', formattedBloodType);
    } catch (error) {
      console.error('Error fetching donor data:', error);
      toast.error('Failed to load donor profile');
    }
  };

  const fetchEmergencyRequests = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/ShowAllBloodRequest");
      
      if (response.data && Array.isArray(response.data)) {
        const filteredRequests = response.data.filter(request => {
          if (!request.BloodType || !request.Status) {
            return false;
          }

          const cleanStatus = String(request.Status).replace(/"/g, '').trim();
          if (cleanStatus !== "Emergency") {
            return false;
          }

          const requestBloodType = formatBloodType(request.BloodType);
          if (requestBloodType !== donorBloodType) {
            return false;
          }

          if (request.AcceptedByDoner && Array.isArray(request.AcceptedByDoner)) {
            const hasAccepted = request.AcceptedByDoner.some(
              acceptance => acceptance.donerId && acceptance.donerId._id === DonerId
            );
            if (hasAccepted) {
              return false;
            }
          }

          return true;
        });

        filteredRequests.sort((a, b) => new Date(b.Date) - new Date(a.Date));
        
        const mostRecentRequest = filteredRequests.length > 0 ? [filteredRequests[0]] : [];
        setEmergencyRequests(mostRecentRequest);

        console.log(mostRecentRequest);
        
      }
    } catch (error) {
      console.error('Error fetching blood requests:', error);
      toast.error('Failed to fetch emergency requests');
    } finally {
      setLoading(false);
    }
  };
  
  const formatBloodType = (bloodType) => {
    if (!bloodType) return '';
    
    const cleaned = bloodType
      .replace(/\(|\)/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();
    
    const match = cleaned.match(/([ABO])\s*([+-])/i) || cleaned.match(/([ABO][+-])/i);
    
    if (match) {
      if (match[1] && match[2]) {
        return `${match[1]}${match[2]}`;
      }
      if (match[0]) {
        return match[0];
      }
    }
    
    return cleaned.split(' ')[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const calculateNextDonationDate = () => {
    if (!donorData || !donorData.donationHistory || donorData.donationHistory.length === 0) {
      return null;
    }

    const lastDonationDate = new Date(donorData.donationHistory[donorData.donationHistory.length - 1]);
    const nextDonationDate = new Date(lastDonationDate);

    if (donorData.Gender === "Male") {
      nextDonationDate.setDate(nextDonationDate.getDate() + 90);
    } else {
      nextDonationDate.setDate(nextDonationDate.getDate() + 120);
    }

    return nextDonationDate;
  };

  const nextDonationDate = calculateNextDonationDate();
  const formattedNextDate = nextDonationDate
    ? nextDonationDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    : 'Now (no donation history)';

  const profilePhotoUrl = donorData.ProfilePhoto?.filename
    ? `${baseUrl}/${donorData.ProfilePhoto.filename}`
    : dp;

  return (
    <div className="doner-dashboard-wrapper">
      <DonerNav />
      <DonerSideMenu />
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
              <h3>{donorData.FullName || 'Donor'}</h3>
              <p>Doner ID: {DonerId}</p>
              <p>Blood Group: {donorBloodType}</p>
            </div>
          </div>

          {donorData.donationHistory?.length > 0 && (
            <div className='request-accepted'>
              <h2> ✅ Last donation on: {formatDate(donorData.donationHistory[0])}</h2>
            </div>
          )}
        </div>

        <div className='user-dashboard-right-side'>
          <div className='next-donation-date'>
            <h4>📅 Next Donation Date (Eligibility)</h4>
            <h3>Eligible from: {formattedNextDate}</h3>
            <p>
              Donor should wait 56 days before donating blood again in case of whole blood (6 times a year).
              Donor should wait 112 days before donating blood again in case of Power Red donation.
              Platelet donors can donate every 7 days (24 times a year).
              Interval of donation for men - 3 months.
              Interval of donation for women - 4 months.
            </p>
          </div>

          <div className='Emergency-Alert'>
            <h2>Emergency Alerts</h2>
            {loading ? (
              <p>Loading emergency requests...</p>
            ) : emergencyRequests.length > 0 ? (
              emergencyRequests.map(request => (
                <div key={request._id} className="emergency-alert-item">
                  <p><strong>Patient:</strong> {request.PatientName || 'N/A'}</p>
                  <p><strong>Contact No:</strong> {request.ContactNumber || 'N/A'}</p>
                  <p><strong>Blood Type:</strong> {formatBloodType(request.BloodType) || 'N/A'}</p>
                  {/* <p><strong>Status:</strong> {String(request.Status).replace(/"/g, '') || 'N/A'}</p> */}
                  <p><strong>Units Needed:</strong> {request.UnitsRequired || 0}</p>
                  {/* <p><strong>When Needed:</strong> {formatDate(request.Date)} at {request.Time}</p> */}
                  {/* <Link to='/donation-req'>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      View Details
                    </Button>
                  </Link> */}
                </div>
              ))
            ) : (
              <p>No emergency requests matching your blood type at this time.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonerDashboard;