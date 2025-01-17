// src/AirportPopup_components/ImageCarousel.js

import React, { useState } from 'react';
import { IconButton, CircularProgress, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { fetchAirportImages } from '../dataResource';

const ImageCarousel = ({ airport, onImagesLoaded }) => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch images once when the component is rendered
    const loadImages = async () => {
        try {
            const fetchedImages = await fetchAirportImages(airport.name);
            setImages(fetchedImages);
            onImagesLoaded(); // Notify parent that images have loaded
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    // Call loadImages immediately
    if (images.length === 0 && loading) {
        loadImages();
    }

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div style={{ position: 'relative', marginTop: '10px' }}>
            {loading ? (
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '150px' // Match the height of the image
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {images.length > 0 && (
                        <img 
                            src={images[currentIndex]} 
                            alt={`Image`} 
                            style={{
                                width: '100%', 
                                height: '150px', 
                                objectFit: 'cover'
                            }} 
                        />
                    )}
                    <IconButton 
                        onClick={handlePrevious} 
                        disabled={images.length <= 1}
                        style={{
                            position: 'absolute',
                            left: 10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 1,
                        }}
                    >
                        <ArrowBackIcon sx={{ color: 'white' }} />
                    </IconButton>
                    
                    <IconButton 
                        onClick={handleNext} 
                        disabled={images.length <= 1}
                        style={{
                            position: 'absolute',
                            right: 10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 1,
                        }}
                    >
                        <ArrowForwardIcon sx={{ color: 'white' }} />
                    </IconButton>
                </>
            )}
        </div>
    );
};

export default ImageCarousel;
