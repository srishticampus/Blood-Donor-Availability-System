  import React from 'react'
import LandingPage from './Components/common/LandingPage'
import Login from './Components/Doner/DonerLogin'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DonerRegistration from './Components/Doner/DonerRegistration';
import MedicalInfo from './Components/Doner/MedicalInfo';
import AboutUs from './Components/common/AboutUs';
import DonationRequest from './Components/User/DonationRequest';
import AdminLogin from './Components/Admin/AdminLogin';
import HospitalReqt from './Components/Admin/HospitalReqt';
import ApprovedHospitals from './Components/Admin/ApprovedHospitals';
import ViewMembers from './Components/Admin/ViewMembers';
import EmergencyAlert from './Components/Admin/EmergencyAlert';
import CompletedRequests from './Components/Admin/CompletedRequests';
import UserEnquiry from './Components/Admin/UserEnquiry';
import ViewDoner from './Components/Admin/ViewDoners';
import Notification from './Components/Admin/Notification';
import BloodRequests from './Components/Admin/BloodRequests';
import OrganizationMembers from './Components/Admin/OrganzizationMembers';
import DonerDetails from './Components/Admin/DonerDetails';
import HosRegistration from './Components/Hospital/HosRegistration';
import HosLogin from './Components/Hospital/HosLogin';
import Forgot from './Components/Hospital/Forgot';
import HosResetPass from './Components/Hospital/HosResetPass';
import EditHospital from './Components/Hospital/EditHospital';
import HospitalProfile from './Components/Hospital/HospitalProfile';
import HosPatManagement from './Components/Hospital/HosPatManagement';
import HosPatDetails from './Components/Hospital/HosPatDetails';
import EditHosPatDetails from './Components/Hospital/EditHosPatDetails';
import BloodRequestHos from './Components/Hospital/BloodRequestHos';
import EditBloodReq from './Components/Hospital/EditBloodReq';
import WilligDoners from './Components/Hospital/WillingDoners';
import HosCompletedReq from './Components/Hospital/HosCompletedReq';
import AllBloodRequest from './Components/Hospital/AllBloodRequest';
import AdminDashboard from './Components/Admin/AdminDashboard';
import DonerDashboard from './Components/Doner/DonerDashboard';
import Registration from './Components/common/Registration';
import HospitalInfo from './Components/Hospital/HospitalInfo';
import HosDashboard from './Components/Hospital/HosDashboard';
import UserRegistration from './Components/User/UserRegistration';
import UserLogin from './Components/User/UserLogin';
import UserDashboard from './Components/User/UserDashboard';
import UserForgotPass from './Components/User/UserForgotPass';
import UserResetPassword from './Components/User/UserResetPassword';
import UserProfile from './Components/User/UserProfie';
import DonerProfile from './Components/Doner/DonerProfile';
import DonerEditProfile from './Components/Doner/DonerEditProfile';
import UserEditProfile from './Components/User/UserEditProfile';
import DonerForgot from './Components/Doner/DonerForgot';
import DonerResetPass from './Components/Doner/DonerResetPass';
  
  function App() {
    return (
      <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/about" element={<AboutUs/>} />

{/* Doner route */}
          <Route path="/login" element={<Login />} />
          <Route path="/doner-registration" element={<DonerRegistration/>} />
          <Route path="/forgotPass-doner" element={<DonerForgot/>} />
          <Route path="/resetPassDoner/:id" element={<DonerResetPass/>} />

          <Route path="/doner-medical-details" element={<MedicalInfo/>} />
          <Route path="/donation-req" element={<DonationRequest/>} />
          <Route path="/doner-dashboard" element={<DonerDashboard/>} />
          <Route path="/doner-Profile" element={<DonerProfile/>} />
          <Route path="/doner-edit-profile" element={<DonerEditProfile/>} />

          {/* Admin route */}
          <Route path="/AdminLogin" element={<AdminLogin/>} />
          <Route path="/AdminDashBord" element={<AdminDashboard/>} />

          <Route path="/Hospital-req" element={<HospitalReqt/>} />
          <Route path="/approved-hospitals" element={<ApprovedHospitals/>} />
          <Route path="/view-members" element={<ViewMembers/>} />
          <Route path="/view-doners" element={<ViewDoner/>} />
          <Route path="/emergency-alerts" element={<EmergencyAlert/>} />
          <Route path="/completed-requests" element={<CompletedRequests/>} />
          <Route path="/enquiries" element={<UserEnquiry/>} />
          <Route path="/notifications" element={<Notification/>} />
          <Route path="/blood-requests" element={<BloodRequests/>} />
          <Route path="/member-details" element={<OrganizationMembers/>} />
          <Route path="/doner-details" element={<DonerDetails/>} />


{/* Hospital route */}

          <Route path="/hospitalRegistration" element={<HosRegistration/>} />
          <Route path="/hospitalInfo" element={<HospitalInfo/>} />
          <Route path="/Hospital-Dashboard" element={<HosDashboard/>} />

          <Route path="/hosLogin" element={<HosLogin/>}/>
          <Route path="/forgotPass" element={<Forgot/>} />
          <Route path="/resetPass/:id" element={<HosResetPass/>} />
          <Route path="/hosProfile" element={<HospitalProfile/>} />
          <Route path="/hosEditProfile" element={<EditHospital/>} />
          <Route path="/hospatManagement" element={<HosPatManagement/>} />
          <Route path="/hosPatDetails" element={<HosPatDetails/>} />
          <Route path="/edithospatDetails" element={<EditHosPatDetails/>} />
          <Route path="/bloodrequesthos" element={<BloodRequestHos/>} />
          <Route path="/editBloodReq" element={<EditBloodReq/>} />
          <Route path="/willingDoners" element={<WilligDoners/>} />
          <Route path="/hosCompletedReq" element={<HosCompletedReq/>} />
          <Route path="/hosEmergency" element={<AllBloodRequest/>} />

          <Route path="/UserRegistration" element={<UserRegistration/>} />
          <Route path="/UserLogin" element={<UserLogin/>} />
          <Route path="/UserDashboard" element={<UserDashboard/>} />
          <Route path="/forgotPassuser" element={<UserForgotPass/>} />
          <Route path="/resetPassuser/:id" element={<UserResetPassword/>} />
          <Route path="/user-profile" element={<UserProfile/>} />
          <Route path="/user-edit-profile" element={<UserEditProfile/>} />


        </Routes>
      </Router>
      </div>
    )
  }
  
  export default App