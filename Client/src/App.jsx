import React from 'react'
import LandingPage from './Components/common/LandingPage'
import Login from './Components/Doner/DonerLogin'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import DonerRegistration from './Components/Doner/DonerRegistration';
import MedicalInfo from './Components/Doner/MedicalInfo';
import AboutUs from './Components/common/AboutUs';
import DonationRequest from './Components/User/DonationRequest';
import AdminLogin from './Components/Admin/AdminLogin';
import HospitalReqt from './Components/Admin/HospitalReqt';
import ApprovedHospitals from './Components/Admin/ApprovedHospitals';
import EmergencyAlert from './Components/Admin/EmergencyAlert';
import CompletedRequests from './Components/Admin/CompletedRequests';
import UserEnquiry from './Components/Admin/UserEnquiry';
import ViewDoner from './Components/Admin/ViewDoners';
import Notification from './Components/Admin/Notification';
import BloodRequests from './Components/Admin/BloodRequests';
import DonerDetails from './Components/Admin/DonerDetails';
import HosRegistration from './Components/Hospital/HosRegistration';
import HosLogin from './Components/Hospital/HosLogin';
import Forgot from './Components/Hospital/Forgot';
import HosResetPass from './Components/Hospital/HosResetPass';
import EditHospital from './Components/Hospital/EditHospital';
import HospitalProfile from './Components/Hospital/HospitalProfile';
import BloodRequestHos from './Components/Hospital/BloodRequestHos';
import EditBloodReq from './Components/Hospital/EditBloodReq';
import WilligDoners from './Components/Hospital/WillingDoners';
import HosCompletedReq from './Components/Hospital/HosCompletedReq';
import AllBloodRequest from './Components/Hospital/AllBloodRequest';
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
import UserBloodReq from './Components/User/UserBloodReq';
import ManageUserBlood from './Components/Hospital/ManageUserBlood';
import ApprovedRequest from './Components/Hospital/ApprovedRequest';
import CalceledRequest from './Components/Hospital/CanceledRequest';
import DonerBloodRequest from './Components/Doner/DonerBloodRequest';
import AddHealthDetails from './Components/Doner/AddHealthDetails';
import RequestHistory from './Components/User/RequestHistory';
import EditUserRequest from './Components/User/EditUserRequest';
import HospitalList from './Components/User/HospitalList';
import Approving from './Components/Doner/Approving';
import DonerDonationHistory from './Components/Doner/DonerDonationHistory';
import ViewRequests from './Components/User/ViewRequests';
import UserNotification from './Components/User/UserNotification';
import AdminDashboard from './Components/Admin/AdminDashboard';
import ContactUs from './Components/common/ContactUs';
import DonerContactUs from './Components/Doner/DonerContactus';
import DonerAboutUs from './Components/Doner/DonerAboutUs';
import ViewAllUsers from './Components/Admin/ViewAllUsers';

const NavigationHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // Ensure browser navigation works
    const unblock = window.addEventListener('popstate', () => {
      navigate(location.pathname, { replace: true });
    });

    return () => {
      window.removeEventListener('popstate', unblock);
    };
  }, [navigate, location]);

  return null;
};


function App() {
  return (
    <div>
      <Router basename='/blood_donor'>
        <NavigationHandler />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path='/ContactUs' element={<ContactUs/>} />

          {/* Doner route */}
          <Route path="/login" element={<Login />} />
          <Route path="/doner-registration" element={<DonerRegistration />} />
          <Route path="/forgotPass-doner" element={<DonerForgot />} />
          <Route path="/resetPassDoner/:id" element={<DonerResetPass />} />
          <Route path="/healthDetails" element={<AddHealthDetails />} />
          <Route path="/doner-medical-details" element={<MedicalInfo />} />
          <Route path="/donation-req" element={<DonerBloodRequest />} />
          <Route path="/doner-dashboard" element={<DonerDashboard />} />
          <Route path="/doner-Profile" element={<DonerProfile />} />
          <Route path="/doner-edit-profile" element={<DonerEditProfile />} />
          <Route path="/doner-completed-requests" element={<DonerDonationHistory />} />
          <Route path="/doner-FullFilled" element={<Approving />} />
          <Route path="/doner-ContactUs" element={<DonerContactUs />} />
          <Route path="/doner-aboutus" element={<DonerAboutUs />} />

          {/* Admin route */}
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/AdminDashBord" element={< AdminDashboard/>} />
          <Route path="/doner-details/:id" element={<DonerDetails />} />
          <Route path="/Hospital-req" element={<HospitalReqt />} />
          <Route path="/approved-hospitals" element={<ApprovedHospitals />} />
          <Route path="/view-doners" element={<ViewDoner />} />
          <Route path="/emergency-alerts" element={<EmergencyAlert />} />
          <Route path="/completed-requests" element={<CompletedRequests />} />
          <Route path="/enquiries" element={<UserEnquiry />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/blood-requests" element={<BloodRequests />} />
          <Route path="/ViewAllUsers" element={<ViewAllUsers />} />


          {/* Hospital route */}

          <Route path="/hospitalRegistration" element={<HosRegistration />} />
          <Route path="/hospitalInfo" element={<HospitalInfo />} />
          <Route path="/Hospital-Dashboard" element={<HosDashboard />} />

          <Route path="/hosLogin" element={<HosLogin />} />
          <Route path="/forgotPass" element={<Forgot />} />
          <Route path="/resetPass/:id" element={<HosResetPass />} />
          <Route path="/hosProfile" element={<HospitalProfile />} />
          <Route path="/hosEditProfile" element={<EditHospital />} />
          <Route path="/bloodrequesthos" element={<BloodRequestHos />} />
          <Route path="/editBloodReq/:id" element={<EditBloodReq />} />
          <Route path="/willingDoners" element={<WilligDoners />} />
          <Route path="/hosCompletedReq" element={<HosCompletedReq />} />
          <Route path="/hosEmergency" element={<AllBloodRequest />} />
          <Route path="/manageUserBlood" element={<ManageUserBlood />} />
          <Route path="/approvedRequests" element={<ApprovedRequest />} />
          <Route path="/canceledRequests" element={<CalceledRequest />} />



          <Route path="/UserRegistration" element={<UserRegistration />} />
          <Route path="/UserLogin" element={<UserLogin />} />
          <Route path="/UserDashboard" element={<UserDashboard />} />
          <Route path="/forgotPassuser" element={<UserForgotPass />} />
          <Route path="/resetPassuser/:id" element={<UserResetPassword />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/user-edit-profile" element={<UserEditProfile />} />
          <Route path="/user-blood-request" element={<UserBloodReq />} />
          <Route path="/user-requests" element={<RequestHistory />} />
          <Route path="/user-edit-request/:id" element={<EditUserRequest />} />
          <Route path="/user-HospitalList" element={<HospitalList />} />
          <Route path="/user-view-requests" element={<ViewRequests />} />
          <Route path="/user-view-notifications" element={<UserNotification />} />


        </Routes>
      </Router>
    </div>
  )
}

export default App