const mongoose = require('mongoose')

const HospitalSchema = new mongoose.Schema({
    ProfilePhoto: { type: Object },
    FullName: { type: String, required: true },
    RegistrationNumber: { type: String, required: true , unique: true},
    Email: { type: String, unique: true, required: true },
    Password: { type: String, required: true },
    PhoneNo: { type: Number, unique: true, required: true },
    Address: { type: String, required: true },
    Street: { type: String, required: true },
    City: { type: String, required: true },
    Pincode: { type: Number, required: true },
    OpeningTime: { type: String, required: true },
    ClosingTime: { type: String, required: true },
    Document: { type: Object, required: true },
    isAdminApprove: { type: Boolean, default: false, required: true }
});


module.exports = mongoose.model('Hospital', HospitalSchema);