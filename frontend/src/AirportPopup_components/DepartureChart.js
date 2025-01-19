// frontend/src/AirportPopup_components/DepartureChart.js
import React, { useState } from 'react';
import { Box, Button, Dialog, IconButton} from '@mui/material';
import { Line } from 'react-chartjs-2'; // Import Line chart from react-chartjs-2
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon
import 'chart.js/auto'; // Import Chart.js auto to register all components
import { prepareDepartureChartData } from '../utils/departureChartUtils'; // Import the chart utility

const DepartureChart = ({ departureData }) => {
    // Prepare data for the chart using the utility function
    const { labels, dataCounts } = prepareDepartureChartData(departureData);
    const [open, setOpen] = useState(false); // State to manage modal open/close

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box 
            sx={{
                padding: 2,
                marginTop: '10px',
                backgroundColor: '#e3f2fd',
                borderRadius: 1,
                boxShadow: 1,
            }}
        >   
            <Button variant="contained" onClick={handleClickOpen}>
                View Chart
            </Button>
            <Dialog onClose={handleClose} open={open} fullWidth maxWidth="md">
                <Box sx={{ position: 'relative', padding: 2 }}>
                    <IconButton 
                        onClick={handleClose} 
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                <Line 
                    data={{
                        labels,
                        datasets: [{
                            label: 'Number of Departures',
                            data: dataCounts,
                            borderColor: '#ff5722', // Different color for departures
                            backgroundColor: 'rgba(255, 87, 34, 0.5)', // Light version of departure color
                            fill: true,
                            pointRadius: (context) => {
                                return context.dataset.data[context.dataIndex] >= 0 ? 5 : 0; // Show points for all values including zero
                            },
                        }]
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top',
                                labels: {
                                    boxWidth: 20,
                                    fontColor: '#000',
                                },
                            },
                            title: {
                                display: true,
                                text: 'Aircraft Departures Over Time',
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Time (1 unit = 2 hrs)', // Custom X-axis label
                                },
                                ticks: {
                                    autoSkip: true,
                                    maxTicksLimit: 24,
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Number of Departures (1 unit = 2 departures)', // Custom Y-axis label
                                },
                                beginAtZero: true,
                                min: 0,
                                max: Math.max(...dataCounts) + Math.ceil(Math.max(...dataCounts) * 0.1), // Set max to slightly above max count
                            },
                        },
                    }}
                />
                </Box>
            </Dialog>
        </Box>
    );
};

export default DepartureChart;