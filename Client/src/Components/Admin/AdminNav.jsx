import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../Assets/logo.png';
import SearchBar from './SearchBar';

function AdminNav({ onSearch }) {
    const location = useLocation();
    const hideSearchBarPaths = [
        '/AdminDashBord',
        '/doner-details/:id',
        '/notifications',
        '/enquiries'
    ];

    // Check if current path matches any of the paths where search bar should be hidden
    const shouldHideSearchBar = hideSearchBarPaths.some(path => {
        // Handle dynamic routes like '/doner-details/:id'
        if (path.includes(':id')) {
            return location.pathname.startsWith(path.split(':id')[0]);
        }
        return location.pathname === path;
    });

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
                    {!shouldHideSearchBar && (
                        <Box>
                            <SearchBar onSearch={onSearch} />
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default AdminNav;