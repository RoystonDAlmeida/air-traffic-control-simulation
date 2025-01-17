// frontend/src/trafficUtils.js

// Function to calculate total flights for each airport based on ICAO code
export const calculateTotalFlights = (trafficData, icaoCode) => {
    return trafficData.reduce((total, flight) => {

        // Count flights where the airport is either the departure or arrival airport
        if (flight.estDepartureAirport === icaoCode || flight.estArrivalAirport === icaoCode) {
            return total + (flight.departureAirportCandidatesCount + flight.arrivalAirportCandidatesCount); // Sum candidates
        }
        return total;
    }, 0);
};

// Function to get intensity color based on total flights
export const getIntensityColor = (count) => {
    if (count <= 5) return 'green';
    if (count <= 10) return 'yellow';
    if (count <= 15) return 'red';
    return 'transparent'; // No color for counts above 15 or zero
};