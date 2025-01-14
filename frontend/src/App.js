import React from 'react';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Header from './components/Header';
import Map from './Map';
import TrafficVisualization from './components/TrafficVisualization';
import TrafficDensityChart from './components/TrafficDensityChart';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
    return (
        <div style={{ backgroundColor: '#333333', minHeight: '100vh' }}>
            <ThemeProvider theme={ theme }>
                <Header/>
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
                <Map />
            </Box>
        </div>
    );
};
export default App;