const BloodRequest = require("../models/HospitalBloodReq");
const Donor = require('../models/DonerModel');

exports.createBloodRequest = (req, res) => {
  const {
    PatientName,
    ContactNumber,
    BloodType,
    UnitsRequired,
    Status,
    HospitalId,
    USERID,
    specialization,
    doctorName,
    Date,
    Time
  } = req.body;

  const newRequest = new BloodRequest({
    PatientName,
    ContactNumber,
    BloodType,
    UnitsRequired,
    Status,
    HospitalId,
    USERID,
    Date,
    specialization,
    doctorName,
    Time
  });

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

exports.getAllBloodRequests = (req, res) => {
  BloodRequest.find()
    .populate({
      path: "AcceptedBy",
      model: "Hospital"
    })
    .populate("USERID")
    .populate("HospitalId")

    .populate({
      path: "RejectedBy.hospitalId",
      model: "Hospital"
    })
    .populate({
      path: "AcceptedByDoner.donerId",
      model: "doner"
    })
    .populate({
      path: "RejectedByDoner.donerId",
      model: "doner"
    })
    .then(requests => {
      console.log(requests);
      res.status(200).json(requests);
    })
    .catch(error => {
      res.status(500).json({
        error: "Failed to fetch blood requests",
        details: error.message
      });
    });
};
exports.getHospitalBloodRequests = (req, res) => {
  const hospitalId = req.params.hospitalId;

  if (!hospitalId) {
    return res.status(400).json({
      error: "Hospital ID is required"
    });
  }

  BloodRequest.find({ HospitalId: hospitalId })
    .populate("HospitalId")
    .populate("USERID")
    .populate({
      path: "AcceptedByDoner.donerId",
      model: "doner"
    })
    .populate({
      path: "AcceptedBy",
      model: "Hospital"
    })

    .then(requests => {
      if (!requests || requests.length === 0) {
        return res.status(404).json({
          message: "No blood requests found for this hospital"
        });
      }
      res.status(200).json(requests);
    })
    .catch(error => {
      res.status(500).json({
        error: "Failed to fetch hospital blood requests",
        details: error.message
      });
    });
};
exports.getUserBloodRequests = (req, res) => {
  const USERID = req.params.USERID;

  if (!USERID) {
    return res.status(400).json({
      error: "User ID is required"
    });
  }

  BloodRequest.find({ USERID: USERID })

    .populate("HospitalId")
    .populate("USERID")
    .populate({
      path: "AcceptedByDoner.donerId",
      model: "doner"
    })
    .populate({
      path: "AcceptedBy",
      model: "Hospital"
    })
    .then(requests => {
      if (!requests || requests.length === 0) {
        return res.status(404).json({
          message: "No blood requests found for this User"
        });
      }
      res.status(200).json(requests);
    })
    .catch(error => {
      res.status(500).json({
        error: "Failed to fetch hospital blood requests",
        details: error.message
      });
    });
};
exports.getBloodRequestById = (req, res) => {
  BloodRequest.findById(req.params.id)
    .populate("HospitalId")
    .then(request => {
      if (!request) {
        return res.status(404).json({
          error: "Blood request not found"
        });
      }
      res.status(200).json(request);
    })
    .catch(error => {
      res.status(500).json({
        error: "Failed to fetch blood request",
        details: error.message
      });
    });
};

exports.updateBloodRequest = (req, res) => {
  BloodRequest.findByIdAndUpdate(
    req.params._id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
    .then(updatedRequest => {
      if (!updatedRequest) {
        return res.status(404).json({
          error: "Blood request not found"
        });
      }
      res.status(200).json(updatedRequest);
    })
    .catch(error => {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          message: 'Validation failed',
          errors: Object.values(error.errors).map(e => e.message)
        });
      }
      res.status(500).json({
        error: "Failed to update blood request",
        details: error.message
      });
    });
};

exports.deleteBloodRequest = (req, res) => {
  BloodRequest.findByIdAndDelete(req.params.id)
    .then(deletedRequest => {
      if (!deletedRequest) {
        return res.status(404).json({
          error: "Blood request not found"
        });
      }
      res.status(200).json({
        message: "Blood request deleted successfully"
      });
    })
    .catch(error => {
      res.status(500).json({
        error: "Failed to delete blood request",
        details: error.message
      });
    });
};

exports.approveBloodRequest = (req, res) => {
  const { id } = req.params;
  const { hospitalId } = req.body;

  BloodRequest.findById(id)
    .then((request) => {
      if (!request) {
        return res.status(404).json({
          error: "Blood request not found"
        });
      }

      return BloodRequest.findByIdAndUpdate(
        id,
        {
          IsHospital: "Approved",
          AcceptedBy: hospitalId,
          HospitalApprovedAt: new Date()
        },
        { new: true, runValidators: true }
      );
    })
    .then((updatedRequest) => {
      if (!updatedRequest) {
        return res.status(404).json({
          error: "Blood request not found after update"
        });
      }

      res.status(200).json({
        message: "Blood request approved successfully",
        data: updatedRequest
      });
    })
    .catch((error) => {
      console.error('Approve Blood Request error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          error: "Failed to approve blood request",
          details: error.message
        });
      }
    });
};
exports.rejectBloodRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, hospitalId } = req.body;

    const request = await BloodRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        error: "Blood request not found"
      });
    }

    const alreadyRejected = request.RejectedBy.some(
      rejection => rejection.hospitalId && rejection.hospitalId.toString() === hospitalId
    );

    if (alreadyRejected) {
      return res.status(400).json({
        error: "This hospital has already rejected this request"
      });
    }

    const newRejection = {
      hospitalId: hospitalId,
      reason: reason
    };

    const updatedRequest = await BloodRequest.findByIdAndUpdate(
      id,
      {
        $push: { RejectedBy: newRejection },
        IsHospital: "Rejected",
      },
      { new: true, runValidators: true }
    ).populate({
      path: 'HospitalId RejectedBy.hospitalId',
      select: 'name address'
    }).lean();

    const responseData = {
      ...updatedRequest,
      RejectedBy: updatedRequest.RejectedBy.map(rejection => ({
        ...rejection,
        hospitalId: rejection.hospitalId ? {
          _id: rejection.hospitalId._id,
          name: rejection.hospitalId.name
        } : null
      }))
    };

    res.status(200).json({
      message: "Blood request rejected successfully",
      data: responseData
    });
  } catch (error) {
    console.error('Reject Blood Request error:', error);
    res.status(500).json({
      error: "Failed to reject blood request",
      details: error.message
    });
  }
};
exports.approveBloodRequestByDoner = async (req, res) => {
  try {
    const { id } = req.params;
    const { DonerId } = req.body;

    if (!DonerId) {
      return res.status(400).json({ error: "Donor ID is required" });
    }

    await BloodRequest.updateOne(
      { _id: id, AcceptedByDoner: null },
      { $set: { AcceptedByDoner: [] } }
    );

    const existingAcceptance = await BloodRequest.findOne({
      _id: id,
      "AcceptedByDoner.donerId": DonerId
    });

    if (existingAcceptance) {
      return res.status(400).json({ error: "This donor has already accepted this request" });
    }

    const updateResult = await BloodRequest.findByIdAndUpdate(
      id,
      {
        $push: {
          AcceptedByDoner: {
            donerId: DonerId,
            donationStatus: "Accepted",
            AccepteddAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!updateResult) {
      return res.status(404).json({ error: "Blood request not found" });
    }

    const currentCount = updateResult.AcceptedByDoner.length;
    const requiredUnits = updateResult.UnitsRequired;

    if (currentCount >= requiredUnits) {
      const fulfilledUpdate = await BloodRequest.findByIdAndUpdate(
        id,
        { 
          IsDoner: "Fulfilled",
          DonerFulfilledAt: new Date() // Set the fulfillment date
        },
        { new: true }
      );
      updateResult.IsDoner = "Fulfilled";
      updateResult.DonerFulfilledAt = fulfilledUpdate.DonerFulfilledAt;
    }

    res.status(200).json({
      message: "Donor acceptance recorded",
      data: updateResult,
      status: currentCount >= requiredUnits
        ? "Fully fulfilled"
        : `Pending (${currentCount}/${requiredUnits})`
    });

  } catch (error) {
    console.error('Approve Blood Request error:', error);
    res.status(500).json({
      error: "Failed to approve blood request",
      details: error.message
    });
  }
};
exports.donerrejectBloodRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { donerId } = req.body;

    const request = await BloodRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        error: "Blood request not found"
      });
    }

    const alreadyRejected = request.RejectedByDoner.some(
      rejection => rejection.donerId && rejection.donerId.toString() === donerId
    );

    if (alreadyRejected) {
      return res.status(400).json({
        error: "This donor has already rejected this request"
      });
    }

    const newRejection = {
      donerId: donerId,
      rejectedAt: new Date()
    };

    const updatedRequest = await BloodRequest.findByIdAndUpdate(
      id,
      {
        $push: { RejectedByDoner: newRejection },
        // IsDoner: "Rejected",
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Blood request rejected by donor successfully",
      data: updatedRequest
    });
  } catch (error) {
    console.error('Donor Reject Blood Request error:', error);
    res.status(500).json({
      error: "Failed to reject blood request by donor",
      details: error.message
    });
  }
};
exports.deletingBloodRequest = (req, res) => {
  const { id } = req.params;
  const { hospitalId, DeletedReason } = req.body;

  BloodRequest.findById(id)
    .then((request) => {
      if (!request) {
        return res.status(404).json({
          error: "Blood request not found"
        });
      }

      return BloodRequest.findByIdAndUpdate(
        id,
        {
          IsHospital: "Deleted",
          DeletedBy: hospitalId,
          DeletedReason: DeletedReason
        },
        { new: true, runValidators: true }
      );
    })
    .then((updatedRequest) => {
      if (!updatedRequest) {
        return res.status(404).json({
          error: "Blood request not found after update"
        });
      }

      res.status(200).json({
        message: "Blood request Deleted successfully",
        data: updatedRequest
      });
    })
    .catch((error) => {
      console.error('Approve Blood Request error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          error: "Failed to approve blood request",
          details: error.message
        });
      }
    });
};
exports.FullFillBloodRequest = async (req, res) => {
  const { id } = req.params;
  const { DonerId } = req.body;

  try {
    const request = await BloodRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: "Blood request not found" });
    }

    const donorAcceptance = request.AcceptedByDoner.find(
      a => a.donerId._id.toString() === DonerId
    );

    if (!donorAcceptance) {
      return res.status(400).json({ error: "You haven't accepted this request" });
    }

    donorAcceptance.donationStatus = "Fulfilled";
    donorAcceptance.AccepteddAt = new Date();

    const donor = await Donor.findById(DonerId);
    if (donor) {
      if (!donor.donationHistory) {
        donor.donationHistory = [];
      }
      
      donor.donationHistory.push(new Date());
      await donor.save();
    }

    const fulfilledCount = request.AcceptedByDoner.filter(
      d => d.donationStatus === "Fulfilled"
    ).length;

    if (fulfilledCount >= request.UnitsRequired) {
      request.IsDoner = "Fulfilled";
    }

    await request.save();

    res.status(200).json({
      message: "Donation marked as fulfilled",
      data: request
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Failed to update donation status" });
  }
};// exports.donercancelBloodRequest = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { donerId } = req.body;

//     const request = await BloodRequest.findById(id);
//     if (!request) {
//       return res.status(404).json({
//         error: "Blood request not found"
//       });
//     }

//     const alreadyRejected = request.RejectedByDoner.some(
//       rejection => rejection.donerId && rejection.donerId.toString() === donerId
//     );

//     if (alreadyRejected) {
//       return res.status(400).json({
//         error: "This donor has already rejected this request"
//       });
//     }

//     const newRejection = {
//       donerId: donerId,
//       rejectedAt: new Date()
//     };

//     const updatedRequest = await BloodRequest.findByIdAndUpdate(
//       id,
//       {
//         $push: { RejectedByDoner: newRejection },
//         IsDoner: "Rejected",
//       },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       message: "Blood request rejected by donor successfully",
//       data: updatedRequest
//     });
//   } catch (error) {
//     console.error('Donor Reject Blood Request error:', error);
//     res.status(500).json({
//       error: "Failed to reject blood request by donor",
//       details: error.message
//     });
//   }
// };
exports.donercancelBloodRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { donerId } = req.body;

    const request = await BloodRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        error: "Blood request not found"
      });
    }

    // Check if donor has already rejected this request
    const alreadyRejected = request.RejectedByDoner.some(
      rejection => rejection.donerId && rejection.donerId.toString() === donerId
    );

    if (alreadyRejected) {
      return res.status(400).json({
        error: "This donor has already rejected this request"
      });
    }

    // Check if donor exists in AcceptedByDoner
    const donorInAccepted = request.AcceptedByDoner.find(
      donor => donor.donerId && donor.donerId._id.toString() === donerId
    );

    if (!donorInAccepted) {
      return res.status(400).json({
        error: "This donor hasn't accepted this request"
      });
    }

    // Create new rejection record
    const newRejection = {
      donerId: donerId,
      rejectedAt: new Date()
    };

    // Update the request in one atomic operation
    const updatedRequest = await BloodRequest.findByIdAndUpdate(
      id,
      {
        $pull: { 
          AcceptedByDoner: { 
            "donerId": donerId 
          } 
        },
        $push: { RejectedByDoner: newRejection },
        $set: { 
          IsDoner: request.AcceptedByDoner.length <= 1 ? "Rejected" : request.IsDoner 
        }
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Blood request rejected by donor successfully",
      data: updatedRequest
    });
  } catch (error) {
    console.error('Donor Reject Blood Request error:', error);
    res.status(500).json({
      error: "Failed to reject blood request by donor",
      details: error.message
    });
  }
};

// Notification Controller

// For Admin marking as read
exports.markAsReadByAdmin = async (req, res) => {
  try {
      const { requestId } = req.params;
      const updatedRequest = await BloodRequest.findByIdAndUpdate(
          requestId,
          { ReadbyAdmin: "Readed" },
          { new: true }
      );
      res.status(200).json(updatedRequest);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// For User marking as read
exports.markAsReadByUser = async (req, res) => {
  try {
      const { requestId } = req.params;
      const updatedRequest = await BloodRequest.findByIdAndUpdate(
          requestId,
          { ReadbyUser: "Readed" },
          { new: true }
      );
      res.status(200).json(updatedRequest);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// For Donor marking as read
exports.markAsReadByDoner = async (req, res) => {
  try {
      const { requestId } = req.params;
      const updatedRequest = await BloodRequest.findByIdAndUpdate(
          requestId,
          { ReadbyDoner: "Readed" },
          { new: true }
      );
      res.status(200).json(updatedRequest);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};