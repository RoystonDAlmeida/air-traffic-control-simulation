import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Header from './components/Header';
import Map from './Map';
import BarChart from './components/BarChart';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'; // Import Router components
import Footer from './components/Footer';

const App = () => {
    return (
        <div style={{ backgroundColor: '#333333', minHeight: '100vh' }}>
            <Router>

                <ThemeProvider theme={theme}>
                    <Header />
                </ThemeProvider>

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

            <Box 
                sx={{ 
                    backgroundColor: '#333333', // Set background color to gray
                    paddingTop: '20px', // Leave 20px space from the top    
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start'
                }}
            >
                <BarChart/>
            </Box>
            <Footer/>
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