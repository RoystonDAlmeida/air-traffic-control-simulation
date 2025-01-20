// frontend/src/components/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box 
            sx={{ 
                backgroundColor: 'black', // Changed to black
                color: 'white', 
                padding: '20px', 
                textAlign: 'center',
                position: 'relative',
                bottom: 0,
                width: '100%',
                marginTop:'20px',
                paddingLeft: 0, // Remove left padding
                paddingRight: 0, // Remove right padding
            }}
        >
            <Typography variant="body2">
                © {new Date().getFullYear()} By Royston DAlmeida
            </Typography>
        </Box>
    );
};

export default Footer;