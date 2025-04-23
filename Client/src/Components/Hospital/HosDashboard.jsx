import React from 'react'
import HosNav from './HosNav'
import HosSidemenu from './HosSidemenu'

function HosDashboard() {
  return (
    <div>
        <HosNav/>
        <HosSidemenu/>
        <div className='doner-dashboard' style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>
            <h1>Welcome to the Hospital Dashboard</h1>
            </div>
    </div>
  )
}

export default HosDashboard