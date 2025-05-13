import React, { useEffect, useState } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';
import AdminNav from './AdminNav';
import AdSidemenu from './AdSidemenu';
import axiosInstance from '../Service/BaseUrl';
import { Box, CircularProgress, Typography } from '@mui/material'; 

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const bloodGroupColors = {
  'A+': '#E63946',
  'A-': '#F4A261',
  'B+': '#2A9D8F',
  'B-': '#264653',
  'O+': '#E9C46A',
  'O-': '#8D99AE',
  'AB+': '#457B9D',
  'AB-': '#1D3557',
};

function SuccessfulDonationsChart({ data }) {
  const successfulDonations = data.filter(request => 
    request.IsHospital === "Approved" || 
    request.IsDoner === "Fulfilled"
  );

  const monthlyCounts = {};
  successfulDonations.forEach(donation => {
    const date = new Date(donation.Date || donation.createdAt);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
  });

  const sortedMonths = Object.keys(monthlyCounts).sort();
  const counts = sortedMonths.map(month => monthlyCounts[month]);

  const backgroundColors = counts.map(count => {
    if (count < 5) return '#E53935';
    if (count < 10) return '#FBC02D';
    if (count < 20) return '#2E7D32';
    return '#81C784';
  });

  const chartData = {
    labels: sortedMonths,
    datasets: [{
      label: 'Successful Donations',
      data: counts,
      backgroundColor: backgroundColors,
      borderColor: '#fff',
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { 
        display: true, 
        text: 'Monthly Successful Blood Donations', 
        font: { size: 16 } 
      },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        title: { display: true, text: 'Number of Donations' },
        ticks: { stepSize: 1 }
      },
      x: { 
        title: { display: true, text: 'Month' },
        barPercentage: 0.6,
        categoryPercentage: 0.8
      }
    }
  };

  return (
    <div style={{ height: '400px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

function BloodGroupChart({ data }) {
  const bloodGroupCount = {};

  data.forEach((request) => {
    const bloodType = request.BloodType;
    const match = bloodType?.match(/\(([ABO]{1,2}[+-])\)/);
    if (match) {
      const bg = match[1];
      bloodGroupCount[bg] = (bloodGroupCount[bg] || 0) + 1;
    }
  });

  const chartData = {
    labels: Object.keys(bloodGroupCount),
    datasets: [
      {
        label: 'Number of Requests',
        data: Object.values(bloodGroupCount),
        backgroundColor: Object.keys(bloodGroupCount).map(
          (bg) => bloodGroupColors[bg] || '#000'
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { 
        display: true, 
        text: 'Blood Requests by Type', 
        font: { size: 16 } 
      },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        title: { display: true, text: 'Number of Requests' },
        ticks: { stepSize: 1 }
      },
      x: { 
        title: { display: true, text: 'Blood Group' },
        barPercentage: 0.6,
        categoryPercentage: 0.8
      }
    }
  };

  return (
    <div style={{ height: '400px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

function StatusDonutChart({ data }) {
  const statusCount = {
    Emergency: 0,
    'Very Urgent': 0,
    Planned: 0
  };

  data.forEach(request => {
    if (request.Status === 'Emergency') statusCount.Emergency++;
    else if (request.Status === 'Very Urgent') statusCount['Very Urgent']++;
    else if (request.Status === 'Planned') statusCount.Planned++;
  });

  const chartData = {
    labels: Object.keys(statusCount),
    datasets: [{
      data: Object.values(statusCount),
      backgroundColor: ['#E63946', '#FFA500', '#4CAF50'],
      borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
      borderWidth: 1,
      hoverOffset: 10
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Requests by Status',
        font: { size: 16 }
      },
    },
    cutout: '65%',
  };

  return (
    <div style={{ height: '400px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

function PendingRequestsChart({ data }) {
  const pendingRequests = data.filter(request => 
    (request.IsDoner === "Pending" || request.IsDoner === "Accepted") && 
    request.IsHospital === "Pending"
  );

  const bloodTypeCount = {};

  pendingRequests.forEach(request => {
    const bloodType = request.BloodType;
    const match = bloodType?.match(/\(([ABO]{1,2}[+-])\)/);
    if (match) {
      const bg = match[1];
      bloodTypeCount[bg] = (bloodTypeCount[bg] || 0) + 1;
    }
  });

  const chartData = {
    labels: Object.keys(bloodTypeCount),
    datasets: [
      {
        label: 'Pending Requests',
        data: Object.values(bloodTypeCount),
        borderColor: Object.keys(bloodTypeCount).map(
          bg => bloodGroupColors[bg] || '#000'
        ),
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: Object.keys(bloodTypeCount).map(
          bg => bloodGroupColors[bg] || '#000'
        ),
        pointRadius: 5,
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { 
        display: true, 
        text: 'Pending Blood Requests', 
        font: { size: 16 } 
      },
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  return (
    <div style={{ height: '400px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

function RequestTimelineChart({ data }) {
  const approvedRequests = data.filter(request => 
    request.IsHospital === "Approved"
  );

  const monthlyData = {};
  
  approvedRequests.forEach(request => {
    const date = new Date(request.HospitalApprovedAt || request.createdAt);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = {
        urgent: 0,
        veryUrgent: 0,
        planned: 0
      };
    }

    if (request.Status === 'Emergency') {
      monthlyData[monthYear].urgent++;
    } else if (request.Status === 'Very Urgent') {
      monthlyData[monthYear].veryUrgent++;
    } else if (request.Status === 'Planned') {
      monthlyData[monthYear].planned++;
    }
  });

  const sortedMonths = Object.keys(monthlyData).sort();
  
  const chartData = {
    labels: sortedMonths,
    datasets: [
      {
        label: 'Emergency',
        data: sortedMonths.map(month => monthlyData[month].urgent),
        backgroundColor: '#E63946',
        stack: 'Stack 0',
      },
      {
        label: 'Very Urgent',
        data: sortedMonths.map(month => monthlyData[month].veryUrgent),
        backgroundColor: '#FFA500',
        stack: 'Stack 0',
      },
      {
        label: 'Planned',
        data: sortedMonths.map(month => monthlyData[month].planned),
        backgroundColor: '#4CAF50',
        stack: 'Stack 0',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Approved Requests by Status and Month',
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          afterBody: function(context) {
            const month = context[0].label;
            const total = monthlyData[month].urgent + 
                         monthlyData[month].veryUrgent + 
                         monthlyData[month].planned;
            return `Total: ${total}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Requests'
        },
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div style={{ 
      height: '400px', 
      padding: '20px', 
      backgroundColor: 'white', 
      borderRadius: '8px', 
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      gridColumn: '1 / -1'
    }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default function AdminDashboard() {
  const [requestData, setRequestData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/ShowAllBloodRequest')
      .then(res => {
        console.log(res);
        setRequestData(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <AdminNav />
      <AdSidemenu />
      <div style={{ marginLeft: '240px', padding: '20px' }}>
        <h2 style={{ marginBottom: '30px', color: '#333' }}>Admin Dashboard</h2>
        
        {loading ? (
          <Box 
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '70vh',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <CircularProgress size={60} />
            <Typography variant="h6" color="textSecondary">
              Loading dashboard data...
            </Typography>
          </Box>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '20px',
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <BloodGroupChart data={requestData} />
            </div>

            <div>
              <SuccessfulDonationsChart data={requestData} />
            </div>

            <div >
              <RequestTimelineChart data={requestData} />
            </div>

            <div>
              <StatusDonutChart data={requestData} />
            </div>
            
            <div>
              <PendingRequestsChart data={requestData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}