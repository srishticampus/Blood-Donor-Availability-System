import React from 'react';
import { TextField, InputAdornment, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function DonerSearchBar({ searchTerm, onSearchChange }) {
  return (
    <Box sx={{ width: '350px' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
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
              <IconButton>
                <SearchIcon color="action" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

export default DonerSearchBar;