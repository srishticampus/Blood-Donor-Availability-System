import React, { useState } from 'react';
import { Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../Styles/AdSidemenu.css';
import icon1 from '../../Assets/SidemenuIcon/barchart.png';
import icon2 from '../../Assets/SidemenuIcon/glucose.png';
import icon3 from '../../Assets/SidemenuIcon/logout.png';
import icon4 from '../../Assets/SidemenuIcon/manage.png';
import icon5 from '../../Assets/SidemenuIcon/notification.png';
import icon6 from '../../Assets/SidemenuIcon/settings.png';
import icon7 from '../../Assets/SidemenuIcon/verified.png';
import icon8 from '../../Assets/SidemenuIcon/warning.png';
import icon9 from '../../Assets/SidemenuIcon/dashboard.png';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';

function AdSidemenu() {
    
    const location = useLocation();
    const navigate = useNavigate();
    const [openHospital, setOpenHospital] = useState(false);
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const menuItems = [
        { name: 'Dashboard', icon: icon9, path: '/AdminDashBord' },
        { 
            name: 'Hospital Management', 
            icon: icon4,
            subItems: [
                { name: 'All Requests', path: '/Hospital-req' },
                { name: 'Approved Hospitals', path: '/approved-hospitals' }
            ]
        },
        { name: 'Donor Management', icon: icon6, path: '/view-doners' },
        { name: 'Emergency Alert', icon: icon8, path: '/emergency-alerts' },
        { name: 'Blood Requests', icon: icon2, path: '/blood-requests' },
        { name: 'Notifications', icon: icon5, path: '/notifications' },
        { name: 'Completed Requests', icon: icon7, path: '/completed-requests' },
        { name: 'Enquiries', icon: icon1, path: '/enquiries' },
        { name: 'Logout', icon: icon3, action: () => setOpenLogoutDialog(true) }
    ];

    const toggleHospital = () => {
        setOpenHospital(!openHospital);
    };

    const isActive = (path) => {
        return location.pathname === path || 
               (path !== '/' && location.pathname.startsWith(path));
    };

    const handleLogout = () => {
        setOpenLogoutDialog(false);
        navigate('/AdminLogin'); 
    };

    return (
        <div className='sidemenu-container'>
            <div className='Admin-card'>
                <Avatar
                    alt="Admin"
                    src="https://img.freepik.com/premium-vector/blue-white-logo-with-three-men-circle-with-picture-man-circle-with-picture-man-circle-with-rainbow-center_1205884-4061.jpg"
                />
                <div>
                    <h3>BDAS</h3>
                    <h5>admin@123</h5>
                </div>
            </div>
            <div className='sidemenu-options'>
                {menuItems.map((item, index) => (
                    <div key={index}>
                        {item.subItems ? (
                            <>
                                <div 
                                    className={`menu-header ${isActive(item.path) ? 'active' : ''}`}
                                    onClick={toggleHospital}
                                >
                                    <Link to={item.path} className='menu-link'>
                                        <img src={item.icon} alt={item.name} className='sidemenu-icons'/>
                                        <span>{item.name}</span>
                                    </Link>
                                    {openHospital ? <ExpandLess className='dropdown-icon' /> : <ExpandMore className='dropdown-icon' />}
                                </div>
                                
                                {openHospital && (
                                    <div className='submenu'>
                                        {item.subItems.map((subItem, subIndex) => (
                                            <Link 
                                                to={subItem.path}
                                                key={subIndex}
                                                className={`submenu-item ${isActive(subItem.path) ? 'active-sub' : ''}`}
                                            >
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : item.action ? (
                            <div 
                                className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                                onClick={item.action}
                            >
                                <div className='menu-link'>
                                    <img src={item.icon} alt={item.name} className='sidemenu-icons'/>
                                    <span>{item.name}</span>
                                </div>
                            </div>
                        ) : (
                            <Link 
                                to={item.path} 
                                className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                            >
                                <div className='menu-link'>
                                    <img src={item.icon} alt={item.name} className='sidemenu-icons'/>
                                    <span>{item.name}</span>
                                </div>
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            <Dialog
                open={openLogoutDialog}
                onClose={() => setOpenLogoutDialog(false)}
                aria-labelledby="logout-dialog-title"
                sx={{
                    '& .MuiDialog-paper': {
                        width: '350px', 
                        borderRadius: '16px', 
                    }
                }}
            >
                <DialogTitle id="logout-dialog-title" style={{ textAlign: "center", fontWeight: "bold", fontSize: "24px" }}>
                    Confirm Logout
                </DialogTitle>
                <DialogContent>
                    <p style={{textAlign:'center',fontSize:'18px'}}>Are you sure you want to logout?</p>
                </DialogContent>
                <DialogActions style={{ justifyContent: "center", gap:'20px' }}>
                    <Button
                        onClick={() => setOpenLogoutDialog(false)}
                        color="primary"
                    >
                        No, Go Back
                    </Button>
                    <Button
                        onClick={handleLogout}
                        color="error"
                        variant="contained"
                        autoFocus
                    >
                        Yes, Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AdSidemenu;