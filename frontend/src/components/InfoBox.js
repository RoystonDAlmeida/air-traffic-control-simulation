import React, { useState } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'; // Flight icon for departure
import FlightLandIcon from '@mui/icons-material/FlightLand'; // Flight icon for arrival
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive'; // Air traffic intensity icon

const InfoBox = () => {
    const [isOpen, setIsOpen] = useState(false); // Set to false for hidden by default

    const toggleInfoBox = (event) => {
        event.stopPropagation(); // Prevent event bubbling
        setIsOpen(!isOpen); // Toggle state
    };

    return (
        <Box sx={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 1000 }}>
            <Button 
                onClick={toggleInfoBox} 
                variant="contained" 
                sx={{ backgroundColor: 'black', borderRadius: '50%', padding: '10px' }}
            >
                <InfoIcon style={{ color: 'white' }} />
            </Button>

            {isOpen && (
                <Box 
                    sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        borderRadius: '8px',
                        padding: '16px',
                        marginTop: '10px',
                        width: '300px',
                        boxShadow: 3,
                        position: 'relative', // For positioning the close button
                        transition: 'transform 0.3s ease', // Smooth transition for expansion
                    }}
                >
                    <IconButton 
                        onClick={toggleInfoBox} 
                        sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }}
                    >
                        <CloseIcon />
                    </IconButton>
                    
                    {/* Heading with illustrative icon */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                        <AirplanemodeActiveIcon sx={{ color: 'white', marginRight: 1 }} />
                        <Typography variant="h6">Air Traffic Intensity</Typography>
                    </Box>

                    <Typography variant="body2">
                        The air traffic intensity bubble is considered as the number of flights departing/arriving before 30 minutes and next 30 minutes of the current UTC time.
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: '10px' }}>
                        Coloring Scale:
                    </Typography>
                    
                    {/* Intensity Boxes */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {/* Green Box */}
                        <Box sx={{
                            backgroundColor: 'green',
                            borderRadius: '8px',
                            padding: '8px',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Typography variant="body2" sx={{ color: 'white' }}>Green: 0-5 flights</Typography>
                            <FlightTakeoffIcon sx={{ color: 'white' }} />
                        </Box>

                        {/* Yellow Box */}
                        <Box sx={{
                            backgroundColor: 'yellow',
                            borderRadius: '8px',
                            padding: '8px',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Typography variant="body2" sx={{ color: 'black' }}>Yellow: 6-11 flights</Typography>
                            <FlightTakeoffIcon sx={{ color: 'black' }} />
                        </Box>

                        {/* Red Box */}
                        <Box sx={{
                            backgroundColor: 'red',
                            borderRadius: '8px',
                            padding: '8px',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Typography variant="body2" sx={{ color: 'white' }}>Red: 12-15 flights</Typography>
                            <FlightLandIcon sx={{ color: 'white' }} />
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default InfoBox;