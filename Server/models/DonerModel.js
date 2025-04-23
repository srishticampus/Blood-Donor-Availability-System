const mongoose = require('mongoose')

const DonerSchema = new mongoose.Schema({
    ProfilePhoto: { type: Object},
    FullName: { type: String, required: true },
    DateOfBirth: { type: Date, required: true },
    Email: { type: String, required: true },
    Password: { type: String, required: true },
    Gender: { type: String, enum: ['Male', 'Female', 'Third Gender'], required: true },
    PhoneNo: { type: String, required: true },
    Pincode: { type: String, required: true },
    District: { type: String, required: true },
    AadharNumber: { type: Number, required: true,unique: true },
    City: { type: String, required: true },
    bloodgrp: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required: true },
    weight: { type: Number, required: true },
    issues: { type: [String], required: true },
    donationHistory: { type: String },
    eligibility: { type: Boolean, default: false, required: true },
});


module.exports = mongoose.model('doner', DonerSchema);