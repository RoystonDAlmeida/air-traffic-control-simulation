import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, Popper, Paper, List, ListItem, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SearchBar = () => {
    const [airports, setAirports] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAirports, setFilteredAirports] = useState([]);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null); // To track the anchor element
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/airports.csv');
            const csvData = await response.text();
            Papa.parse(csvData, {
                header: true,
                complete: (results) => {
                    const largeAirports = results.data.filter(airport => 
                        airport.type === "large_airport" && 
                        airport.latitude_deg && 
                        airport.longitude_deg
                    );

                    setAirports(largeAirports);
                }
            });
        };

        fetchData();
    }, []);

    const handleChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (value.length >= 3) {
            const filtered = airports.filter((airport) =>
                airport.name.toLowerCase().includes(value.toLowerCase()) ||
                airport.iata_code.toLowerCase().includes(value.toLowerCase()) ||
                airport.gps_code.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredAirports(filtered);
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    const handleMouseOver = (url) => {
        window.status = url; // Display URL in the status bar
    };

    const handleMouseOut = () => {
        window.status = ''; // Clear the status bar
    };

    return (
        <div style={{ position: 'relative', width: '400px', marginLeft: 'auto', marginRight: '20px' }}>
            <TextField
                variant="outlined"
                placeholder="Find Airports(Name, IATA code, GPS code)..."
                size="small"
                value={searchTerm}
                onChange={handleChange}
                onFocus={(event) => setAnchorEl(event.currentTarget)} // Set anchor when focused
                sx={{
                    width: '100%', // Full width of container
                    backgroundColor: '#424242', // Darker gray background
                    borderRadius: '4px',
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.5)', // Light border color
                        },
                        '&:hover fieldset': {
                            borderColor: '#ffcc00', // Change border color on hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#ffcc00', // Change border color when focused
                        },
                        '& input': {
                            color: 'white', // Set input text color to white
                        },
                        '& ::placeholder': {
                            color: 'rgba(255, 255, 255, 0.7)', // Placeholder text color
                            opacity: 1,
                        },
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        </InputAdornment>
                    ),
                }}
            />
            <Popper open={open} anchorEl={anchorEl} placement="bottom-start" style={{ zIndex: 1000 }}>
                <Paper elevation={3} sx={{ maxHeight: '200px', overflowY: 'auto', width: '100%' }}>
                    <List>
                        {filteredAirports.length > 0 ? (
                            filteredAirports.slice(0, 5).map((airport) => (
                                <ListItem 
                                    key={airport.id} 
                                    sx={{ 
                                        backgroundColor: '#424242', 
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.2)', 
                                        width: '100%', 
                                        cursor: 'pointer', // Hand cursor on hover
                                        '&:hover': { backgroundColor: '#555555' } // Hover effect
                                    }}
                                    onClick={() => navigate(`/airports/${airport.iata_code.toLowerCase()}`)} // Navigate on click
                                    onMouseOver={() => handleMouseOver(`/airports/${airport.iata_code}`)} // Display URL
                                    onMouseOut={handleMouseOut} // Clear URL
                                >
                                    <ListItemText 
                                        primary={<span style={{ color: 'white' }}>{airport.name}</span>} 
                                        secondary={
                                            <span style={{ fontWeight: 'bold', color: 'white' }}>
                                                {`${airport.iata_code} | ${airport.gps_code}`}
                                            </span>
                                        } 
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <ListItem sx={{ justifyContent: 'center' }}>
                                <ListItemText primary={<span style={{ color: 'black' }}>No matches found. Try checking the spelling.</span>} />
                            </ListItem>
                        )}
                    </List>
                </Paper>
            </Popper>
        </div>
    );
};

export default SearchBar;