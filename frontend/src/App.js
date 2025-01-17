import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Header from './components/Header';
import Map from './Map';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'; // Import Router components

const App = () => {
    return (
        <div style={{ backgroundColor: '#333333', minHeight: '100vh' }}>
            <ThemeProvider theme={theme}>
                <Header />
            </ThemeProvider>
            <Router>
                <Box 
                    sx={{ 
                        backgroundColor: '#333333', // Set background color to gray
                        paddingTop: '20px', // Leave 20px space from the top    
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start'
                    }}
                >
                    <Routes>
                        <Route path='/' element={<LocationRedirect />} />
                        <Route path='/airports/:latitude,:longitude' element={<Map />} />
                        <Route path='/airports/:iataCode' element={<Map />} />
                    </Routes>
                </Box>
            </Router>
        </div>
    );
};

const LocationRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    navigate(`/airports/${latitude.toFixed(2)},${longitude.toFixed(2)}`); // Redirect to new URL with coordinates
                }, (error) => {
                    console.error("Error retrieving location:", error);
                });
            } else {
                console.error("Geolocation is not supported by this browser.");
            }
        };

        getLocation();
    }, [navigate]);

    return null; // Render nothing while redirecting
};

export default App;
