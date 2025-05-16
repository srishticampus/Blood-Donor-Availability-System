const UserSchema = require('../models/UserModel');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("ProfilePhoto");

const UserRegistration = async (req, res) => {
  try {
    const {
      FullName, Email, Password, PhoneNo,
      Pincode, District, City, Address
    } = req.body;

    const ProfilePhoto = req.file || null;

    const existingEmail = await UserSchema.findOne({ Email });
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const existingPhoneNo = await UserSchema.findOne({ PhoneNo });
    if (existingPhoneNo) {
      return res.status(409).json({ message: 'Phone number already exists' });
    }

    const Registration = new UserSchema({
      ProfilePhoto,
      FullName,
      Email,
      Password,
      PhoneNo,
      Pincode,
      District,
      City,
      Address
    });

    const result = await Registration.save();

    res.status(201).json({
      data: result,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed',
      error: error.message 
    });
  }
};
const UserLogin = (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  UserSchema.findOne({ Email })
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
const FindEmail = (req, res) => {
  UserSchema.findOne({ Email: req.body.Email })
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
  UserSchema.findOneAndUpdate(
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
const editUserProfile = async (req, res) => {
  try {
    const {
      id,
      FullName,
      Email,
      PhoneNo,
      Address,
      City,
      District,
      Pincode
    } = req.body;

    const updateData = {
      FullName,
      Email,
      PhoneNo,
      Address,
      City,
      District,
      Pincode
    };

    if (req.file) {
      updateData.ProfilePhoto = {
        filename: req.file.filename,
        path: req.file.path.replace(/\\/g, '/'),
        mimetype: req.file.mimetype,
        size: req.file.size,
        originalname: req.file.originalname
      };
    }

    const existingUser = await UserSchema.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (Email && Email !== existingUser.Email) {
      const emailExists = await UserSchema.findOne({
        Email: Email,
        _id: { $ne: id }
      });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    if (PhoneNo && PhoneNo !== existingUser.PhoneNo) {
      const phoneExists = await UserSchema.findOne({
        PhoneNo: PhoneNo,
        _id: { $ne: id }
      });
      if (phoneExists) {
        return res.status(409).json({
          success: false,
          message: 'Phone number already exists'
        });
      }
    }

    const updatedUser = await UserSchema.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
const ViewAllUsers = (req, res) => {
    UserSchema.find()
        .then(donors => {
            res.status(200).json({
                data: donors,
                message: 'Users retrieved successfully'
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

module.exports = { UserRegistration, upload, UserLogin, FindEmail, ForgotPassword ,editUserProfile,ViewAllUsers }