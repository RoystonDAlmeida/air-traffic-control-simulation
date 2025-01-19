import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info'; // Import the Info icon
import { fetchArrivalsData } from '../dataResource'; 
import ArrivalChart from './ArrivalChart'; // Import the new ArrivalChart component
import { DateTime } from 'luxon';
import tzLookup from 'tz-lookup'

const ArrivalBox = ({ airportCode, airports }) => {
    const [arrivalData, setArrivalData] = useState([]);
    const [arrivalsCount, setArrivalsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentBeginTime, setcurrentBeginTime] = useState('');
    const [currentLocalTime, setCurrentLocalTime] = useState('');

    useEffect(() => {
        const loadArrivalsData = async () => {
            try {
                const arrivals = await fetchArrivalsData(airportCode, airports);
                setArrivalsCount(arrivals.length);
                setArrivalData(arrivals); // Store raw arrival data for chart preparation
            } catch (error) {
                console.error('Error fetching arrival data:', error);
                setError(`No arrival data available for ${airportCode}`);
            } finally {
                setLoading(false);
            }
        };

        loadArrivalsData();
        
        // Calculate and set current Begin and Local times
        const calculateCurrentandBeginTimes = () => {
            // Find the airport data based on ICAO code
            const airport = airports.find(a => a.ident === airportCode);

            // Get the timezone for the coordinates 
            const timezone = tzLookup(airport.latitude_deg, airport.longitude_deg);

            // Get the current local date in the airport's timezone
            const currentDate = DateTime.now().setZone(timezone);
            setCurrentLocalTime(currentDate.toFormat('cccc, LLLL dd yyyy, HH:mm').toString());

            // Set beginTime to midnight (00:00:00) of the current local day in the airport's timezone
            const beginLocalDate = currentDate.startOf('day');
            setcurrentBeginTime(beginLocalDate.toFormat('cccc, LLLL dd yyyy, HH:mm').toString());
        };

        calculateCurrentandBeginTimes();
    }, [airportCode, airports]);

    return (
        <Box 
            sx={{
                padding: 2,
                marginTop: '10px',
                backgroundColor: '#ffe0b2',
                borderRadius: 1,
                boxShadow: 1,
                transition: '0.3s',
                position: 'relative', // Position relative for tooltip placement
                '&:hover': {
                    boxShadow: 3,
                    transform: 'scale(1.02)',
                }
            }}
        >
            <Tooltip 
                title={ <React.Fragment> 
                        Arrivals from {currentBeginTime} to current time: {currentLocalTime}.{' '} 
                        <Typography component="span" variant="body2" style={{ fontWeight: 'bold' }}> 
                            Not all flights are being tracked, as flight uploads take place Batch wise, at midnight.
                        </Typography>. 
                        </React.Fragment> } >
                <IconButton 
                    sx={{
                        position: 'absolute', // Position the icon at the top right corner
                        top: 8,
                        right: 8,
                        padding: 0,
                    }}
                    size="small"
                >
                    <InfoIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography variant="body1" sx={{ color: 'red', textAlign: 'center' }}>
                    {error}
                </Typography>
            ) : (
                <>
                    <Typography variant="h6">Arrivals</Typography>
                    <Typography variant="body1">{arrivalsCount} arrivals</Typography>

                    {/* Render the ArrivalChart only if there are arrivals */}
                    {arrivalsCount > 0 && (
                        <ArrivalChart arrivalData={arrivalData} />
                    )}
                </>
            )}
        </Box>
    );
};

export default ArrivalBox;