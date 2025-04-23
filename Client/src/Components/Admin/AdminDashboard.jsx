import React from 'react'
import AdminNav from './AdminNav'
import AdSidemenu from './AdSidemenu'

function AdminDashboard() {
  return (
    <div>
      <AdminNav/>
      <AdSidemenu/>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>
          Admin DashBoard
        </div>
    </div>
  )
}

export default AdminDashboard