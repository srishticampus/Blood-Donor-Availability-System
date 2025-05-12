import React, { useEffect, useState } from 'react';
import HosNav from './HosNav';
import HosSidemenu from './HosSidemenu';
import axios from 'axios';
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
  Filler,
  ArcElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { baseUrl } from '../../baseUrl';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

function HosDashboard() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [bloodTypeCounts, setBloodTypeCounts] = useState({});
  const [totalPending, setTotalPending] = useState(0);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [monthlyData, setMonthlyData] = useState({});
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [dailyAcceptedData, setDailyAcceptedData] = useState({});

  useEffect(() => {
    fetchPendingRequests();
    fetchApprovedRequests();
    fetchEmergencyRequests();
    fetchAcceptedRequests();
  }, []);

  const shortenBloodType = (bloodType) => {
    const match = bloodType.match(/\(([^)]+)\)/); 
    return match ? match[1] : bloodType; 
  };

  const fetchPendingRequests = () => {
    const HospitalId = localStorage.getItem('hospitalId');

    axios.get(`${baseUrl}ShowAllBloodRequest`)
      .then(response => {
        const filteredRequests = response.data.filter(request => 
          (request.HospitalId?._id === HospitalId || request.HospitalId === HospitalId) && 
          request.IsDoner === "Pending" && 
          request.IsHospital === "Pending"
        );
        
        setPendingRequests(filteredRequests);
        setTotalPending(filteredRequests.length);
        
        const counts = filteredRequests.reduce((acc, request) => {
          const shortType = shortenBloodType(request.BloodType);
          acc[shortType] = (acc[shortType] || 0) + 1;
          return acc;
        }, {});
        
        setBloodTypeCounts(counts);
      })
      .catch(error => {
        console.error('Error fetching pending requests:', error);
      });
  };

  const fetchApprovedRequests = () => {
    const HospitalId = localStorage.getItem('hospitalId');

    axios.get(`${baseUrl}ShowAllBloodRequest`)
      .then(response => {
        const filteredRequests = response.data.filter(request => {
          const isHospitalMatch = request.HospitalId?._id === HospitalId || request.HospitalId === HospitalId;
          const isApprovedOrFulfilled = 
            request.IsHospital === "Approved" || 
            request.IsDoner === "Fulfilled";
          
          return isHospitalMatch && isApprovedOrFulfilled;
        });
        
        setApprovedRequests(filteredRequests);
        processMonthlyData(filteredRequests);
      })
      .catch(error => {
        console.error('Error fetching approved requests:', error);
      });
  };

  const fetchEmergencyRequests = () => {
    const HospitalId = localStorage.getItem('hospitalId');

    axios.get(`${baseUrl}ShowAllBloodRequest`)
      .then(response => {
        const filteredRequests = response.data.filter(request => 
          (request.HospitalId?._id === HospitalId || request.HospitalId === HospitalId) && 
          request.Status === "Emergency"
        );
        
        setEmergencyRequests(filteredRequests);
      })
      .catch(error => {
        console.error('Error fetching emergency requests:', error);
      });
  };

  const fetchAcceptedRequests = () => {
    const HospitalId = localStorage.getItem('hospitalId');

    axios.get(`${baseUrl}ShowAllBloodRequest`)
      .then(response => {
        const filteredRequests = response.data.filter(request => 
          (request.HospitalId?._id === HospitalId || request.HospitalId === HospitalId) && 
          request.AcceptedByDoner && 
          request.AcceptedByDoner.length > 0
        );
        
        setAcceptedRequests(filteredRequests);
        processDailyAcceptedData(filteredRequests);
      })
      .catch(error => {
        console.error('Error fetching accepted requests:', error);
      });
  };

  const processMonthlyData = (requests) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const monthlyCounts = months.reduce((acc, month) => {
      acc[month] = 0;
      return acc;
    }, {});
    
    requests.forEach(request => {
      try {
        const date = new Date(request.createdAt);
        if (isNaN(date.getTime())) {
          console.warn('Invalid date for request:', request._id, request.createdAt);
          return;
        }
        
        const monthIndex = date.getMonth();
        const monthName = months[monthIndex];
        monthlyCounts[monthName]++;
      } catch (error) {
        console.error('Error processing date:', error);
      }
    });
    
    setMonthlyData(monthlyCounts);
  };

  const processDailyAcceptedData = (requests) => {
    const dailyCounts = {};
    
    requests.forEach(request => {
      try {
        const date = new Date(request.createdAt);
        if (isNaN(date.getTime())) {
          console.warn('Invalid date for request:', request._id, request.createdAt);
          return;
        }
        
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        const dateKey = `${month} ${day}`;
        
        dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
      } catch (error) {
        console.error('Error processing date:', error);
      }
    });
    
    setDailyAcceptedData(dailyCounts);
  };

  const getBloodTypeColor = (bloodType) => {
    const fullType = {
      'A+': 'A Positive (A+)',
      'A-': 'A Negative (A-)',
      'B+': 'B Positive (B+)',
      'B-': 'B Negative (B-)',
      'O+': 'O Positive (O+)',
      'O-': 'O Negative (O-)',
      'AB+': 'AB Positive (AB+)',
      'AB-': 'AB Negative (AB-)'
    }[bloodType] || bloodType;

    switch(fullType) {
      case 'A Negative (A-)': return '#D32F2F'; 
      case 'AB Negative (AB-)': return '#FFA500'; 
      case 'A Positive (A+)': return '#03991F'; 
      case 'B Negative (B-)': return '#7B1FA2'; 
      case 'B Positive (B+)': return '#1976D2'; 
      case 'O Negative (O-)': return '#FF5722'; 
      case 'O Positive (O+)': return '#FBC02D'; 
      case 'AB Positive (AB+)': return '#0097A7'; 
      default: return '#607D8B'; 
    }
  };

  const calculateMaxYValue = (dataValues) => {
    const maxValue = Math.max(...dataValues, 5);
    return Math.ceil(maxValue / 5) * 5;
  };

  const getEmergencyRequestsByBloodType = () => {
    const counts = emergencyRequests.reduce((acc, request) => {
      const shortType = shortenBloodType(request.BloodType);
      acc[shortType] = (acc[shortType] || 0) + 1;
      return acc;
    }, {});
    
    return {
      labels: Object.keys(counts),
      counts: Object.values(counts)
    };
  };

  // Chart data and options
  const barChartData = {
    labels: Object.keys(bloodTypeCounts),
    datasets: [
      {
        label: 'Pending Requests by Blood Type',
        data: Object.values(bloodTypeCounts),
        backgroundColor: Object.keys(bloodTypeCounts).map(bloodType => 
          getBloodTypeColor(bloodType)),
        borderColor: Object.keys(bloodTypeCounts).map(bloodType => 
          getBloodTypeColor(bloodType)
        ),
        borderWidth: 1,
      }
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Pending Blood Requests by Type',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} requests`;
          },
          title: function(context) {
            return `Blood Type ${context[0].label}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: calculateMaxYValue(Object.values(bloodTypeCounts)),
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return value % 1 === 0 ? value : null;
          }
        },
        title: {
          display: true,
          text: 'Number of Requests'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Blood Type'
        }
      }
    }
  };

  const areaChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Approved/Fulfilled Requests',
        data: Object.values(monthlyData),
        fill: true,
        backgroundColor: 'rgba(37, 37, 37, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
      }
    ],
  };

  const areaChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Approved / Fulfilled Requests',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} requests`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: calculateMaxYValue(Object.values(monthlyData)),
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return value % 1 === 0 ? value : null;
          }
        },
        title: {
          display: true,
          text: 'Number of Requests'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      }
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  const sparklineData = {
    labels: Object.keys(dailyAcceptedData).sort((a, b) => {
      const [monthA, dayA] = a.split(' ');
      const [monthB, dayB] = b.split(' ');
      const dateA = new Date(`${monthA} ${dayA}, 2025`);
      const dateB = new Date(`${monthB} ${dayB}, 2025`);
      return dateA - dateB;
    }),
    datasets: [
      {
        label: 'Daily Accepted Requests',
        data: Object.keys(dailyAcceptedData).sort((a, b) => {
          const [monthA, dayA] = a.split(' ');
          const [monthB, dayB] = b.split(' ');
          const dateA = new Date(`${monthA} ${dayA}, 2025`);
          const dateB = new Date(`${monthB} ${dayB}, 2025`);
          return dateA - dateB;
        }).map(date => dailyAcceptedData[date]),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: '#4CAF50'
      }
    ]
  };

  const sparklineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Daily Accepted Requests Trend',
        font: {
          size: 14
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} requests`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        display: true, // ✅ Show Y-axis
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return Number.isInteger(value) ? value : null;
          }
        },
        title: {
          display: true,
          text: 'Number of Requests' // Optional Y-axis title
        }
      },
      x: {
        display: true, // ✅ Show X-axis
        title: {
          display: true,
          text: 'Date' // Optional X-axis title
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 7
        },
        grid: {
          display: false
        }
      }
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 3,
        hoverRadius: 5
      }
    },
    maintainAspectRatio: false
  };
  
  const pieChartData = {
    labels: getEmergencyRequestsByBloodType().labels,
    datasets: [
      {
        data: getEmergencyRequestsByBloodType().counts,
        backgroundColor: getEmergencyRequestsByBloodType().labels.map(bloodType => 
          getBloodTypeColor(bloodType)),
        borderColor: '#fff',
        borderWidth: 1,
      }
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Emergency Requests by Blood Type',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };
  return (
    <div>
      <HosNav/>
      <HosSidemenu/>
      <div className='hos-dashboard' style={{ 
        padding: '20px', 
        marginLeft: '250px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginTop: "30px"
      }}>
        {/* First row with two main charts */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          gridColumn: '1 / -1',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px'
        }}>
          <div style={{ height: '350px' }}>
            <h3>Pending Requests: {totalPending}</h3>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          <div style={{ height: '350px' }}>
            <h3>Approved/Fulfilled: {approvedRequests.length}</h3>
            <Line data={areaChartData} options={areaChartOptions} />
          </div>
        </div>
        
        {/* Second row with sparkline and pie chart side by side */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          gridColumn: '1 / -1',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px'
        }}>
          {/* Sparkline Chart - Left Side */}
          
          {/* Pie Chart - Right Side */}
          <div style={{ height: '350px' }}>
            <h3>Emergency Requests: {emergencyRequests.length}</h3>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
          <div style={{ height: '350px' }}>
            <h3>Daily Accepted Requests: {acceptedRequests.length}</h3>
            <Line data={sparklineData} options={sparklineOptions} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default HosDashboard;