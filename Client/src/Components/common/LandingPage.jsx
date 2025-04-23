import React from 'react'
import Nav from './Nav'
import '../common/Nav'
import '../../Styles/LandingPage.css'
import { Button } from '@mui/material'
import image from '../../Assets/Blood.png'
import { Link } from 'react-router-dom'
function LandingPage() {
    return (
        <div>

            <Nav />
            {/* <AdSidemenu/> */}
            {/* <AdminNav/> */}
            <div className='landing-container'>
                <div className='image-container'>
                    <img src={image} alt="Blood donation" className='blood-image' />
                </div>
                <div className='welcome-container'>
                    <h1 className='welcome-title'>
                        Welcome to Blood <br />
                        Donation Portal
                    </h1>
                    <p className='welcome-text'>
                        Your donation can be the lifeline someone desperately needs. Join us in making a difference 🩸 one drop at a time!
                    </p>
                    <Link to='/register'>
                    <Button variant="contained" color="primary" className='register-button'>
                        Sign up
                    </Button>

                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LandingPage