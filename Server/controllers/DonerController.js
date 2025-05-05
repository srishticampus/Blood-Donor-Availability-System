const RegistrationSchema = require('../models/DonerModel');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./upload");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'ProfilePhoto' || file.fieldname === 'ConsentForm') {
            cb(null, true);
        } else {
            cb(new Error('Unexpected field'), false);
        }
    }
}).fields([
    { name: 'ProfilePhoto', maxCount: 1 },
    { name: 'ConsentForm', maxCount: 1 }
]);

const newRegistration = (req, res) => {
    const {
        FullName, DateOfBirth, Email, Password, Gender, PhoneNo,
        Pincode, District, AadharNumber, City, bloodgrp, weight,
        issues, donationHistory, eligibility, Category
    } = req.body;

    // Changed from req.file to req.files.ProfilePhoto
    const ProfilePhoto = req.files && req.files['ProfilePhoto'] ? req.files['ProfilePhoto'][0] : null;

    RegistrationSchema.findOne({ Email })
        .then(existingEmail => {
            if (existingEmail) {
                return Promise.reject({ status: 400, message: 'Email already exists' });
            }

            return RegistrationSchema.findOne({ PhoneNo });
        })
        .then(existingPhoneNo => {
            if (existingPhoneNo) {
                return Promise.reject({ status: 400, message: 'Phone number already exists' });
            }

            return RegistrationSchema.findOne({ AadharNumber });
        })
        .then(existingAadhar => {
            if (existingAadhar) {
                return Promise.reject({ status: 400, message: 'Aadhar number already registered' });
            }

            const Registration = new RegistrationSchema({
                ProfilePhoto: ProfilePhoto ? {
                    filename: ProfilePhoto.filename,
                    path: ProfilePhoto.path,
                    mimetype: ProfilePhoto.mimetype,
                    size: ProfilePhoto.size
                } : null,
                FullName,
                DateOfBirth,
                Email,
                Password,
                Gender,
                PhoneNo,
                Pincode,
                District,
                AadharNumber,
                City,
                bloodgrp,
                weight,
                issues,
                donationHistory,
                eligibility,
                Category
            });

            return Registration.save();
        })
        .then(result => {
            res.status(201).json({
                data: result,
                message: 'Registration successful'
            });
        })
        .catch(error => {
            console.error('Registration error:', error);

            if (error.status && error.message) {
                return res.status(error.status).json({ message: error.message });
            }

            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: Object.values(error.errors).map(e => e.message)
                });
            }

            res.status(500).json({
                message: 'Something went wrong',
                error: error.message
            });
        });
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


const FindDonerParams = (req, res) => {
    RegistrationSchema.findById(req.params.id)
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

const DonerLogin = (req, res) => {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    RegistrationSchema.findOne({ Email })
        .then(Doner => {
            if (!Doner) {
                return res.json({ message: "Invalid User" });
            }

            if (Doner.Password !== Password) {
                return res.json({ message: "Password Mismatch" });
            }

            res.status(200).json({
                message: "Login successful",
                data: Doner
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Something went wrong", error: err });
        });
};

const editDonorProfile = (req, res) => {
    const {
        id,
        FullName,
        AadharNumber,
        Email,
        PhoneNo,
        City,
        District,
        Pincode,
        bloodgrp,
        weight,
        eligibility,
        issues,
        vaccinationsTaken,
        medicines,
        SurgicalHistory,
        PregnancyorBreastfeed,
        Allergy
    } = req.body;

    const updateData = {
        FullName,
        AadharNumber,
        Email,
        PhoneNo,
        City,
        District,
        Pincode,
        bloodgrp,
        weight,
        eligibility
    };

    const handleArrayField = (field, fieldName) => {
        if (field && field !== 'undefined') {
            if (typeof field === 'string') {
                updateData[fieldName] = field.split(',').map(item => item.trim());
            } else if (Array.isArray(field)) {
                updateData[fieldName] = field;
            }
        }
    };

    try {
        handleArrayField(issues, 'issues');
        handleArrayField(vaccinationsTaken, 'vaccinationsTaken');
        handleArrayField(medicines, 'medicines');
        handleArrayField(SurgicalHistory, 'SurgicalHistory');
        handleArrayField(Allergy, 'Allergy');
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Error processing array fields'
        });
    }

    if (PregnancyorBreastfeed && PregnancyorBreastfeed !== 'undefined') {
        updateData.PregnancyorBreastfeed = PregnancyorBreastfeed;
    }

    if (req.files) {
        if (req.files['ProfilePhoto']) {
            const file = req.files['ProfilePhoto'][0];
            updateData.ProfilePhoto = {
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype
            };
        }
        if (req.files['ConsentForm']) {
            const file = req.files['ConsentForm'][0];
            updateData.ConsentForm = {
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype
            };
        }
    }

    RegistrationSchema.findById(id)
        .then(existingDonor => {
            if (!existingDonor) {
                return res.status(404).json({
                    success: false,
                    message: 'Donor not found'
                });
            }

            if (Email && Email !== existingDonor.Email) {
                return RegistrationSchema.findOne({ Email, _id: { $ne: id } })
                    .then(emailExists => {
                        if (emailExists) {
                            throw {
                                status: 409,
                                message: 'Email already exists'
                            };
                        }
                        return existingDonor;
                    });
            }
            return existingDonor;
        })
        .then(existingDonor => {
            if (PhoneNo && PhoneNo !== existingDonor.PhoneNo) {
                return RegistrationSchema.findOne({ PhoneNo, _id: { $ne: id } })
                    .then(phoneExists => {
                        if (phoneExists) {
                            throw {
                                status: 409,
                                message: 'Phone number already exists'
                            };
                        }
                        return existingDonor;
                    });
            }
            if (AadharNumber && AadharNumber !== existingDonor.AadharNumber) {
                return RegistrationSchema.findOne({ AadharNumber, _id: { $ne: id } })
                    .then(aadharExists => {
                        if (aadharExists) {
                            throw {
                                status: 409,
                                message: 'Aadhar number already exists'
                            };
                        }
                        return existingDonor;
                    });
            }
            return existingDonor;
        })
        .then(() => {
            return RegistrationSchema.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
        })
        .then(updatedDonor => {
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                donor: updatedDonor
            });
        })
        .catch(error => {
            console.error('Error updating donor profile:', error);
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error updating donor profile',
                error: error.message
            });
        });
};
const ViewAllDonors = (req, res) => {
    RegistrationSchema.find()
        .then(donors => {
            res.status(200).json({
                data: donors,
                message: 'Donors retrieved successfully'
            });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({
                message: 'Error retrieving donors',
                error: error.message
            });
        });
};
const FindEmail = (req, res) => {
    RegistrationSchema.findOne({ Email: req.body.Email })
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
    RegistrationSchema.findOneAndUpdate(
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

const FindOneDoner = (req, res) => {
    const { id } = req.params
    RegistrationSchema.findById(id)

        .then((result) => {
            res.json({
                data: result
            })
        })
        .catch((error) => {
            console.log(error);

        })
}

module.exports = { newRegistration, upload, FindDoner, DonerLogin, editDonorProfile, ViewAllDonors, FindEmail, ForgotPassword, FindOneDoner,FindDonerParams };