// src/Map.js
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import Papa from 'papaparse'; // Used to parse .CSV files
import { debounce } from 'lodash'; // Import lodash for debouncing
import atcIcon from './components/CustomIcon'; // Import custom ATC icon
import { createClusterIcon } from './components/ClusterIcon'; // Import cluster icon function
import './styles/styles.css';

// Fix default marker icon issue
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = () => {
    const [airports, setAirports] = useState([]);
    const [visibleAirports, setVisibleAirports] = useState([]);
    const mapRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/airports.csv');
            const csvData = await response.text();
            Papa.parse(csvData, {
                header: true,
                complete: (results) => {
                    // Filter for large airports only
                    const largeAirports = results.data.filter(airport => airport.type === "large_airport");
                    console.log("Parsed Large Airports:", largeAirports); // Log parsed data

                    setAirports(largeAirports);
                    setVisibleAirports(largeAirports); // Initially show all large airports
                }
            });
        };

        fetchData();
    }, []);

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
                whenCreated={(mapInstance) => { mapRef.current = mapInstance; }} // Use whenCreated to get the map instance
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Create a single MarkerClusterGroup for all visible airports */}
                <MarkerClusterGroup showCoverageOnHover={true} iconCreateFunction={(cluster) => createClusterIcon(cluster)}>
                    {visibleAirports.map((airport) => (
                        <Marker 
                            key={airport.id} // Use a unique identifier for each marker
                            position={[airport.latitude_deg, airport.longitude_deg]}
                            icon={atcIcon}
                            eventHandlers={{
                                click: () => {
                                    if (mapRef.current) {
                                        mapRef.current.setView([airport.latitude_deg, airport.longitude_deg], mapRef.current.getZoom() + 1);
                                    }
                                },
                            }}
                        >
                            {/* Tooltip showing airport name and IATA code */}
                            <Tooltip direction="top" offset={[0, 20]} className="custom-tooltip">
                                <Typography variant="body1" style={{ color: "white", fontWeight:"bold" }}>{airport.name}</Typography>
                                <Typography variant="body2" style={{ color: "white" }}>{airport.iata_code}/{airport.gps_code}</Typography>
                            </Tooltip>

                            <Popup>
                                <Typography variant="h6">{airport.name}</Typography>
                                <Typography variant="body1">IATA: {airport.iata_code || 'N/A'}</Typography>
                                <Typography variant="body1">ICAO: {airport.ident}</Typography>
                                <Typography variant="body1">Elevation: {airport.elevation_ft} ft</Typography>
                                <Typography variant="body1">Municipality: {airport.municipality || 'N/A'}</Typography>
                                <Typography variant="body1">Country: {airport.iso_country || 'N/A'}</Typography>
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>

            </MapContainer>
        </Box>
    );
};

export default Map;
