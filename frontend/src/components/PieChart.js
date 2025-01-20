import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import countries from "i18n-iso-countries";

// Register English locale for country names
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ continentData, continentName, onBack }) => {
    const topCountries = Object.entries(continentData.countries)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const otherCount = continentData.total - topCountries.reduce((sum, [_, count]) => sum + count, 0);

    const data = {
        labels: [
            ...topCountries.map(([code]) => `${code} (${countries.getName(code, 'en')})`), 
            `Others (${otherCount})`
        ],
        datasets: [
            {
                data: [...topCountries.map(([_, count]) => count), otherCount],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: 'white',
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.label}: ${context.parsed}`,
                },
            },
        },
    };

    return (
        <Box 
            sx={{ 
                backgroundColor: 'black', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                height: '80vh', 
                width: '90%', 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', 
                padding: '20px',
                border: '5px solid rgba(0, 255, 255, 0.3)', 
                position: 'relative',
            }}
        >
            <Typography 
                variant="h6" 
                color="white" 
                align="center"
                sx={{ marginBottom: '5px' }}
            >
                Top 5 Countries in Continent: {continentName}
            </Typography>
            <Typography 
                variant="subtitle1" 
                color="white" 
                align="center"
                sx={{ fontWeight: 'bold', marginBottom: '20px' }}
            >
                Total number of flights: {continentData.total}
            </Typography>
            <Box sx={{ 
                flexGrow: 1,
                width: '80%', // Adjusted width for centering
                height: '90%', 
                marginLeft: 'auto', // Centering adjustments
                marginRight: 'auto'
            }}>
                <Pie data={data} options={options} />
            </Box>
            <Button 
                onClick={onBack}
                sx={{ 
                    position: 'absolute', 
                    top: '10px', 
                    left: '10px', // Back button positioned at the top left corner
                    color: 'white',
                    borderColor: 'white',
                }}
                variant="outlined"
            >
                Back
            </Button>
        </Box>
    );
};

export default PieChart;