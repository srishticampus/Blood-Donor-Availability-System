import React, { useEffect, useState } from 'react';
import { Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../Styles/AdSidemenu.css';
import icon1 from '../../Assets/SidemenuIcon/logout.png';
import icon2 from '../../Assets/SidemenuIcon/Person.png';
import icon3 from '../../Assets/SidemenuIcon/dashboard.png';
import icon4 from '../../Assets/SidemenuIcon/glucose.png';
import icon5 from '../../Assets/SidemenuIcon/notification.png';
import icon6 from '../../Assets/SidemenuIcon/EditProfile.png';
import icon7 from '../../Assets/SidemenuIcon/Docs.png';
import icon8 from '../../Assets/SidemenuIcon/Local Hos.png';
import icon9 from '../../Assets/SidemenuIcon/Send.png';
import dp from '../../Assets/dp.jpg'



function UserSideMenu() {
    const navigate = useNavigate()
        useEffect(() => {
            if (localStorage.getItem("User") == null) {
              navigate("/");
            }
          });
    
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
    const location = useLocation();

    const UserData = JSON.parse(localStorage.getItem('User') || '{}');

console.log(UserData);
  const UserProfile = UserData.ProfilePhoto?.filename 
    ? `http://localhost:4005/${UserData.ProfilePhoto.filename}`
    : dp; 


    

    const menuItems = [
        { name: 'Dashboard', icon: icon3, path: '/UserDashboard' },
        { name: 'Profile', icon: icon2, path: '/user-profile' },
        { name: 'Blood Donation Request', icon: icon4, path: '/user-view-requests' },
        { name: 'Notification', icon: icon5, path: '/user-view-notifications' },
        { name: 'History', icon: icon7, path: '/user-requests' },
        { name: 'Hospitals', icon: icon8, path: '/user-HospitalList' },
        { name: 'Send Request', icon: icon9, path: '/user-blood-request' },
        { name: 'Logout', icon: icon1, action: () => setOpenLogoutDialog(true) }
    ];

    const isActive = (path) => {
        return location.pathname === path || 
               (path !== '/' && location.pathname.startsWith(path));
    };

    const handleLogout = () => {
        localStorage.removeItem('User');
        localStorage.removeItem('UserId');

        setOpenLogoutDialog(false);
        navigate("/")
    };

    return (
        <div className='sidemenu-container'>
            <div className='Admin-card'>
                <Avatar
                    alt="Hospital Logo"
                    src={UserProfile}
                    sx={{ width: 56, height: 56 }}
                />
                <div>
                    <h3>{UserData.FullName}</h3>
                    <h5>{UserData.Email}</h5>
                </div>
            </div>

            <div className='sidemenu-options'>
                {menuItems.map((item, index) => (
                    <div key={index}>
                        {item.action ? (
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
                <DialogTitle id="logout-dialog-title" style={{ textAlign: "center", fontWeight: "bold", fontSize: "24px" }}>
                    Confirm Logout
                </DialogTitle>
                <DialogContent>
                    <p style={{ textAlign: 'center', fontSize: '18px' }}>Are you sure you want to logout?</p>
                </DialogContent>
                <DialogActions style={{ justifyContent: "center", gap: '20px' }}>
                    <Button
                        onClick={() => setOpenLogoutDialog(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleLogout}
                        color="error"
                        variant="contained"
                        autoFocus
                    >
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default UserSideMenu;