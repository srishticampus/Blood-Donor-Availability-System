import React from 'react'
import '../../Styles/AboutUs.css'
import DonerNav from './DonerNav'
import DonerSideMenu from './DonerSidemenu'
function DonerAboutUs() {
  return (
    <div>
        <DonerNav/>
        <DonerSideMenu/>
    <div className='about-us-main-container'>
       
<div className='about-us-paragraph' style={{marginLeft:"20%"}}>
<h1>Giving Blood, Giving Life-Every Drop Counts !</h1>
</div>
    </div>
    <p className='copy-right'>© 2025 Life Flow. All Rights Reserved </p>

    </div>
  )
}

export default DonerAboutUs