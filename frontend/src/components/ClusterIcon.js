// src/components/ClusterIcon.js
import L from 'leaflet';

// Custom function to create cluster icons with colors based on count
export const createClusterIcon = (cluster) => {
    const count = cluster.getChildCount();
    let color;

    if (count < 10) {
        color = 'rgba(0, 255, 0, 0.5)'; // Green for clusters with less than 10 markers
    } else if (count < 50) {
        color = 'rgba(255, 165, 0, 0.5)'; // Orange for clusters with 10 to 49 markers
    } else {
        color = 'rgba(255, 0, 0, 0.5)'; // Red for clusters with 50 or more markers
    }

    return L.divIcon({
        className: 'custom-cluster-icon',
        html: `<div style="background-color: ${color}; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">${count}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
};