import React, { useEffect, useState } from 'react';
import { Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../Styles/AdSidemenu.css';
import icon1 from '../../Assets/SidemenuIcon/hospital.png';
import icon2 from '../../Assets/SidemenuIcon/AddUser.png';
import icon3 from '../../Assets/SidemenuIcon/logout.png';
import icon4 from '../../Assets/SidemenuIcon/manage.png';
import icon6 from '../../Assets/SidemenuIcon/glucose.png';
import icon7 from '../../Assets/SidemenuIcon/verified.png';
import icon9 from '../../Assets/SidemenuIcon/dashboard.png';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import dp from '../../Assets/dp.jpg'

function HosSidemenu() {
    useEffect(() => {
        if (localStorage.getItem("Hospital") == null) {
          navigate("/");
        }
      });


    const location = useLocation();
    const navigate = useNavigate();

    const hospitalData = JSON.parse(localStorage.getItem('Hospital') || '{}');

console.log(hospitalData);
  const hospitalProfile = hospitalData.ProfilePhoto?.filename 
    ? `http://localhost:4058/${hospitalData.ProfilePhoto.filename}`
    : dp; 


    const [openHospital, setOpenHospital] = useState(false);
    const [openOrganization, setOpenOrganization] = useState(false);
    const [openBloodRequest, setOpenBloodRequest] = useState(false);
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const menuItems = [
        { name: 'Dashboard', icon: icon9, path: '/Hospital-Dashboard' },
        {name: 'Hospital Profile',icon: icon1, path:'/hosProfile'},
        {
            name: 'Request Management',
            icon: icon2,
            subItems: [
                { name: 'User Request', path: '/manageUserBlood' },
                { name: 'Approved Request', path: '/approvedRequests' },
                { name: 'Cancel Requests', path: '/canceledRequests' }
            ]
        },
        {
            name: 'Blood Request Management',
            icon: icon6,
            subItems: [
                { name: "Add New Blood Request", path: '/bloodrequesthos' },
                { name: "All Request for Blood", path: '/hosEmergency' },
                { name: "Willing Doners", path: '/willingDoners' },
            ]
        },
        { name: 'Completed Requests', icon: icon7, path: '/hosCompletedReq' },
        { name: 'Logout', icon: icon3, action: () => setOpenLogoutDialog(true) }
    ];

    const toggleHospital = () => {
        setOpenHospital(!openHospital);
        setOpenOrganization(false);
        setOpenBloodRequest(false);
    };

    const toggleOrganization = () => {
        setOpenOrganization(!openOrganization);
        setOpenHospital(false);
        setOpenBloodRequest(false);
    };

    const toggleBloodRequest = () => {
        setOpenBloodRequest(!openBloodRequest);
        setOpenHospital(false);
        setOpenOrganization(false);
    };

    const isActive = (path) => {
        return location.pathname === path ||
            (path !== '/' && location.pathname.startsWith(path));
    };

    const handleLogout = () => {
        localStorage.removeItem('Hospital');
        setOpenLogoutDialog(false);
        navigate('/');
    };

    return (
        <div className='sidemenu-container'>
            <div className='Admin-card'>
                <Avatar
                    alt="Hospital Logo"
                    src={hospitalProfile}
                    sx={{ width: 56, height: 56 }}
                />
                <div>
                    <h3>{hospitalData.FullName || 'Hospital Name'}</h3>
                    <h5>{hospitalData.Email || 'hospital@medlink.com'}</h5>
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
                                        if (item.name === 'Hospital Profile') {
                                            toggleHospital();
                                        } else if (item.name === 'Request Management') {
                                            toggleOrganization();
                                        } else if (item.name === 'Blood Request Management') {
                                            toggleBloodRequest();
                                        }
                                    }}
                                >
                                    <div className='menu-link'>
                                        <img src={item.icon} alt={item.name} className='sidemenu-icons' />
                                        <span>{item.name}</span>
                                    </div>
                                    {item.name === 'Hospital Profile' && (
                                        openHospital ? <ExpandLess className='dropdown-icon' /> : <ExpandMore className='dropdown-icon' />
                                    )}
                                    {item.name === 'Request Management' && (
                                        openOrganization ? <ExpandLess className='dropdown-icon' /> : <ExpandMore className='dropdown-icon' />
                                    )}
                                    {item.name === 'Blood Request Management' && (
                                        openBloodRequest ? <ExpandLess className='dropdown-icon' /> : <ExpandMore className='dropdown-icon' />
                                    )}
                                </div>

                                {item.name === 'Hospital Profile' && openHospital && (
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

                                {item.name === 'Request Management' && openOrganization && (
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

                                {item.name === 'Blood Request Management' && openBloodRequest && (
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

export default HosSidemenu;