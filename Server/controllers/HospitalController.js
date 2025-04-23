const HospitalSchema = require('../models/HospitalModel')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./upload");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage }).fields([
    { name: "ProfilePhoto", maxCount: 1 },
    { name: "Document", maxCount: 1 }
]);

const newRegistration = async (req, res) => {
    try {
        const {
            FullName,
            RegistrationNumber,
            Email,
            Password,
            PhoneNo,
            Address,
            Street,
            City,
            Pincode,
            OpeningTime,
            ClosingTime
        } = req.body;

        const ProfilePhoto = req.files?.ProfilePhoto?.[0] || null;
        const Document = req.files?.Document?.[0] || null;

        const existingEmail = await HospitalSchema.findOne({ Email });
        if (existingEmail) {
            return res.json({ message: 'Email already exists' });
        }

        const existingPhoneNo = await HospitalSchema.findOne({ PhoneNo });
        if (existingPhoneNo) {
            return res.json({ message: 'Phone number already exists' });
        }

        const existingRegNumber = await HospitalSchema.findOne({ RegistrationNumber });
        if (existingRegNumber) {
            return res.json({ message: 'Registration number already exists' });
        }

        const newHospital = new HospitalSchema({
            FullName,
            RegistrationNumber,
            Email,
            Password,
            PhoneNo,
            Address,
            Street,
            City,
            Pincode,
            OpeningTime,
            ClosingTime,
            ProfilePhoto,
            Document
        });

        const result = await newHospital.save();

        res.status(201).json({
            data: result,
            message: 'Registration successful'
        });

    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).json({ 
                message: 'Something went wrong', 
                error: error.message 
            });
        }
    }
};
const FindDoner = (req, res) => {
    RegistrationSchema.findById(req.body.id)
        .then(result => {
            res.status(200).json({
                data: result,
                message: 'Donor found'
            });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Error finding donor', error });
        });
};
const loginHospital = (req, res) => {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    HospitalSchema.findOne({ Email })
        .then(hospital => {
            if (!hospital) {
                return res.json({ message: "Invalid User" });
            }

            if (!hospital.isAdminApprove) {
                return res.json({
                    message: "Account not approved. Please wait for admin approval."
                });
            }

            if (hospital.Password !== Password) {
                return res.json({ message: "Password Mismatch" });
            }

            res.status(200).json({
                message: "Login successful",
                data: hospital
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Something went wrong", error: err });
        });
};
const FindEmail = (req, res) => {
    HospitalSchema.findOne({ Email: req.body.Email })
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: 'The email is Not Found',
                    data: null
                });
            }
            res.status(200).json({
                message: 'Email found',
                data: result
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({
                message: 'Something went wrong',
                error: error.message
            });
        });
};
const ForgotPassword = (req, res) => {
    const { Password } = req.body;
    const { Email } = req.params
    HospitalSchema.findOneAndUpdate(
        { Email: Email },
        { Password: Password },
        { new: true }
    )
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.status(404).json({ message: 'Email not found' });
            }
            res.json({ message: 'Password updated successfully', data: updatedUser });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong' });
        });
};

const ViewAllHospital = (req, res) => {
    HospitalSchema.find()
        .then((result) => {
            res.json({
                data: result
            })
        })
        .catch((error) => {
            console.log(error);

        })
}
const ApproveHospital = (req, res) => {
    const { id } = req.body
    HospitalSchema.findByIdAndUpdate(id, { isAdminApprove: true }, { new: true })
        .then((result) => {
            res.json({
                message: "Hospital Approved",
                data: result
            })
        })
        .catch((error) => {
            console.log(error);

        })
}
const RejectHospital = (req, res) => {
    const { id } = req.body
    HospitalSchema.findByIdAndDelete(id)
        .then((result) => {
            res.json({
                message: "Hospital Rejected",
                data: result
            })
        })
        .catch((error) => {
            console.log(error);

        })
}

const editHospitalProfile = (req, res) => {
    const {
        id,
        FullName,
        RegistrationNumber,
        Email,
        PhoneNo,
        Address,
        Street,
        City,
        Pincode,
        OpeningTime,
        ClosingTime
    } = req.body;

    const updateData = {
        FullName,
        RegistrationNumber,
        Email,
        PhoneNo,
        Address,
        Street,
        City,
        Pincode,
        OpeningTime,
        ClosingTime
    };

    if (req.files?.ProfilePhoto?.[0]) {
        updateData.ProfilePhoto = req.files.ProfilePhoto[0];
    }

    HospitalSchema.findById(id)
        .then(existingHospital => {
            if (!existingHospital) {
                return res.status(404).json({ message: 'Hospital not found' });
            }

            if (Email && Email !== existingHospital.Email) {
                return HospitalSchema.findOne({ Email, _id: { $ne: id } }) 
                    .then(emailExists => {
                        if (emailExists) {
                            throw { status: 409, message: 'Email already exists' };
                        }
                        return existingHospital;
                    });
            }
            return existingHospital;
        })
        .then(existingHospital => {
            if (PhoneNo && PhoneNo !== existingHospital.PhoneNo) {
                return HospitalSchema.findOne({ PhoneNo, _id: { $ne: id } }) 
                    .then(phoneExists => {
                        if (phoneExists) {
                            throw { status: 409, message: 'Phone number already exists' };
                        }
                        return existingHospital;
                    });
            }
            return existingHospital;
        })
        .then(() => {
            return HospitalSchema.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
        })
        .then(updatedHospital => {
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                hospital: updatedHospital
            });
        })
        .catch(error => {
            console.error('Error updating hospital profile:', error);
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error updating hospital profile',
                error: error.message
            });
        });
};
module.exports = {
    editHospitalProfile,
    newRegistration,
    upload,
    FindDoner,
    loginHospital,
    ForgotPassword,
    FindEmail,
    ViewAllHospital,
    ApproveHospital,
    RejectHospital
};