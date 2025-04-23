const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    ProfilePhoto: { type: Object },
    FullName: { type: String, required: true },
    Email: { type: String, required: true },
    Password: { type: String, required: true },
    PhoneNo: { type: String, required: true },
    Address: { type: String, required: true },
    Pincode: { type: String, required: true },
    District: { type: String, required: true },
    City: { type: String, required: true },
    status: { type: Boolean, default: true },
});


module.exports = mongoose.model('Users', UserSchema);