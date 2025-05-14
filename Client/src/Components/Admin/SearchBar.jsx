import React from 'react';
import { TextField, InputAdornment, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar({ onSearch, placeholder }) {
  return (
    <Box sx={{ width: '350px' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder || "Search..."} 
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
        onChange={(e) => onSearch(e.target.value)}
      />
    </Box>
  );
}

export default SearchBar;