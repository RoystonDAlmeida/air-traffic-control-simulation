// src/components/CustomZoomControl.js

import React from 'react';
import { useMap } from 'react-leaflet';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const CustomZoomControl = () => {
    const map = useMap();

    const handleZoomIn = () => {
        map.zoomIn();
    };

    const handleZoomOut = () => {
        map.zoomOut();
    };

    return (
        <Box sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            display: 'flex',
            flexDirection: 'column', // Stack buttons vertically
            gap: '10px', // 10px gap between buttons
            zIndex: 1000,
        }}>
            <IconButton 
                onClick={handleZoomIn} 
                size="large" 
                sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    borderRadius: '50%', // Make it circular
                    width: '40px', // Set width
                    height: '40px', // Set height
                    '&:hover': {
                        backgroundColor: '#333333', // Darker on hover
                    },
                }}
            >
                <AddIcon />
            </IconButton>
            <IconButton 
                onClick={handleZoomOut} 
                size="large" 
                sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    borderRadius: '50%', // Make it circular
                    width: '40px', // Set width
                    height: '40px', // Set height
                    '&:hover': {
                        backgroundColor: '#333333', // Darker on hover
                    },
                }}
            >
                <RemoveIcon />
            </IconButton>
        </Box>
    );
};

export default CustomZoomControl;