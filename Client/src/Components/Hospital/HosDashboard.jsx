import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import axiosInstance from '../Service/BaseUrl';
import HosNav from './HosNav';
import HosSidemenu from './HosSidemenu';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CHART_WIDTH = 600;
const CHART_HEIGHT = 350;

function HosDashboard() {
  const [dashboardData, setDashboardData] = useState({
    pendingRequests: [],
    approvedRequests: [],
    emergencyRequests: [],
    acceptedRequests: [],
    hospitalApprovedRequests: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const HospitalId = localStorage.getItem('hospitalId');
        const response = await axiosInstance.get('/ShowAllBloodRequest');
        
        const allRequests = response.data.filter(request => 
          request.HospitalId?._id === HospitalId || request.HospitalId === HospitalId
        );

        setDashboardData({
          pendingRequests: allRequests.filter(req => req.IsDoner === "Pending" && req.IsHospital === "Pending"),
          approvedRequests: allRequests.filter(req => req.IsHospital === "Approved" || req.IsDoner === "Fulfilled"),
          emergencyRequests: allRequests.filter(req => req.Status === "Emergency"),
          acceptedRequests: allRequests.filter(req => req.IsDoner === "Fulfilled"),
          hospitalApprovedRequests: allRequests.filter(req => req.IsHospital === "Approved")
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const shortenBloodType = (type) => type.match(/\(([^)]+)\)/)?.[1] || type;

  const bloodTypeColors = {
    'A+': '#03991F', 'A-': '#D32F2F',
    'B+': '#1976D2', 'B-': '#7B1FA2',
    'O+': '#FBC02D', 'O-': '#FF5722',
    'AB+': '#0097A7', 'AB-': '#FFA500'
  };

  const getColor = (type) => bloodTypeColors[type] || '#607D8B';

  const processDailyData = (requests, dateField = 'createdAt') => {
    const dailyCounts = {};
    
    requests.forEach(request => {
      const date = new Date(request[dateField] || request.createdAt);
      if (isNaN(date.getTime())) return;
      
      const dateKey = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
      dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
    });

    return Object.keys(dailyCounts)
      .sort((a, b) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const [monthA, dayA] = a.split(' ');
        const [monthB, dayB] = b.split(' ');
        return months.indexOf(monthA) - months.indexOf(monthB) || parseInt(dayA) - parseInt(dayB);
      })
      .reduce((acc, date) => ({ ...acc, [date]: dailyCounts[date] }), {});
  };

  const pendingBarData = {
    labels: [...new Set(dashboardData.pendingRequests.map(r => shortenBloodType(r.BloodType)))],
    datasets: [{
      label: 'Pending Requests',
      data: [...new Set(dashboardData.pendingRequests.map(r => shortenBloodType(r.BloodType)))].map(
        type => dashboardData.pendingRequests.filter(r => shortenBloodType(r.BloodType) === type).length
      ),
      backgroundColor: [...new Set(dashboardData.pendingRequests.map(r => shortenBloodType(r.BloodType)))].map(
        type => getColor(type)
      ),
      borderColor: '#ffffff',
      borderWidth: 1
    }]
  };

  const pendingBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Pending Requests (${dashboardData.pendingRequests.length})`,
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} request${ctx.parsed.y !== 1 ? 's' : ''}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        title: { display: true, text: 'Number of Requests' }
      },
      x: {
        title: { display: true, text: 'Blood Type' }
      }
    }
  };

  const monthlyLineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Approved/Fulfilled',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
        (month, i) => dashboardData.approvedRequests.filter(req => 
          new Date(req.HospitalApprovedAt || req.createdAt).getMonth() === i
        ).length
      ),
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      tension: 0.4
    }]
  };

  const monthlyLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Monthly Approved/Fulfilled (${dashboardData.approvedRequests.length})`,
        font: { size: 16 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        title: { display: true, text: 'Number of Requests' }
      }
    }
  };

  const emergencyPieData = {
    labels: [...new Set(dashboardData.emergencyRequests.map(r => shortenBloodType(r.BloodType)))],
    datasets: [{
      data: [...new Set(dashboardData.emergencyRequests.map(r => shortenBloodType(r.BloodType)))].map(
        type => dashboardData.emergencyRequests.filter(r => shortenBloodType(r.BloodType) === type).length
      ),
      backgroundColor: [...new Set(dashboardData.emergencyRequests.map(r => shortenBloodType(r.BloodType)))].map(
        type => getColor(type)
      ),
      borderWidth: 1
    }]
  };

  const emergencyPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Emergency Requests (${dashboardData.emergencyRequests.length})`,
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((ctx.raw / total) * 100);
            return `${ctx.label}: ${ctx.raw} (${percentage}%)`;
          }
        }
      }
    }
  };

  const donorDailyData = processDailyData(dashboardData.acceptedRequests, 'DonerFulfilledAt');
  const hospitalDailyData = processDailyData(dashboardData.hospitalApprovedRequests, 'HospitalApprovedAt');
  
  const allDates = [...new Set([
    ...Object.keys(donorDailyData),
    ...Object.keys(hospitalDailyData)
  ])].sort((a, b) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [monthA, dayA] = a.split(' ');
    const [monthB, dayB] = b.split(' ');
    return months.indexOf(monthA) - months.indexOf(monthB) || parseInt(dayA) - parseInt(dayB);
  });

  const dailyLineData = {
    labels: allDates,
    datasets: [
      {
        label: 'Donor Accepted',
        data: allDates.map(date => donorDailyData[date] || 0),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Hospital Approved',
        data: allDates.map(date => hospitalDailyData[date] || 0),
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const dailyLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Daily Activity',
        font: { size: 16 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        title: { display: true, text: 'Number of Requests' }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div className="main-container">
      <HosNav />
      <div className="sidemenu">
        <HosSidemenu />
        <div className="content-box" style={{ 
          padding: '20px', 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '20px',
          marginTop: "30px"
        }}>
          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '10px',
            width: `${CHART_WIDTH}px`,
            height: `${CHART_HEIGHT}px`
          }}>
            <Bar 
              data={pendingBarData} 
              options={pendingBarOptions} 
              width={CHART_WIDTH}
              height={CHART_HEIGHT}
            />
          </div>

          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '10px',
            width: `${CHART_WIDTH}px`,
            height: `${CHART_HEIGHT}px`
          }}>
            <Line 
              data={monthlyLineData} 
              options={monthlyLineOptions} 
              width={CHART_WIDTH}
              height={CHART_HEIGHT}
            />
          </div>

          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '10px',
            width: `${CHART_WIDTH}px`,
            height: `${CHART_HEIGHT}px`
          }}>
            <Pie 
              data={emergencyPieData} 
              options={emergencyPieOptions} 
              width={CHART_WIDTH}
              height={CHART_HEIGHT}
            />
          </div>

          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '10px',
            width: `${CHART_WIDTH}px`,
            height: `${CHART_HEIGHT}px`
          }}>
            <div style={{ marginBottom: '10px' }}>
              <strong>Daily Summary:</strong> 
              <span style={{ color: '#4CAF50', margin: '0 15px' }}>
                Donor Accepted: {dashboardData.acceptedRequests.length}
              </span>
              <span style={{ color: '#2196F3' }}>
                Hospital Approved: {dashboardData.hospitalApprovedRequests.length}
              </span>
            </div>
            <Line 
              data={dailyLineData} 
              options={dailyLineOptions} 
              width={CHART_WIDTH}
              height={CHART_HEIGHT - 30}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HosDashboard;