// src/dataResource.js
import axios from "axios";
import { DateTime } from 'luxon';
import tzLookup from 'tz-lookup';   // Get the timezone corresponding to latitude and longitude

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

// Fetch departures data
export const fetchDeparturesData = async(icaoCode, airports) => {
    try{

        // Find the airport data based on ICAO code
        const airport = airports.find(a => a.ident === icaoCode);
        if (!airport) {
            throw new Error(`Airport with ICAO code ${icaoCode} not found.`);
        }

        // Get the timezone for the coordinates 
        const timezone = tzLookup(airport.latitude_deg, airport.longitude_deg);

        // Get the current local date in the airport's timezone
        const currentDate = DateTime.now().setZone(timezone);

        // Set beginTime to midnight (00:00:00) of the current local day in the airport's timezone
        const beginLocalDate = currentDate.startOf('day');

        // Convert beginLocalDate to UTC and get Unix timestamp
        const beginTime = Math.floor(beginLocalDate.toUTC().toSeconds()); // Convert to Unix timestamp in UTC

        // Calculate currentTime in UTC and get Unix timestamp
        const currentTime = Math.floor(currentDate.toUTC().toSeconds()); // Convert to Unix timestamp in UTC

        // Make request to correct URL at the backend
        const response = await axios.get(`http://localhost:3001/api/departures?airport=${icaoCode}&timezone=${timezone}&beginTime=${beginTime}&endTime=${currentTime}`);

        return response.data;
    } catch (error) {
        console.error(`Error fetching ${icaoCode} Departures data:`, error);
        throw error; // Throw the error to handle it in the calling component
    }
}

// Fetch arrival data
export const fetchArrivalsData = async (icaoCode, airports) => {
    try {
        // console.log("Airports:", airports);
        // console.log("Received ICAO code:", icaoCode);

        // Find the airport data based on ICAO code
        const airport = airports.find(a => a.ident === icaoCode);
        if (!airport) {
            throw new Error(`Airport with ICAO code ${icaoCode} not found.`);
        }
        // console.log("Airport matched:", airport);
        
        // Get the timezone for the coordinates 
        const timezone = tzLookup(airport.latitude_deg, airport.longitude_deg);
        // console.log("Timezone:", timezone);

        // Get the current local date in the airport's timezone
        const currentDate = DateTime.now().setZone(timezone);
        // console.log("Current Date:", currentDate.toString());

        // Set beginTime to midnight (00:00:00) of the current local day in the airport's timezone
        const beginLocalDate = currentDate.startOf('day');
        // console.log("Begin Local Date:", beginLocalDate.toString());

        // Convert beginLocalDate to UTC and get Unix timestamp
        const beginTime = Math.floor(beginLocalDate.toUTC().toSeconds()); // Convert to Unix timestamp in UTC
        // console.log("Begin Time (Unix Timestamp):", beginTime); 

        // Calculate currentTime in UTC and get Unix timestamp
        const currentTime = Math.floor(currentDate.toUTC().toSeconds()); // Convert to Unix timestamp in UTC
        // console.log("Current Time (Unix Timestamp):", currentTime); 

        // Make request to correct URL at the backend
        const response = await axios.get(`http://localhost:3001/api/arrivals?airport=${icaoCode}&timezone=${timezone}&beginTime=${beginTime}&endTime=${currentTime}`);
        // console.log("Response:", response.data);
        
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${icaoCode} Arrivals data:`, error);
        throw error; // Throw the error to handle it in the calling component
    }
};

// Fetch live flights data
export const fetchAllFlightsData = async () => {
    try {
        // Make request to OpenSky Network API for all flight states
        const response = await axios.get('http://localhost:3001/api/flights');

        // Check if the response contains valid flight data
        if (!response.data || !response.data.states) {
            throw new Error('Invalid response format from OpenSky API');
        }

        // Return the array of flight states
        return response.data.states; 
    } catch (error) {
        // Log the error and throw a simple message
        console.error('Error fetching flights data:', error.message);
        throw new Error('Failed to fetch flights data');
    }
};