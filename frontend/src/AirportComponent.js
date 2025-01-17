import React, { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material'; 
import AirportDetails from './AirportPopup_components/AirportDetails';
import ImageCarousel from './AirportPopup_components/ImageCarousel';
import WeatherData from './AirportPopup_components/WeatherData';

const AirportComponent = ({ airport, closePopup }) => {
    const flagUrl = `https://flagcdn.com/w320/${airport.iso_country.toLowerCase()}.png`;
    const [imagesLoaded, setImagesLoaded] = useState(false); // State to track if images are loaded

    return (
        <>
            <AirportDetails airport={airport} flagUrl={flagUrl} /> 
            <ImageCarousel airport = {airport} onImagesLoaded={() => setImagesLoaded(true)}/>
            <Box 
                 sx={{
                     maxHeight: 100,
                     overflowY: 'auto',
                     marginTop: 2,
                     '&::-webkit-scrollbar': { width: 8 },
                     '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: 4 },
                     '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
                     '&::-webkit-scrollbar-track': { backgroundColor: '#f0f0f0' }
                 }}
             >
                 <WeatherData latitude={airport.latitude_deg} longitude={airport.longitude_deg} />
            </Box> 
        </>

    );
};

export default AirportComponent;