import React from 'react';
import '../../Styles/BloodRequests.css';
import AdminNav from './AdminNav';
import AdSidemenu from './AdSidemenu';

function BloodRequests() {
    const bloodRequests = [
        {
            id: 1,
            patientName: "John Doe",
            age: 32,
            gender: "Male",
            bloodGroup: "O+",
            unitsRequired: 2,
            contactNumber: "+1 555-123-4567",
            status: "Pending",
            hospitalName: "City General Hospital",
            location: "123 Main St, New York",
            additionalNotes: "Urgent need for surgery",
            requestedOn: "2023-11-15",
            assignedVolunteer: "Sarah Johnson"
        },
        {
            id: 2,
            patientName: "Jane Smith",
            age: 28,
            gender: "Female",
            bloodGroup: "A-",
            unitsRequired: 1,
            contactNumber: "+1 555-987-6543",
            status: "Completed",
            hospitalName: "Metropolitan Medical Center",
            location: "456 Oak Ave, Boston",
            additionalNotes: "",
            requestedOn: "2023-11-10",
            assignedVolunteer: "Michael Brown"
        },
        {
            id: 3,
            patientName: "Robert Chen",
            age: 45,
            gender: "Male",
            bloodGroup: "B+",
            unitsRequired: 3,
            contactNumber: "+1 555-456-7890",
            status: "In Progress",
            hospitalName: "Unity Health Clinic",
            location: "789 Pine Rd, Chicago",
            additionalNotes: "Patient has rare antibodies",
            requestedOn: "2023-11-14",
            assignedVolunteer: "Emily Davis"
        },
        {
            id: 4,
            patientName: "Alice Green",
            age: 36,
            gender: "Female",
            bloodGroup: "AB-",
            unitsRequired: 2,
            contactNumber: "+1 555-654-3210",
            status: "Pending",
            hospitalName: "Hope Medical Center",
            location: "321 Elm St, Seattle",
            additionalNotes: "Requires immediate attention",
            requestedOn: "2023-11-16",
            assignedVolunteer: "David Wilson"
        },
        {
            id: 5,
            patientName: "Mark Taylor",
            age: 50,
            gender: "Male",
            bloodGroup: "O-",
            unitsRequired: 4,
            contactNumber: "+1 555-789-1234",
            status: "Completed",
            hospitalName: "Central Hospital",
            location: "654 Maple Ave, Denver",
            additionalNotes: "",
            requestedOn: "2023-11-12",
            assignedVolunteer: "Laura White"
        },
        {
            id: 6,
            patientName: "Sophia Brown",
            age: 29,
            gender: "Female",
            bloodGroup: "A+",
            unitsRequired: 1,
            contactNumber: "+1 555-321-9876",
            status: "In Progress",
            hospitalName: "Sunrise Clinic",
            location: "987 Cedar Blvd, Miami",
            additionalNotes: "Patient is anemic",
            requestedOn: "2023-11-13",
            assignedVolunteer: "Chris Green"
        },
        {
            id: 7,
            patientName: "James Wilson",
            age: 40,
            gender: "Male",
            bloodGroup: "B-",
            unitsRequired: 2,
            contactNumber: "+1 555-654-7890",
            status: "Pending",
            hospitalName: "Mercy Hospital",
            location: "159 Birch St, Dallas",
            additionalNotes: "Needs blood for surgery",
            requestedOn: "2023-11-17",
            assignedVolunteer: "Anna Lee"
        },
        {
            id: 8,
            patientName: "Emily Davis",
            age: 34,
            gender: "Female",
            bloodGroup: "AB+",
            unitsRequired: 3,
            contactNumber: "+1 555-987-6540",
            status: "Completed",
            hospitalName: "Green Valley Hospital",
            location: "753 Spruce Ln, San Francisco",
            additionalNotes: "",
            requestedOn: "2023-11-09",
            assignedVolunteer: "Tom Harris"
        },
        {
            id: 9,
            patientName: "Daniel Martinez",
            age: 27,
            gender: "Male",
            bloodGroup: "O+",
            unitsRequired: 1,
            contactNumber: "+1 555-123-7896",
            status: "In Progress",
            hospitalName: "Lakeside Medical Center",
            location: "852 Willow Dr, Austin",
            additionalNotes: "Patient is recovering from surgery",
            requestedOn: "2023-11-14",
            assignedVolunteer: "Olivia Brown"
        },
        {
            id: 10,
            patientName: "Laura White",
            age: 38,
            gender: "Female",
            bloodGroup: "A-",
            unitsRequired: 2,
            contactNumber: "+1 555-456-3219",
            status: "Pending",
            hospitalName: "Harmony Health Clinic",
            location: "951 Aspen Rd, Portland",
            additionalNotes: "Urgent requirement",
            requestedOn: "2023-11-18",
            assignedVolunteer: "Ethan Clark"
        }
    ];

    return (
        <div className="blood-requests-container">
            <AdminNav/>
            <AdSidemenu/>
            <h1 className="blood-requests-title">Blood Requests</h1>
            <div className="blood-requests-wrapper">
            <div className="blood-requests-list">
                {bloodRequests.map((request) => (
                    <div key={request.id} className="blood-request-card">
                        <div className="blood-request-header">
                            <div className="request-id">Blood Requests</div>
                        </div>
                        
                        <div className="blood-request-details">
                            <div className="detail-row">
                                <span className="detail-label">Patient Name:</span>
                                <span>{request.patientName}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Age/Gender:</span>
                                <span>{request.age} / {request.gender}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Blood Group:</span>
                                <span className="blood-group">{request.bloodGroup}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Units Required:</span>
                                <span>{request.unitsRequired}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Contact Number:</span>
                                <span>{request.contactNumber}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Hospital Name:</span>
                                <span>{request.hospitalName}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Status:</span>
                                <span className="status-container">
                                    <span className={`status-dot ${request.status.toLowerCase().replace(' ', '-')}`}></span>
                                    {request.status}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Location:</span>
                                <span>{request.location}</span>
                            </div>
                            {request.additionalNotes && (
                                <div className="detail-row">
                                    <span className="detail-label">Additional Notes:</span>
                                    <span>{request.additionalNotes}</span>
                                </div>
                            )}
                            <div className="detail-row">
                                <span className="detail-label">Requested On:</span>
                                <span>{request.requestedOn}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Assigned Volunteer:</span>
                                <span>{request.assignedVolunteer}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
}

export default BloodRequests;