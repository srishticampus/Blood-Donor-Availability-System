import React from 'react';
import { TextField, InputAdornment, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <Box sx={{ width: '350px' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by Name, Contact, Blood Type, Units, Status..."
        value={searchTerm}
        onChange={onSearchChange}
        sx={{
            backgroundColor: '#f5f5f5',
            '& .MuiOutlinedInput-root': {
              borderRadius: '50px',
              height:'50px'
            },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton><SearchIcon color="action" /></IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

export default SearchBar;