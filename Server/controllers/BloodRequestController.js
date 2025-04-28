const BloodRequest = require("../models/HospitalBloodReq"); 
exports.createBloodRequest = async (req, res) => {
  const {
    PatientName,
    ContactNumber,
    BloodType,
    UnitsRequired,
    Status,
    HospitalId,
    UserId
  } = req.body;

  const newRequest = new BloodRequest({
    PatientName,
    ContactNumber,
    BloodType,
    UnitsRequired,
    Status,
    HospitalId,
    UserId
  });
console.log(req.body);

  newRequest.save()
    .then(result => {
      res.status(201).json({
        data: result,
        message: 'Blood request created successfully'
      });
    })
    .catch(error => {
      console.error('Create Blood Request error:', error);

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
        message: 'Something went wrong while creating blood request',
        error: error.message
      });
    });
};

exports.getAllBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find()
      .populate("HospitalId") 
      .populate("UserId"); 
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blood requests", details: error.message });
  }
};

exports.getBloodRequestById = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate("HospitalId")
      .populate("UserId");
    
    if (!request) {
      return res.status(404).json({ error: "Blood request not found" });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blood request", details: error.message });
  }
};

// Update a blood request
exports.updateBloodRequest = async (req, res) => {
  try {
    const updatedRequest = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return updated doc & run schema validators
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "Blood request not found" });
    }
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: "Failed to update blood request", details: error.message });
  }
};

// Delete a blood request
exports.deleteBloodRequest = async (req, res) => {
  try {
    const deletedRequest = await BloodRequest.findByIdAndDelete(req.params.id);
    
    if (!deletedRequest) {
      return res.status(404).json({ error: "Blood request not found" });
    }
    res.status(200).json({ message: "Blood request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete blood request", details: error.message });
  }
};