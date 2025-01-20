import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { fetchAllFlightsData } from "../dataResource";
import { countryToAlpha2 } from "country-to-iso";
import { getContinentName } from "@brixtol/country-continent";
import PieChart from "./PieChart";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
    const [flightsData, setFlightsData] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedContinent, setSelectedContinent] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAllFlightsData();

                const continentData = data.reduce((acc, flight) => {
                    const countryCode = countryToAlpha2(flight[2]);
                    if (countryCode) {
                        const continent = getContinentName(countryCode);
                        if (!acc[continent]) {
                            acc[continent] = { total: 0, countries: {} };
                        }
                        acc[continent].total += 1;
                        acc[continent].countries[countryCode] = (acc[continent].countries[countryCode] || 0) + 1;
                    }
                    return acc;
                }, {});

                setFlightsData(continentData);
            } catch (error) {
                console.error("Error processing flight data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const chartData = {
        labels: Object.keys(flightsData),
        datasets: [
            {
                label: "Number of Flights",
                data: Object.values(flightsData).map(c => c.total),
                backgroundColor: "rgba(0, 255, 255, 0.6)",
                borderColor: "rgba(0, 255, 255, 1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Number of Flights",
                    color: "gray",
                    align: "center",
                },
                ticks: { color: "gray" },
                grid: { color: "gray" },
            },
            x: {
                title: {
                    display: true,
                    text: "Continents",
                    color: "gray",
                    align: "center",
                },
                ticks: { color: "gray" },
                grid: { color: "gray" },
            },
        },
        onClick: (_, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                setSelectedContinent(Object.keys(flightsData)[index]);
            }
        },
    };

    if (selectedContinent) {
        return (
            <PieChart 
                continentData={flightsData[selectedContinent]} 
                continentName={selectedContinent}
                onBack={() => setSelectedContinent(null)}
            />
        );
    }

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
            }}
        >
            <Typography 
                variant="h6" 
                color="white" 
                align="center"
                sx={{ marginBottom: '20px' }}
            >
                Live flights being tracked Continent wise
            </Typography>

            {loading ? (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '90%', 
                    width: '100%' 
                }}>
                    <CircularProgress sx={{ color: 'cyan' }} />
                </Box>
            ) : (
                <Box sx={{ 
                    flexGrow: 1, 
                    width: '80%', 
                    height: '90%', 
                    margin: '0 auto' 
                }}>
                    <Bar data={chartData} options={options} />
                </Box>
            )}
        </Box>
    );
};

export default BarChart;