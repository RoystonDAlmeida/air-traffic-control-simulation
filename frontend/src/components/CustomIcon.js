// src/components/CustomIcon.js
import L from 'leaflet';

// Create a custom ATC icon
const atcIcon = L.icon({
    iconUrl: '/tower.png', // Replace with the path to your ATC icon
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
});

export default atcIcon;