# 🌊 Dive Logs - Interactive World Map

A web application that tracks and visualizes scuba diving adventures on an interactive world map. This application stores dive information in a SQL database and displays all dive locations on a beautiful, interactive map with detailed dive information.

## Features

- **Interactive World Map**: View all your dives on a dynamic world map powered by Leaflet
- **Dive Statistics**: Track total dives, time underwater, maximum depth, and locations visited
- **Detailed Dive Information**: Click on any dive to see comprehensive details including:
  - Dive number and date
  - Location and dive site name
  - Maximum depth and duration
  - Water temperature and visibility
  - Personal notes and observations
- **SQLite Database**: All dive data is stored in a lightweight SQL database
- **RESTful API**: Full CRUD operations for managing dive records
- **Mock Data**: Pre-loaded with 10 example dives from amazing locations around the world

## Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Aga602/divelogs.git
cd divelogs
```

2. Install required Python packages:
```bash
pip install -r requirements.txt
```

3. Initialize the database with mock data:
```bash
python database.py
```

## Running the Application

Start the Flask server:
```bash
python app.py
```

The application will be available at `http://localhost:5000`

## Usage

### Viewing Dives
- Open your browser and navigate to `http://localhost:5000`
- The map will display all dive locations with animated markers
- Click on any marker or dive entry in the sidebar to view detailed information
- The map automatically zooms to show all your dive locations

### API Endpoints

The application provides a RESTful API for managing dives:

- `GET /api/dives` - Get all dives
- `GET /api/dives/<id>` - Get a specific dive
- `POST /api/dives` - Create a new dive
- `PUT /api/dives/<id>` - Update a dive
- `DELETE /api/dives/<id>` - Delete a dive
- `GET /api/stats` - Get diving statistics

### Adding New Dives

You can add new dives by making a POST request to `/api/dives` with the following JSON structure:

```json
{
  "dive_number": 11,
  "date": "2024-08-15",
  "location": "Caribbean Sea",
  "dive_site": "Blue Hole",
  "latitude": 17.3169,
  "longitude": -87.5353,
  "max_depth": 40.0,
  "duration": 35,
  "water_temp": 28.0,
  "visibility": 30,
  "notes": "Incredible dive into the famous Blue Hole!"
}
```

## Project Structure

```
divelogs/
├── app.py              # Flask application and API endpoints
├── database.py         # Database initialization and operations
├── requirements.txt    # Python dependencies
├── divelogs.db        # SQLite database (created on first run)
├── static/
│   ├── index.html     # Main HTML page
│   ├── styles.css     # CSS styling
│   └── app.js         # JavaScript for map and interactions
└── README.md          # This file
```

## Mock Dives Included

The application comes pre-loaded with 10 dives from amazing locations:

1. Great Barrier Reef, Australia - Cod Hole
2. Great Barrier Reef, Australia - Ribbon Reefs
3. Maldives - Banana Reef
4. Red Sea, Egypt - Ras Mohammed
5. Sipadan, Malaysia - Barracuda Point
6. Cenotes, Mexico - Gran Cenote
7. Galapagos Islands - Gordon Rocks
8. Bali, Indonesia - USS Liberty Wreck
9. Thailand - Richelieu Rock
10. Philippines - Tubbataha Reef

## Technologies Used

- **Backend**: Python, Flask, SQLite
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Mapping**: Leaflet.js with OpenStreetMap tiles
- **API**: RESTful architecture with JSON

## License

MIT License - Feel free to use this project for your own dive logging needs!

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Happy Diving! 🤿
