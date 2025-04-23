import React from 'react';
import AdminNav from './AdminNav';
import AdSidemenu from './AdSidemenu';
import '../../Styles/TableStyle.css';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button,
  Box,
  Typography
} from '@mui/material';

function UserEnquiry() {
  const userEnquiries = [
    {
      id: 1,
      userEmail: "john.doe@example.com",
      enquiryPreview: "Question about blood donation eligibility...",
      date: "2023-05-15",
      status: "Unread"
    },
    {
      id: 2,
      userEmail: "jane.smith@example.com",
      enquiryPreview: "Need information about plasma donation...",
      date: "2023-05-16",
      status: "Read"
    },
    {
      id: 3,
      userEmail: "alice.brown@example.com",
      enquiryPreview: "How often can I donate platelets?",
      date: "2023-05-17",
      status: "Responded"
    },
    {
      id: 4,
      userEmail: "charlie.green@example.com",
      enquiryPreview: "Request for blood type compatibility info...",
      date: "2023-05-18",
      status: "Unread"
    },
    {
      id: 5,
      userEmail: "eve.white@example.com",
      enquiryPreview: "Question about donation center hours...",
      date: "2023-05-19",
      status: "Read"
    },
    {
      id: 6,
      userEmail: "frank.black@example.com",
      enquiryPreview: "Need urgent information about rare blood types",
      date: "2023-05-20",
      status: "Responded"
    },
    {
      id: 7,
      userEmail: "grace.blue@example.com",
      enquiryPreview: "Inquiry about donor rewards program...",
      date: "2023-05-21",
      status: "Unread"
    },
    {
      id: 8,
      userEmail: "henry.yellow@example.com",
      enquiryPreview: "Question about post-donation care...",
      date: "2023-05-22",
      status: "Read"
    },
    {
      id: 9,
      userEmail: "ivy.red@example.com",
      enquiryPreview: "Request for information about blood drives...",
      date: "2023-05-23",
      status: "Responded"
    },
    {
      id: 10,
      userEmail: "jack.purple@example.com",
      enquiryPreview: "Need clarification on donor requirements...",
      date: "2023-05-24",
      status: "Unread"
    }
  ];

  const getStatusIndicator = (status) => {
    if (status === "Unread") {
      return <span className="status-indicator status-unread"></span>;
    } else if (status === "Read") {
      return <span className="status-indicator status-read"></span>;
    } else if (status === "Responded") {
      return <span className="status-indicator status-responded"></span>;
    }
  };


  return (
    <Box className="main-container">
      <AdSidemenu />
      <Box className="sidemenu">
        <AdminNav />
        <Box className="content-box">
          <Typography variant="h4" className="title">
            User Enquiries
          </Typography>
          <TableContainer component={Paper} className="table-container">
            <Table aria-label="user enquiries table">
              <TableHead>
                <TableRow className="table-head-row">
                  <TableCell className="table-head-cell">User Email</TableCell>
                  <TableCell className="table-head-cell">Enquiry Preview</TableCell>
                  <TableCell className="table-head-cell">Date</TableCell>
                  <TableCell className="table-head-cell">Status</TableCell>
                  <TableCell className="table-head-cell">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userEnquiries.map((enquiry) => (
                  <TableRow key={enquiry.id} hover>
                    <TableCell className="tableCell">{enquiry.userEmail}</TableCell>
                    <TableCell className="tableCell">{enquiry.enquiryPreview}</TableCell>
                    <TableCell className="tableCell">{enquiry.date}</TableCell>
                    <TableCell className="tableCell">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {getStatusIndicator(enquiry.status)}
                          {enquiry.status}
                      </Box>
                    </TableCell>
                    <TableCell className="tableCell">
                      <Link to={`/enquiry-details/${enquiry.id}`}>
                      View Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default UserEnquiry;