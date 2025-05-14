import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import UserSideMenu from './UserSideMenu';
import UserNav from './UserNav';
import axios from 'axios';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosInstance from '../Service/BaseUrl';
function UserDashboard() {
    const [doners, setDoners] = useState([]);
    const [eligibleCount, setEligibleCount] = useState(0);
    const [monthlyDonations, setMonthlyDonations] = useState([]);

    useEffect(() => {
        axiosInstance.post('/ViewAllDoner')
            .then((result) => {
                const donorData = result.data.data;
                setDoners(donorData);
                calculateEligibleDonors(donorData);
                prepareMonthlyDonationData(donorData);
            })
            .catch(console.error);
    }, []);

    const calculateEligibleDonors = (donors) => {
        const today = new Date();
        let count = 0;

        donors.forEach(donor => {
            if (!donor.donationHistory?.length) {
                count++;
                return;
            }

            const lastDonation = new Date(Math.max(...donor.donationHistory.map(date => new Date(date))));
            const monthsDiff = (today.getFullYear() - lastDonation.getFullYear()) * 12 +
                             (today.getMonth() - lastDonation.getMonth());

            if (monthsDiff >= (donor.Gender === 'Male' ? 3 : 4)) {
                count++;
            }
        });

        setEligibleCount(count);
    };

    const prepareMonthlyDonationData = (donors) => {
        const monthlyData = Array(12).fill().map((_, i) => ({
            name: new Date(0, i).toLocaleString('default', { month: 'short' }),
            donations: 0
        }));

        donors.forEach(donor => {
            donor.donationHistory?.forEach(donationDate => {
                const date = new Date(donationDate);
                if (date.getFullYear() === new Date().getFullYear()) {
                    monthlyData[date.getMonth()].donations++;
                }
            });
        });

        setMonthlyDonations(monthlyData);
    };

    return (
        <div className='doner-dashboard-wrapper'>
            <UserSideMenu />
            <UserNav />
            
            <div style={{ 
                marginLeft: '280px', 
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div style={{
                   display:"flex",
                   flexDirection:"row",
                   justifyContent:"center",
                   alignItems:"center",
                   marginTop:"80px",
                   gap:"130px"
                }}>
                    <Card sx={{ borderRadius: 2, width:"280px" }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Typography variant="h2" sx={{ color: '#1E90FF', mb: 1 }}>
                                {doners.length}
                            </Typography>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <PersonIcon sx={{ color: '#1E90FF', mr: 1 }} />
                                <Typography variant="h6">Total Donors</Typography>
                            </div>
                        </CardContent>
                    </Card>

                    <Card elevation={3} sx={{ borderRadius: 2, width:"280px" }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Typography variant="h2" sx={{ color: '#1E90FF', mb: 1 }}>
                                {eligibleCount}
                            </Typography>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FactCheckIcon sx={{ color: '#1E90FF', mr: 1 }} />
                                <Typography variant="h6">Eligible Donors</Typography>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card elevation={3} sx={{ borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h5" align="center" gutterBottom>
                            Monthly Donor Count ({new Date().getFullYear()})
                        </Typography>
                        <div style={{ height: '400px', marginTop: '20px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyDonations}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis 
                                        label={{ value: 'Donor Count', angle: -90, position: 'insideLeft' }}
                                        ticks={[0, 5, 10, 15, 20, 25, 30]}
                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Bar 
                                        dataKey="donations" 
                                        fill="#1E90FF" 
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default UserDashboard;