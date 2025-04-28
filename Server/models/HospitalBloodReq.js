const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HospitalBloodReq = new mongoose.Schema({
    PatientName: { type: String, required: true },
    ContactNumber: { type: Number, required: true },
    BloodType: { type: String, require: true }, 
    UnitsRequired: { type: Number, required: true },
    Status: { type: String, required: true },
    HospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital' }, 
    UserId: { type: Schema.Types.ObjectId, ref: 'Users' } 
});

module.exports = mongoose.model('BloodRequests', HospitalBloodReq); 