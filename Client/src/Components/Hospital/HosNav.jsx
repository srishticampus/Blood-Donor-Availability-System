import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import Logo from '../../Assets/logo.png';
import SearchBar from './SearchBar';

function HosNav({ searchTerm, onSearchChange }) {
    return (
        <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'black', boxShadow: 1 }}>
            <Container maxWidth="xl" sx={{ px: 2, maxWidth: '1200px' }}>
                <Toolbar disableGutters sx={{
                    minHeight: { xs: 60, md: 80 },
                    px: 0,
                    width: '100%',
                    justifyContent: 'space-between'
                }}>
                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none'
                        }}
                    >
                        <Box
                            component="img"
                            src={Logo}
                            alt="Logo"
                            sx={{
                                height: { xs: 30, md: 50 },
                            }}
                        />
                    </Box>
                    <Box>
                        <SearchBar 
                            searchTerm={searchTerm} 
                            onSearchChange={onSearchChange} 
                        />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default HosNav;