import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../Styles/AdSidemenu.css';
import icon1 from '../../Assets/SidemenuIcon/Person.png';
import icon2 from '../../Assets/SidemenuIcon/glucose.png';
import icon3 from '../../Assets/SidemenuIcon/logout.png';
import icon4 from '../../Assets/SidemenuIcon/notification.png';
import icon5 from '../../Assets/SidemenuIcon/About.png';
import icon6 from '../../Assets/SidemenuIcon/contact.png';
import icon7 from '../../Assets/SidemenuIcon/verified.png';
import icon9 from '../../Assets/SidemenuIcon/dashboard.png';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import dp from '../../Assets/dp.jpg'


function DonerSideMenu() {
    useEffect(() => {
        if (localStorage.getItem("Doner") == null) {
          navigate("/");
        }
      });

    const location = useLocation();
    const navigate = useNavigate();
    const [openHospital, setOpenHospital] = useState(false);
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const donorData = JSON.parse(localStorage.getItem('Doner') || '{}');
  const profilePhotoUrl = donorData.ProfilePhoto?.filename 
    ? `http://localhost:4005/${donorData.ProfilePhoto.filename}`
    : dp; 

    const menuItems = [
        { name: 'Dashboard', icon: icon9, path: '/doner-dashboard' },
        { name: 'Profile Management',icon: icon1, path:'/doner-Profile'
            // subItems: [
            //     { name: 'Profile', path: '/doner-Profile' },
            //     { name: 'Donation History', path: '#' }
            // ]
        },
        { name: 'Blood Donation Request', icon: icon2, path: '/donation-req' },
        { name: 'Manage Request', icon: icon2, path: '/doner-FullFilled' },
        { name: 'Donation History', icon: icon7, path: '/doner-completed-requests' },
        // { name: 'Notification', icon: icon4, path: '#' },
        { name: 'About Us', icon: icon5, path: '/doner-aboutus' },
        { name: 'Contact Us', icon: icon6, path: '/doner-ContactUs' },
        { name: 'Logout', icon: icon3, action: () => setOpenLogoutDialog(true) }
    ];

    const toggleHospital = () => {
        setOpenHospital(!openHospital);
    };

    const isActive = (path) => {
        return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    };

    const handleLogout = () => {
        localStorage.removeItem('Doner');
        localStorage.removeItem('DonerBloodType');
        localStorage.removeItem('DonerId');

        setOpenLogoutDialog(false);
        navigate('/');
    };

    return (
        <div className='sidemenu-container'>
            <div className='Admin-card'>
                <Avatar
                    alt={donorData.FullName}
                    src={profilePhotoUrl}
                    sx={{ width: 56, height: 56 }}
                />

                <div>
                    <h3>{donorData?.FullName}</h3>
                    <h5>{donorData?.Email}</h5>
                </div>
            </div>

            <div className='sidemenu-options'>
                {menuItems.map((item, index) => (
                    <div key={index}>
                        {item.subItems ? (
                            <>
                                <div
                                    className={`menu-header ${isActive(item.path) ? 'active' : ''}`}
                                    onClick={() => {
                                        if (item.name === 'Profile Management') {
                                            toggleHospital();
                                        }
                                    }}
                                >
                                    <div className='menu-link'>
                                        <img src={item.icon} alt={item.name} className='sidemenu-icons' />
                                        <span>{item.name}</span>
                                    </div>
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
                                    <img src={item.icon} alt={item.name} className='sidemenu-icons' />
                                    <span>{item.name}</span>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to={item.path}
                                className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                            >
                                <div className='menu-link'>
                                    <img src={item.icon} alt={item.name} className='sidemenu-icons' />
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
                <DialogTitle
                    id="logout-dialog-title"
                    style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px' }}
                >
                    Confirm Logout
                </DialogTitle>
                <DialogContent>
                    <p style={{ textAlign: 'center', fontSize: '18px' }}>
                        Are you sure you want to logout?
                    </p>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center', gap: '20px' }}>
                    <Button onClick={() => setOpenLogoutDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleLogout} color="error" variant="contained" autoFocus>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DonerSideMenu;
