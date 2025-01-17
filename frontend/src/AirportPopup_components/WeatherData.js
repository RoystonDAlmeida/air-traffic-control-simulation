// src/AirportPopup_components/WeatherData.js

import React, { useState } from 'react';
import { Box, Typography, Divider, CircularProgress } from '@mui/material';
import { fetchWeatherData } from '../dataResource';

const WeatherData = ({ latitude, longitude }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch weather data once when the component is rendered
    const loadWeatherData = async () => {
        try {
            const data = await fetchWeatherData(latitude, longitude);
            setWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setError('Failed to fetch weather data');
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    // Call loadWeatherData immediately if data is not loaded
    if (loading && !weatherData) {
        loadWeatherData();
    }

    return (
        <Box 
            sx={{
                backgroundColor: '#d0d0d0',
                padding: '10px',
                borderRadius: '8px',
                marginTop: '50px',
                display: 'flex',
                alignItems: 'stretch',
                minHeight: '100px'
            }}
        >
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography variant="body1" sx={{ color: 'red', textAlign: 'center' }}>
                    {error}
                </Typography>
            ) : (
                <>
                    <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ color: '#333', fontSize: '1rem' }}>
                            CONDITIONS
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#555' }}>
                            {weatherData.conditions || "N/A"}
                        </Typography>
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ height: '100%', borderColor: '#555', borderWidth: 2 }} /> 

                    <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ color: '#333', fontSize: '1rem' }}>
                            TEMPERATURE
                        </Typography>
                        <Typography variant="h6" sx={{
                            color: '#555',
                            borderRadius: '50%',
                            padding: '10px',
                            backgroundColor: '#e0e0e0',
                            display: 'inline-block',
                            fontWeight: 'bold'
                        }}>
                            {weatherData.temperature ? `${Math.round(weatherData.temperature)}°C` : "N/A"}
                        </Typography>
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ height: '100%', borderColor: '#555', borderWidth: 2 }} />

                    <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ color:'#333', fontSize:'1rem' }}>
                            WIND
                        </Typography>
                        <Typography variant="body2" sx={{ color:'#333' }}>
                            {weatherData.wind?.direction}° {(weatherData.wind?.speed * 1.94384).toFixed(1)} kts
                        </Typography>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default WeatherData;