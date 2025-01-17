// src/Map.js

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { MapContainer, TileLayer, Marker, Tooltip, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import Papa from 'papaparse'; // Used to parse .CSV files
import { debounce } from 'lodash'; // Import lodash for debouncing
import atcIcon from './components/CustomIcon'; // Import custom ATC icon
import { createClusterIcon } from './components/ClusterIcon'; // Import cluster icon function
import './styles/styles.css';
import AirportComponent from './AirportComponent'; // Import AirportComponent for sidebar
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams to access URL parameters
import CustomZoomControl from './components/CustomZoomControl';
import { fetchTrafficData } from './dataResource'; // Import the fetch function
import { calculateTotalFlights, getIntensityColor } from './trafficUtils'; // Import utility functions
import InfoBox from './components/InfoBox'; // InfoBox for air bubble intensity information

// Fix default marker icon issue
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = () => {
    const { latitude, longitude, iataCode } = useParams(); // Get latitude and longitude or IATA code from URL parameters
    const navigate = useNavigate(); // Initialize navigate function
    const [airports, setAirports] = useState([]);
    const [visibleAirports, setVisibleAirports] = useState([]);
    const [selectedAirport, setSelectedAirport] = useState(null); // State to track selected airport for sidebar
    const [loading, setLoading] = useState(false); // Loading state
    const [sidebarOpen, setSidebarOpen] = useState(false); // State to control sidebar visibility

    const [trafficData, setTrafficData] = useState([]); // State for traffic data

    const mapRef = useRef(null); // Create a ref for the map instance

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/airports.csv');
            const csvData = await response.text();
            Papa.parse(csvData, {
                header: true,
                complete: (results) => {
                    // Filter for large airports only and ensure valid coordinates
                    const largeAirports = results.data.filter(airport => 
                        airport.type === "large_airport" && 
                        airport.latitude_deg && 
                        airport.longitude_deg
                    );
                    console.log("Parsed Large Airports:", largeAirports); // Log parsed data

                    setAirports(largeAirports);
                    setVisibleAirports(largeAirports); // Initially show all large airports

                    // If latitude and longitude are provided in the URL, center the map on them
                    if (latitude && longitude) {
                        const lat = parseFloat(latitude);
                        const lng = parseFloat(longitude);
                        if (!isNaN(lat) && !isNaN(lng)) {
                            mapRef.current.setView([lat, lng], 10); // Center map on user location
                        }
                    }
                    
                    // If an IATA code is provided in the URL, find that airport and center the map on it
                    if (iataCode) {
                        const coords = iataCode.split(','); // Split latitude and longitude
                        if (coords.length === 2) {
                            const latitude = parseFloat(coords[0]);
                            const longitude = parseFloat(coords[1]);
                            mapRef.current.setView([latitude, longitude], 10); // Center map on user location
                        } else {
                            const foundAirport = largeAirports.find(a => a.iata_code.toLowerCase() === iataCode.toLowerCase());
                            if (foundAirport) {
                                setSelectedAirport(foundAirport);
                                setSidebarOpen(true);
                                mapRef.current.setView([foundAirport.latitude_deg, foundAirport.longitude_deg], 4); // Center map on selected airport
                            }
                        }
                    }
                }
            });
        };

        fetchData();

        // Fetch air traffic data using the imported function
        const loadTrafficData = async () => {
            try {
                const response = await fetchTrafficData();
                //console.log("Fetched Traffic Data:", response); // Log the fetched data
                if (Array.isArray(response)) { 
                    // Check if response is an array
                    setTrafficData(response); 
                } else {
                    console.error("Fetched traffic data is not in expected format:", response);
                }
            } catch (error) {
                console.error("Failed to load traffic data:", error);
            }
        };

        loadTrafficData();
    }, [latitude, longitude, iataCode]); // Fetch data whenever iataCode changes

    const updateVisibleAirports = useCallback(() => {
        if (mapRef.current) {
            const bounds = mapRef.current.getBounds();
            console.log("Map Bounds:", bounds); // Log current map bounds

            const filteredAirports = airports.filter((airport) => {
                const isInBounds =
                    airport.latitude_deg >= bounds.getSouthWest().lat &&
                    airport.latitude_deg <= bounds.getNorthEast().lat &&
                    airport.longitude_deg >= bounds.getSouthWest().lng &&
                    airport.longitude_deg <= bounds.getNorthEast().lng;

                return isInBounds;
            });

            console.log("Filtered Airports:", filteredAirports); // Log filtered airports
            setVisibleAirports(filteredAirports);
        }
    }, [airports]);

    const handleMarkerClick = (airport) => {
        if (airport) { 
            setLoading(true);
            setSelectedAirport(airport); 
            setSidebarOpen(true); 

            console.log("Selected Airport:", airport);

            if (mapRef.current) {
                mapRef.current.setView([airport.latitude_deg, airport.longitude_deg], 4); // Center and zoom in on selected airport

                navigate(`/airports/${airport.iata_code.toLowerCase()}`); // Change URL to /airports/{iata_code}
            }
        }
    };

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
        setSelectedAirport(null); 
    };

    useEffect(() => {
        const debouncedUpdate = debounce(updateVisibleAirports, 300);

        if (mapRef.current) {
            mapRef.current.on('moveend', debouncedUpdate);
            mapRef.current.on('zoomend', debouncedUpdate);

            return () => {
                mapRef.current.off('moveend', debouncedUpdate);
                mapRef.current.off('zoomend', debouncedUpdate);
            };
        }
    }, [updateVisibleAirports]);

    return (
        <Box 
            sx={{ 
                backgroundColor: 'black', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                height: '100vh', 
                width: '90%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                paddingLeft: '20px',
                paddingRight:'20px',
                border: '5px solid rgba(0, 255, 255, 0.3)', 
            }}
        >
            <MapContainer 
                center={[20, 0]} 
                zoom={3} 
                style={{ 
                    height: '80vh', 
                    width: '100%', 
                    borderRadius: '16px' 
                }}
                ref={mapRef} // Use ref to get the map instance directly
                zoomControl={false} // Disable default zoom controls if needed
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Create a single MarkerClusterGroup for all visible airports */}
                <MarkerClusterGroup showCoverageOnHover={true} iconCreateFunction={(cluster) => createClusterIcon(cluster)}>
                    {visibleAirports.map((airport) => (
                        airport.latitude_deg && airport.longitude_deg ? (
                            <Marker 
                                key={airport.id} // Use a unique identifier for each marker
                                position={[airport.latitude_deg, airport.longitude_deg]}
                                icon={atcIcon}
                                eventHandlers={{
                                    click: () => handleMarkerClick(airport),
                                }}
                            >
                                {/* Tooltip showing airport name and IATA code */}
                                <Tooltip direction="top" offset={[0, 20]} className="custom-tooltip">
                                    <Typography variant="body1" style={{ color: "white", fontWeight:"bold" }}>{airport.name}</Typography>
                                    <Typography variant="body2" style={{ color: "white" }}>{airport.iata_code}/{airport.gps_code}</Typography>
                                </Tooltip>
                            </Marker>
                        ) : null // Skip rendering if coordinates are invalid
                    ))}
                </MarkerClusterGroup>

                {/* Render intensity circles outside of MarkerClusterGroup */}
                {visibleAirports.map((airport) => {
                    const totalFlights = calculateTotalFlights(trafficData, airport.ident); // Calculate total flights for this airport using IATA code
                    // console.log(airport.ident, totalFlights);    Total number of flights per airport dep/arr

                    const circleColor = getIntensityColor(totalFlights); // Determine circle color

                    // Validate latitude and longitude before rendering Circle
                    const circleLat = airport.latitude_deg;
                    const circleLng = airport.longitude_deg;

                    return circleColor !== 'transparent' ? (
                        <Circle 
                            key={`circle-${airport.id}`} 
                            center={[circleLat, circleLng]} 
                            radius={5000} // Adjust radius as needed
                            color={circleColor}
                            fillOpacity={0.5} // Adjust opacity for visibility
                        />
                    ) : null;
                })}

                {/* Render AirportComponent as a sidebar */}
                {sidebarOpen && selectedAirport && (
                    <Box sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '80vh',
                        width: '300px',
                        backgroundColor: 'white',
                        overflowY: 'auto',
                        borderRadius: '8px',
                        boxShadow: 3,
                        zIndex: 1000,
                        padding: 2,
                        margin:'10px',
                    }}>
                        <IconButton onClick={handleCloseSidebar} sx={{ position: 'absolute', right: 10, top: 10 }}>
                            <CloseIcon />
                        </IconButton>
                        <AirportComponent airport={selectedAirport} closePopup={handleCloseSidebar} />
                    </Box>
                )}

                {/* Include custom zoom control */}
                <CustomZoomControl />

                {/* Include InfoBox for air traffic intensity information */}
                <InfoBox />
            </MapContainer>
        </Box>
    );
};

export default Map;