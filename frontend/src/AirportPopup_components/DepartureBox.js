// frontend/src/AirportPopup_components/DepartureBox.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info'; // Import the Info icon
import { fetchDeparturesData } from '../dataResource'; 
import { DateTime } from 'luxon';
import tzLookup from 'tz-lookup'
import DepartureChart from './DepartureChart';

const DepartureBox = ({ airportCode, airports }) => {
    const [departureData, setDepartureData] = useState([]);
    const [departuresCount, setDeparturesCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUTCTime, setCurrentUTCTime] = useState('');
    const [currentBeginTime, setcurrentBeginTime] = useState('');
    const [currentLocalTime, setCurrentLocalTime] = useState('');

    useEffect(() => {
        const loadDeparturesData = async () => {
            try {
                const departures = await fetchDeparturesData(airportCode, airports);
                setDeparturesCount(departures.length);
                setDepartureData(departures); // Store raw departure data for chart preparation
            } catch (error) {
                console.error('Error fetching departure data:', error);
                setError(`No departure data available for ${airportCode}`);
            } finally {
                setLoading(false);
            }
        };

        loadDeparturesData();
        
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
                backgroundColor: '#e3f2fd',
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
                        Departures from {currentBeginTime} to current time: {currentLocalTime}.{' '} 
                        <Typography component="span" variant="body2" style={{ fontWeight: 'bold' }}> 
                            Not all flights are being tracked, as flight uploads take place Batch wise, at midnight.
                        </Typography>. 
                        </React.Fragment> }
                arrow
                sx={{ whiteSpace: 'pre-line' }} // Preserve line breaks
            >
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
                    <Typography variant="h6">Departures</Typography>
                    <Typography variant="body1">{departuresCount} departures</Typography>

                    {/* Render the DepartureChart only if there are departures */}
                    {departuresCount > 0 && (
                        <DepartureChart departureData={departureData} />
                    )}
                </>
            )}
        </Box>
    );
};

export default DepartureBox;