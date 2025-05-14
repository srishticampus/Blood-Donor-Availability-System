const express = require('express')
const router = express.Router()
const HospitalController = require('./controllers/HospitalController')
const AdminController = require('./controllers/AdminController')
const DonerController=require('./controllers/DonerController')
const UserController=require('./controllers/UserController')
const BloodRequestController = require('./controllers/BloodRequestController')
const ContactUsController = require('./controllers/ContactUsController')

router.post('/adminlogin',AdminController.login)

router.post('/registration',DonerController.upload,DonerController.newRegistration)

router.post('/donerlogin',DonerController.DonerLogin)
router.post('/donorEditProfile',DonerController.upload,DonerController.editDonorProfile)
router.post('/ViewAllDoner',DonerController.ViewAllDonors)
router.post('/FindDonerEmail',DonerController.FindEmail)
router.post('/ForgotPass-doner/:Email',DonerController.ForgotPassword)
router.post('/ViewDonerProfile/:id',DonerController.FindOneDoner)
router.post('/findDoner/:id',DonerController.FindDonerParams)



router.post('/hospital-registration',HospitalController.upload,HospitalController.newRegistration)
router.post('/hospital-login',HospitalController.loginHospital)
router.post('/hosEmailFind',HospitalController.FindEmail)
router.post('/hosEditProfile',HospitalController.upload,HospitalController.editHospitalProfile)
router.post('/hospital-forgot/:Email',HospitalController.ForgotPassword)
router.post('/viewAllHos',HospitalController.ViewAllHospital)
router.post('/hospitalApprove',HospitalController.ApproveHospital)
router.post('/hospitalReject',HospitalController.RejectHospital)


router.post('/UserRegistration',UserController.upload,UserController.UserRegistration)
router.post('/UserLogin',UserController.UserLogin)
router.post('/FindUserEmail',UserController.FindEmail)
router.post('/ForgotPass-user/:Email',UserController.ForgotPassword)
router.post('/EditUserdata',UserController.upload,UserController.editUserProfile)
router.post('/viewAllUsers',UserController.ViewAllUsers)


router.post('/AddBloodRequest',BloodRequestController.createBloodRequest)
router.get('/ShowRequest/:hospitalId', BloodRequestController.getHospitalBloodRequests);
router.get('/ShowRequestUser/:USERID', BloodRequestController.getUserBloodRequests);
router.get('/ShowAllBloodRequest',BloodRequestController.getAllBloodRequests)
router.post("/:id/approve", BloodRequestController.approveBloodRequest);
router.post("/:id/Donerapprove", BloodRequestController.approveBloodRequestByDoner);
router.post("/:id/DonerReject", BloodRequestController.donerrejectBloodRequest);
router.post("/:id/reject", BloodRequestController.rejectBloodRequest)
router.post("/:id/delete", BloodRequestController.deletingBloodRequest)
router.post("/EditHospital/BloodReq/:_id", BloodRequestController.updateBloodRequest);
router.post("/FetchHosReq/:id", BloodRequestController.getBloodRequestById)
router.post("/bloodRequests/:id", BloodRequestController.deleteBloodRequest)
router.post("/FullFill/:id", BloodRequestController.FullFillBloodRequest)
router.post("/Cancel/:id", BloodRequestController.donercancelBloodRequest)
router.patch('/notifications/:requestId/admin-read', BloodRequestController.markAsReadByAdmin);
router.patch('/notifications/:requestId/user-read', BloodRequestController.markAsReadByUser);
router.patch('/notifications/:requestId/donor-read', BloodRequestController.markAsReadByDoner);

router.post('/ContactUs',ContactUsController.createContact)
router.post('/ShowAllContactUs',ContactUsController.getAllContacts)
router.post('/deleteContact/:id' , ContactUsController.deleteContact)
module.exports=router

