import React, { useState } from 'react';
import { Box, Button, Dialog, IconButton } from '@mui/material';
import { Line } from 'react-chartjs-2'; // Import Line chart from react-chartjs-2
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon
import 'chart.js/auto'; // Import Chart.js auto to register all components
import { prepareArrivalChartData } from '../utils/arrivalChartUtils'; // Import the chart utility

const ArrivalChart = ({ arrivalData }) => {
    const { labels, dataCounts } = prepareArrivalChartData(arrivalData);
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
                                label: 'Number of Arrivals',
                                data: dataCounts,
                                borderColor: '#3f51b5',
                                backgroundColor: 'rgba(63, 81, 181, 0.5)',
                                fill: true,
                                pointRadius: (context) => {
                                    return context.dataset.data[context.dataIndex] >= 0 ? 5 : 0;
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
                                    text: 'Aircraft Arrivals Over Time',
                                },
                                tooltip: {
                                    enabled: true,
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
                                        text: 'Number of Arrivals (1 unit = 2 arrivals)', // Custom Y-axis label
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

export default ArrivalChart;