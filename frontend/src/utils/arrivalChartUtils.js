// frontend/src/utils/arrivalChartUtils.js
export const prepareArrivalChartData = (arrivals) => {
    const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
    const dataCounts = Array(24).fill(0); // Initialize counts for each hour

    if (!arrivals || arrivals.length === 0) return { labels: hours, dataCounts };

    // Count arrivals for each hour
    arrivals.forEach(arrival => {
        const date = new Date(arrival.lastSeen * 1000); // Convert seconds to milliseconds
        const hour = date.getHours(); // Get the hour in UTC

        dataCounts[hour]++; // Increment the count for this hour
    });

    return { labels: hours, dataCounts };
};