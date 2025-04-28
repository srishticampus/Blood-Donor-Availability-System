const express = require('express')
const router = express.Router()
const HospitalController = require('./controllers/HospitalController')
const AdminController = require('./controllers/AdminController')
const DonerController=require('./controllers/DonerController')
const UserController=require('./controllers/UserController')
const BloodRequestController = require('./controllers/BloodRequestController')

router.post('/adminlogin',AdminController.login)

router.post('/registration',DonerController.upload,DonerController.newRegistration)

router.post('/donerlogin',DonerController.DonerLogin)
router.post('/donorEditProfile',DonerController.upload,DonerController.editDonorProfile)
router.post('/ViewAllDoner',DonerController.ViewAllDonors)
router.post('/FindDonerEmail',DonerController.FindEmail)
router.post('/ForgotPass-doner/:Email',DonerController.ForgotPassword)



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


router.post('/AddBloodRequest',BloodRequestController.createBloodRequest)

module.exports=router

