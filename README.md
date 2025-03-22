# ✈️ Air Traffic Simulation App

The **Air Traffic Simulation App** is a web-based application designed to visualize air traffic data using interactive charts. This application leverages the OpenSky API to fetch real-time flight data, including departures, arrivals, and current flights. It also integrates weather data for airport locations and uses a local CSV file to provide airport details.

## Demo

Here's a quick demo of the Air Traffic Simulation App:

<video width="800" max-width="100%" controls loop muted poster="./frontend/public/demo_poster.png">
  <source src="./frontend/public/Air_Traffic_Control_Simulation.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## 📖 Table of Contents

- [✈️ Air Traffic Simulation App](#️-air-traffic-simulation-app)
  - [Demo](#demo)
  - [📖 Table of Contents](#-table-of-contents)
  - [🚀 Features](#-features)
  - [💻 Technologies Used](#-technologies-used)
  - [📥 Installation](#-installation)
  - [📊 Usage](#-usage)
  - [📂 Directory Structure](#-directory-structure)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)

## 🚀 Features

- **Interactive Bar Chart**: Displays the total number of flights by continent. Users can click on a bar to view detailed information.
- **Pie Chart Visualization**: Upon clicking a continent's bar, a pie chart shows the top 5 countries with current flights.
- **Real-Time Flight Data**: Fetches real-time departure, arrival, and current flight data using the [OpenSky API](https://opensky-network.org/).
- **Weather Data Integration**: Retrieves current weather data for each airport location
using the [OpenWeatherMap API](https://openweathermap.org/)
- **Airport Image Integration**: The application utilizes the [Unsplash API](https://unsplash.com/) to fetch high-quality images of airports, enhancing the visual experience and providing users with stunning visuals related to air traffic and airport locations.
- **Airport Data Management**: Uses a local `airports.csv` file to provide details about airports, including latitude and longitude.

## 💻 Technologies Used

- **Frontend**: React.js(with libraries such as Chart.js for visualizations)
- **Design**: MaterialUI
- **Backend**: Express.js
- **APIs**: OpenSky API for flight data(Departures, Arrivals, Current Flights); Weather API (e.g., OpenWeatherMap) for weather information; Unsplash API for airport images
- **Data Management**: CSV files for local airport data

## 📥 Installation

To set up the Air Traffic Simulation App locally, follow these steps:

1. **Clone the Repository**:

```bash
git clone git@github.com:RoystonDAlmeida/air-traffic-control-simulation.git
cd air-traffic-control-simulation/
```

2. **Install Dependencies**:

- Navigate to `backend/` directory, then run the command:
```bash
npm install
```

- Navigate to `frontend/` directory, then run the command:
```bash
npm install
```

3. **Set Up Environment Variables**:

Create a `.env` file in the root directory (if applicable) and add your API keys:

```bash
OPENSKY_API_URL = 
OPENSKY_DEPARTURE_API_URL =
OPENSKY_ARRIVAL_API_URL = 
OPENSKY_FLIGHTS_API_URL =

UNSPLASH_ACCESS_KEY =
UNSPLASH_PHOTOS_URL =

OPENWEATHERMAP_API_KEY = 
OPENWEATHERMAP_API_URL =
```

4. **Run the Application**:

- Start the backend server:
Navigate to the `backend/` directory, then:

```bash
npm start
```
- Start the frontend development server, by navigating to the `frontend/` directory, then:

```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000` to view the application.

## 📊 Usage

Once the application is running, you can:

1. View an interactive bar chart displaying total flights by continent.
2. Click on any continent's bar to see a pie chart representing the top 5 countries with current flights.
3. Access real-time flight data fetched from the OpenSky API.
4. View current weather conditions for each airport location.
5. View air traffic intensity for flights departing/arriving within the past/next 30 minutes.

## 📂 Directory Structure

Here’s an overview of the project structure:

```bash
air-traffic-control-simulation/
├── backend/                            # Main server file for backend operations.
│   └── server.js                       # Sets up the server and handles API requests.
├── frontend/                           # Frontend source code directory.
│   ├── public/                         # Public assets directory.
│   │   └── airport.csv                 # Local CSV file containing airport data.
│   ├── src/                            # Source files for the React application.
│   │   ├── AirportPopup_components/    # Components related to airport popups.
│   │   │   ├── AirportDetails.js       # Displays detailed information about selected airports.
│   │   │   ├── ArrivalBox.js           # Component for displaying arrival flight details.
│   │   │   ├── ArrivalChart.js         # Chart component visualizing arrival flights data.
│   │   │   ├── DepartureBox.js         # Component for displaying departure flight details.
│   │   │   ├── DepartureChart.js       # Chart component visualizing departure flights data.
│   │   │   ├── ImageCarousel.js        # Carousel component for showcasing airport images.
│   │   │   └── WeatherData.js          # Displays current weather data for airports.
│   │   ├── components/                 # General reusable components throughout the app.
│   │   │   ├── BarChart.js             # Component for rendering bar chart visualizations.
│   │   │   ├── ClusterIcon.js          # Icon component for clustered markers on maps.
│   │   │   ├── CustomIcon.js           # Custom icon component for map markers.
│   │   │   ├── CustomZoomControl.js    # Custom zoom control component for maps.
│   │   │   ├── Footer.js               # Footer component displayed at the bottom of the app.
│   │   │   ├── Header.js               # Header component displayed at the top of the app.
│   │   │   ├── InfoBox.js              # Info box component showing information on maps.
│   │   │   ├── PieChart.js             # Component for rendering pie chart visualizations.
│   │   │   └── SearchBar.js            # Search bar component for searching airports.
│   │   ├── styles/                     # Styles directory containing CSS files.
│   │   └── styles.css                  # Main stylesheet for the application’s styling.
│   ├── utils/                          # Utility functions for various functionalities.
│   │    ├── arrivalChartUtils.js       # Utilities for processing arrival chart data.
│   │    └── departureChartUtils.js     # Utilities for processing departure chart data.
│   ├── AirportComponent.js             # Main airport component with airport images, weather data.
│    ├── App.js                         # Main application component rendering the overall app structure.
│    ├── dataResource.js                # Manages and provides access to various data resources used in the app. 
│    ├── Map.js                         # Component responsible for rendering maps and handling map-related logic. 
│    └── trafficUtils.js                # Utility functions related to processing traffic data. 
└── README.md                          # Project documentation file providing an overview and instructions.
```

## 🤝 Contributing

Contributions are welcome! If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/licenses/MIT) file for details.

---

Feel free to reach out if you have any questions or suggestions! Happy simulating! 😊✈️