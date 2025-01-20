// src/Header.js
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { makeStyles } from '@mui/styles';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import SearchBar from './SearchBar';

const useStyles = makeStyles((theme) => ({
    appBar: {
        backgroundColor: 'black', // Set solid black background
        boxShadow: theme.shadows[4], // Optional: keep shadow for depth
    },
    title: {
        color: 'white',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
        fontWeight: 'bold',
        fontSize: '2.5rem',
        transition: 'color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        marginRight: theme.spacing(1),
    },
}));

const Header = () => {
    const classes = useStyles();

    return (
        <AppBar position="static" className={classes.appBar}>
            <Container maxWidth="lg">
                <Toolbar>
                    <AirplaneTicketIcon className={classes.icon} style={{ color: 'white', fontSize: '2rem' }} />
                    <Typography 
                        variant="h6" 
                        className={classes.title}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ffcc00'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                    >
                        Air Traffic Control Simulation
                    </Typography>
                    <SearchBar/>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;