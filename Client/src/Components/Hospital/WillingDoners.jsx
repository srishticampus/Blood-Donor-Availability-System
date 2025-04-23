import React, { useState } from 'react';
import '../../Styles/TableStyle.css'
import {
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Select,
    MenuItem,
    ListItemText,
    FormControl,
    InputLabel
} from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import HosNav from './HosNav';
import HosSidemenu from './HosSidemenu';

function WilligDoners() {
    const bloodGroups = [
        "A Positive (A+)", "A Negative (A-)",
        "B Positive (B+)", "B Negative (B-)",
        "O Positive (O+)", "O Negative (O-)",
        "AB Positive (AB+)", "AB Negative (AB-)"
    ];

    const [openDonatedDialog, setOpenDonatedDialog] = useState(false);
    const [openRejectedDialog, setOpenRejectedDialog] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [donationDetails, setDonationDetails] = useState({
        units: '',
        donationDate: '',
        bloodType: ''
    });

    const hospitalRequests = [
        {
            id: 1,
            name: "John Doe",
            contact: "7025912190",
            DOB: "27/08/1973",
            Gender: "Male",
            Healthstatus: "Healthy"
        },
        {
            id: 2,
            name: "John Doe",
            contact: "7025912190",
            DOB: "27/08/1973",
            Gender: "Male",
            Healthstatus: "Anemic"
        },
        {
            id: 3,
            name: "Sharanya",
            contact: "7025912190",
            DOB: "27/08/1995",
            Gender: "Female",
            Healthstatus: "Anemic"
        },
        {
            id: 4,
            name: "Smith Dony",
            contact: "9447883976",
            DOB: "16/02/1985",
            Gender: "Female",
            Healthstatus: "Recent Doner"
        },
    ];

    const handleDonatedClick = (donor) => {
        setSelectedDonor(donor);
        setOpenDonatedDialog(true);
    };

    const handleRejectedClick = (donor) => {
        setSelectedDonor(donor);
        setOpenRejectedDialog(true);
    };

    const handleDonatedConfirm = () => {
        console.log('Donation confirmed with details:', {
            donorId: selectedDonor.id,
            ...donationDetails
        });
        setOpenDonatedDialog(false);
        setDonationDetails({
            units: '',
            donationDate: '',
            bloodType: ''
        });
    };

    const handleRejectedConfirm = () => {
        console.log(`Rejected: ${selectedDonor.id}`);
        setOpenRejectedDialog(false);
    };

    const handleCloseDialog = () => {
        setOpenDonatedDialog(false);
        setOpenRejectedDialog(false);
        setDonationDetails({
            units: '',
            donationDate: '',
            bloodType: ''
        });
    };

    const handleDonationDetailChange = (e) => {
        const { name, value } = e.target;
        setDonationDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getHealthStatusStyle = (status) => {
        switch (status) {
            case 'Healthy':
                return {
                    color: '#2E7D32',
                    backgroundColor: '#E8FFE9',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    display: 'inline-block'
                };
            case 'Anemic':
                return {
                    color: '#E53935',
                    backgroundColor: '#FFEAEA',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    display: 'inline-block'
                };
            case 'Recent Doner':
                return {
                    color: '#616161',
                    backgroundColor: '#E9E9E9',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    display: 'inline-block'
                };
        }
    };

    return (
        <Box className="main-container">
            <HosNav />
            <Box className="sidemenu">
                <HosSidemenu />
                <Box className="content-box">
                    <Typography variant="h4" className="title">
                        Donor Management
                    </Typography>
                    <Typography variant="h5" className="sub-title">
                        Willing Donors
                    </Typography>
                    <TableContainer className="table-container">
                        <Table aria-label="donor requests table">
                            <TableHead>
                                <TableRow className="table-head-row">
                                    <TableCell className="table-head-cell">Name</TableCell>
                                    <TableCell className="table-head-cell">Contact Number</TableCell>
                                    <TableCell className="table-head-cell">Date of Birth</TableCell>
                                    <TableCell className="table-head-cell">Gender</TableCell>
                                    <TableCell className="table-head-cell">Health Status</TableCell>
                                    <TableCell className="table-head-cell">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {hospitalRequests.map((donor) => (
                                    <TableRow key={donor.id}>
                                        <TableCell className='tableCell'>{donor.name}</TableCell>
                                        <TableCell className='tableCell'>{donor.contact}</TableCell>
                                        <TableCell className='tableCell'>{donor.DOB}</TableCell>
                                        <TableCell className='tableCell'>{donor.Gender}</TableCell>
                                        <TableCell className='tableCell'>
                                            <span style={getHealthStatusStyle(donor.Healthstatus)}>
                                                {donor.Healthstatus}
                                            </span>
                                        </TableCell>
                                        <TableCell className='tableCell' style={{ display: 'flex', gap: '10px' }}>
                                            {donor.Healthstatus === 'Healthy' ? (
                                                <Button
                                                    size='small'
                                                    variant='contained'
                                                    color="success"
                                                    onClick={() => handleDonatedClick(donor)}
                                                >
                                                    Donated
                                                </Button>
                                            ) : (
                                                <Button
                                                    size='small'
                                                    variant='contained'
                                                    color="error"
                                                    onClick={() => handleRejectedClick(donor)}
                                                >
                                                    Rejected
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>

            <Dialog
                open={openDonatedDialog}
                onClose={handleCloseDialog}
                aria-labelledby="donation-dialog-title"
                // maxWidth="xs"
                fullWidth
                PaperProps={{
                    style: { borderRadius: '25px', width: '500px' }
                }}
            >
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography sx={{ width: '150px' }}>
                                Number of Units:
                            </Typography>
                            <TextField
                                name="units"
                                type="number"
                                value={donationDetails.units}
                                onChange={handleDonationDetailChange}
                                style={{ width: '80%' }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography sx={{ width: '150px' }}>
                                Date of Donation:
                            </Typography>
                            <TextField
                                name="donationDate"
                                type="date"
                                value={donationDetails.donationDate}
                                onChange={handleDonationDetailChange}
                                style={{ width: '80%' }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography sx={{ width: '150px' }}>
                                Blood Type:
                            </Typography>
                            <FormControl style={{ width: '80%' }}>
                                <Select
                                    name="bloodType"
                                    value={donationDetails.bloodType}
                                    onChange={handleDonationDetailChange}
                                >
                                    {bloodGroups.map((group) => (
                                        <MenuItem key={group} value={group}>
                                            {group}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        onClick={handleDonatedConfirm}
                        color="primary"
                        variant="contained"
                    >
                        save
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openRejectedDialog}
                onClose={handleCloseDialog}
                aria-labelledby="reject-dialog-title"
                fullWidth
                PaperProps={{
                    style: {
                        borderRadius: '25px',
                        width: '350px',
                        textAlign: 'center'
                    }
                }}
            >
                <DialogTitle id="reject-dialog-title" style={{ textAlign: 'center' }}>
                    Donation Status
                </DialogTitle>
                <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <DialogContentText style={{ marginBottom: '16px', }}>
                        Update status <EmojiEmotionsIcon style={{ color: '#FFD700', fontSize: '2rem', position: 'relative', top: '10px' }} />
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button
                        onClick={handleRejectedConfirm}
                        color="primary"
                        variant="contained"
                        style={{ margin: '0 8px' }}
                    >
                        Update
                    </Button>
                    <Button
                        onClick={handleCloseDialog}
                        style={{ margin: '0 8px' }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default WilligDoners;