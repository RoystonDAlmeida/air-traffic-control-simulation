// src/AirportPopup_componets/AirportDetails.js

import React from 'react';
import { Typography } from '@mui/material';

const AirportDetails = ({ airport, flagUrl }) => {
    return (
        <div>
            <Typography variant="body1" sx={{ color: 'gray.800', fontWeight: 'bold', margin: '0' }}>
                {airport.name}
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                    src={flagUrl} 
                    alt={`${airport.iso_country} flag`} 
                    style={{ width: '0.75rem', height: '0.75rem', marginRight: '4px' }} 
                />
                <Typography variant="body1" sx={{ color: 'black', fontWeight: 'bold', margin: '0' }}>
                    {airport.iata_code || 'N/A'}/{airport.gps_code || 'N/A'}
                </Typography>
                <Typography variant="subtitle2" sx={{ color:'black', marginLeft: '4px'}}>
                    Elev. {airport.elevation_ft} ft
                </Typography>
            </div>
        </div>
    );
};

export default AirportDetails;