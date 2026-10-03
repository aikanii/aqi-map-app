<div align="center">

# 🌍 AirSense: Global Air Quality Map

**An interactive map for checking the US Air Quality Index (AQI) anywhere in the world.**

Click the map or search for a place to see its current AQI, with the interface color-coded to the pollution level.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet&logoColor=white)
![Open-Meteo](https://img.shields.io/badge/Data-Open--Meteo-F59E0B?style=flat-square)
![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-%E2%89%A5%2020.19-339933?style=flat-square&logo=nodedotjs&logoColor=white)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [AQI Categories](#aqi-categories)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Data Sources & Usage Notes](#data-sources--usage-notes)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

AirSense is a single-page React app that displays live air quality on an interactive world map. On load it fetches current readings for 16 major cities and plots them as AQI markers. Selecting any other point on the map, or searching for a place, fetches the current US AQI for that exact location.

The app needs **no API keys or environment variables**. All data comes from free, public APIs.

---

## Features

- **Live global overview**: current AQI markers for 16 major cities, loaded in a single bulk request.
- **Click-to-query**: click anywhere on the map to get the AQI for that coordinate.
- **Location search**: type to get suggestions from the built-in city list, or press **Enter** to geocode any place name.
- **Dynamic theming**: the panel, glow, and background colors change with the AQI category.
- **Loading and error states**: a loader while fetching, and clear messages when a location has no data or a search fails.

---

## AQI Categories

The app uses the [US AQI](https://www.airnow.gov/aqi/aqi-basics/) scale reported by Open-Meteo.

| AQI | Category | Theme color |
| --- | --- | --- |
| 0–50 | Good | 🟢 Green |
| 51–100 | Moderate | 🟡 Amber |
| 101–150 | Unhealthy for Sensitive Groups | 🟠 Orange |
| 151–200 | Unhealthy | 🔴 Red |
| 201–300 | Very Unhealthy | 🟣 Purple |
| 301+ | Hazardous | 🟤 Maroon |

---

## Tech Stack

| Area | Technology |
| --- | --- |
| **UI framework** | React 19 |
| **Build tool** | Vite 8 with `@vitejs/plugin-react` |
| **Map** | Leaflet and React-Leaflet, OpenStreetMap tiles |
| **Icons** | Lucide React |
| **Air quality data** | [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api) |
| **Geocoding** | [Nominatim](https://nominatim.org/) (OpenStreetMap) |
| **Linting** | ESLint 9 with React Hooks and React Refresh plugins |

---

## Getting Started

### Prerequisites

- **Node.js** 20.19 or newer (or 22.12+), as required by Vite 8
- **npm**

### Installation

```bash
git clone https://github.com/aikanii/aqi-map-app.git
cd aqi-map-app
npm install
```

### Run locally

```bash
npm run dev
```

Vite prints a local URL (by default [http://localhost:5173](http://localhost:5173)). Open it in your browser.

### Build for production

```bash
npm run build
npm run preview   # optional: serve the production build locally
```

The build output is written to `dist/`.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reload |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## Project Structure

```text
aqi-map-app/
├── public/             # Static assets (favicon, icons)
├── src/
│   ├── main.jsx        # App entry point
│   ├── App.jsx         # Map, search, AQI logic, and UI
│   ├── index.css       # Global styles and AQI color themes
│   └── App.css         # Leftover template styles (not currently imported)
├── index.html          # HTML entry point
├── vite.config.js      # Vite configuration
└── eslint.config.js    # ESLint configuration
```

---

## How It Works

1. **On load**, `App.jsx` requests current `us_aqi` values for all major cities from Open-Meteo in one call and renders them as custom Leaflet markers with tooltips.
2. **On map click**, the clicked coordinates are sent to Open-Meteo and the result updates the AQI panel.
3. **On search**, typing filters the built-in city list. Pressing Enter sends the text to Nominatim, then fetches the AQI for the first match.
4. **Theming**: the AQI value is mapped to a category (`getAQITheme` and `getAQILabel`), which sets a CSS class that drives the colors across the interface.

---

## Data Sources & Usage Notes

- **Air quality** is provided by [Open-Meteo](https://open-meteo.com/). Its free API is intended for non-commercial use and requires attribution; review their [terms](https://open-meteo.com/en/terms) before deploying publicly.
- **Map tiles and geocoding** come from OpenStreetMap services, which have usage policies for [tiles](https://operations.osmfoundation.org/policies/tiles/) and [Nominatim](https://operations.osmfoundation.org/policies/nominatim/). They are suitable for light use; heavy traffic should use a dedicated provider.
- AQI values are indicative and should not replace official local air quality advisories.

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Make your changes and run `npm run lint`.
4. Open a pull request with a clear description.

---

## License

No license has been specified for this project yet. Until one is added, all rights are reserved by default.
