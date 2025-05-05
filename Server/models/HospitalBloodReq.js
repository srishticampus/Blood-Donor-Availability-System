const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HospitalBloodReq = new mongoose.Schema({
    PatientName: { type: String, required: true },
    ContactNumber: { type: Number, required: true },
    BloodType: { type: String, require: true },
    UnitsRequired: { type: Number, required: true },
    Status: { type: String, required: true },
    specialization: { type: String },
    doctorName: { type: String },
    HospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital' },
    USERID: { type: Schema.Types.ObjectId, ref: 'Users' },
    Date: { type: Date },
    Time: { type: String },
    IsHospital: { type: String, default: 'Pending' },
    IsDoner: { type: String, default: 'Pending' },
    RejectionReason: { type: String },
    ReadbyDoner: { type: String, default: 'Pending' },
    ReadbyAdmin: { type: String, default: 'Pending' },
    ReadbyUser: { type: String, default: 'Pending' },

    RejectedBy: [{
        hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital' },
        reason: { type: String },
        rejectedAt: { type: Date, default: Date.now }
    }],
    AcceptedBy: { type: Schema.Types.ObjectId, ref: 'Hospital' },
    AcceptedByDoner: {
        type: [{
          donerId: { type: Schema.Types.ObjectId, ref: 'doner' },
          donationStatus:{type:String , defualt:"Accepted"},
          AccepteddAt: { type: Date, default: Date.now }
        }],
        default: []
      },
          RejectedByDoner: [{
        donerId: { type: Schema.Types.ObjectId, ref: 'doner' },
        rejectedAt: { type: Date, default: Date.now }
    }],
    DeletedBy: { type: Schema.Types.ObjectId, ref: 'Hospital' },
    DeletedReason: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BloodRequests', HospitalBloodReq);