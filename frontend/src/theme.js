// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#000000', // This will not affect AppBar directly if you set it in AppBar
        },
    },
});

export default theme;
