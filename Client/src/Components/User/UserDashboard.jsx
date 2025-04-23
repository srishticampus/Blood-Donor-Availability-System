import React from 'react'
import BloodImg from '../../Assets/UserBlood.png'
import { Avatar } from '@mui/material'
import UserSideMenu from './UserSideMenu'
import UserNav from './UserNav'

function UserDashboard() {
    return (
        <div>
            <UserSideMenu/>
            <UserNav/>
            <div className='doner-dashboard' style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>
            <h1>Welcome to the User Dashboard</h1>
            </div>
        </div>
    )
}

export default UserDashboard