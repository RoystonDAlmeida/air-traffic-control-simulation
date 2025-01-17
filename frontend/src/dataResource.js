// src/dataResource.js
import axios from "axios";

// Fetch images
export const fetchAirportImages = async (airportName) => {
    const response = await fetch(`http://localhost:3001/api/airport-images?name=${encodeURIComponent(airportName)}`);
    if (!response.ok) {
        throw new Error('Failed to fetch images');
    }
    const data = await response.json();
    return data.images; // Return images directly
};

// Fetch Weather Data function
export const fetchWeatherData = async (latitude, longitude) => {
    const response = await fetch(`http://localhost:3001/api/current-weather?latitude=${latitude}&longitude=${longitude}`);
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    return response.json(); // Return weather data directly
};

// Fetch air-traffic data
export const fetchTrafficData = async () => {
    try {
        const date = new Date();    // This fetches system clock
        const nowUTC = new Date(date.getTime() + (date.getTimezoneOffset()*60000)); // This converts local time to UTC

        // Convert current UTC time to Unix timestamp in seconds
        const currentTimeUTC = Math.floor(nowUTC.getTime() / 1000);

        // Calculate begin and end times based on UTC
        const beginTime = currentTimeUTC - (30 * 60); // 30 minutes before
        const endTime = currentTimeUTC + (30 * 60);   // 30 minutes after

        // Debugging logs to check the calculated times
        // console.log("Current Time in UTC (Unix Timestamp):", currentTimeUTC);
        // console.log("Begin Time (UTC):", beginTime);
        // console.log("End Time (UTC):", endTime);

        // Make request to backend API with correct timestamps
        const response = await axios.get(`http://localhost:3001/api/air-traffic?begin=${beginTime}&end=${endTime}`);
        
        return response.data; // Return the data to be used in the component
    } catch (error) {
        console.error("Error fetching air traffic data:", error);
        throw error; // Throw the error to handle it in the calling component
    }
};