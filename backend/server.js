// server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');   // To allow cross-origin requests
const { DateTime } = require('luxon');

// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware function to log requests
const logRequest = (req, res, next) => {
    console.log(`Request received: ${req.method} ${req.originalUrl}`);
    next(); // Pass control to the next middleware or route handler
};

app.use(cors());    // Enable cors for all routes 
app.use(express.json()); // Middleware to parse JSON bodies
app.use('/api', logRequest); // Use the middleware for all requests starting with '/api'

// Endpoint to fetch real-time air traffic data from OpenSky Network
app.get('/api/air-traffic', async (req, res) => {
    const { begin, end } = req.query; // Get begin and end from query parameters

    try {
        // Construct URL with begin and end parameters
        const response = await axios.get(`${process.env.OPENSKY_API_URL}?begin=${begin}&end=${end}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching air traffic data:", error);
        res.status(500).send('Error fetching air traffic data');
    }
});

// Endpoint to fetch images from Unsplash API
app.get('/api/airport-images', async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Airport name is required' });
    }

    try {
        const response = await axios.get(process.env.UNSPLASH_PHOTOS_URL, {
            params: {
                query: name,
                client_id: process.env.UNSPLASH_ACCESS_KEY,
                per_page: 3 // Limit to 3 images
            },
            timeout:10000,
        });

        if (response.data.results.length > 0) {
            const images = response.data.results.map(photo => photo.urls.small); // Get small-sized image URLs
            res.json({ images });
        } else {
            res.status(404).json({ error: 'No images found' });
        }
    } catch (error) {
        console.error('Error fetching airport images:', error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// Endpoint to fetch current weather based on latitude and longitude
app.get('/api/current-weather', async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        // Fetch weather information based on latitude and longitude
        const weatherResponse = await axios.get(process.env.OPENWEATHERMAP_API_URL, {
            params: {
                lat: latitude,
                lon: longitude,
                appid: process.env.OPENWEATHERMAP_API_KEY,
                units: 'metric', // Use metric units (Celsius)
            },
            timeout: 20000,
        });

        if (weatherResponse.data) {
            const currentWeather = {
                conditions: weatherResponse.data.weather[0].description, // e.g., "clear sky"
                temperature: weatherResponse.data.main.temp, // e.g., 12
                wind: {
                    direction: weatherResponse.data.wind.deg, // Wind direction in degrees
                    speed: weatherResponse.data.wind.speed // Wind speed in meters/sec
                }
            };

            // Format response as needed
            res.json(currentWeather);
        } else {
            res.status(404).json({ error: 'Weather data not found' });
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Endpoint to fetch departures data
app.get('/api/departures', async(req, res) => {
    const { airport, timezone, beginTime, endTime } = req.query;

    if(!airport) {
        return res.status(400).json({error:'Airport ICAO code required'});
    }

    try {
        // Construct URL with icaoCode, beginTime and endTime parameters
        const response = await axios.get(`${process.env.OPENSKY_DEPARTURE_API_URL}?airport=${airport}&begin=${beginTime}&end=${endTime}`);

        // Check if the response data is an empty array
        if (Array.isArray(response.data) && response.data.length === 0) {
            return res.status(404).json({ error: `No Departures found for ICAO code: ${airport}` });
        }

        // Sort response data by 'firstSeen' 
        const sortedData = response.data.sort((a, b) => a.firstSeen - b.firstSeen); 

        // Iterate over the sorted data and display the required statement 
        sortedData.forEach(flight => { 
            const localTime = DateTime.fromSeconds(flight.firstSeen) 
                                        .setZone(timezone) 
                                        .toFormat('MMM dd yyyy, HH:mm'); 
                                        
            console.log(`Flight: ${flight.callsign.trim()}, Departure time: ${localTime}`); 
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error(`Error fetching ${airport} Departure data:`, error);
        res.status(500).send('Error fetching Departure data');
    }
});

// Endpoint to fetch arrivals data
app.get('/api/arrivals', async(req, res) => {
    const { airport, timezone, beginTime, endTime } = req.query;

    if(!airport) {
        return res.status(400).json({error:'Airport ICAO code required'});
    }

    try {
        // Construct URL with icaoCode, beginTime and endTime parameters
        const response = await axios.get(`${process.env.OPENSKY_ARRIVAL_API_URL}?airport=${airport}&begin=${beginTime}&end=${endTime}`);

        // Check if the response data is an empty array
        if (Array.isArray(response.data) && response.data.length === 0) {
            return res.status(404).json({ error: `No arrivals found for ICAO code: ${airport}` });
        }

        // Sort response data by 'lastSeen' 
        const sortedData = response.data.sort((a, b) => a.lastSeen - b.lastSeen); 
        
        // Iterate over the sorted data and display the required statement 
        sortedData.forEach(flight => { 
            const localTime = DateTime.fromSeconds(flight.lastSeen) 
                                        .setZone(timezone) 
                                        .toFormat('MMM dd yyyy, HH:mm'); 
                                        
            // console.log(`Flight: ${flight.callsign.trim()}, Arrival time: ${localTime}`); 
        });

        res.status(200).json(sortedData);
    } catch (error) {
        console.error(`Error fetching ${airport} Arrival data:`, error);
        res.status(500).send('Error fetching Arrival data');
    }
});

// Endpoint to fetch all flights data
app.get('/api/flights', async (req, res) => {
    try {
        const flightsResponse = await axios.get(`${process.env.OPENSKY_FLIGHTS_API_URL}`);
        res.status(200).send(flightsResponse.data); // Return the flight data as JSON
    } catch (error) {
        console.error('Error fetching all flights data:', error);
        res.status(500).send('Error fetching flights data');
    }
});

// Start server
app.listen(PORT, ()=>{
    console.log(`Server is running on Port:${PORT}`);
})