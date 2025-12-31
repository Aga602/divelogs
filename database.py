import sqlite3
import json
from datetime import datetime

def init_db():
    """Initialize the database and create tables if they don't exist."""
    conn = sqlite3.connect('divelogs.db')
    cursor = conn.cursor()
    
    # Create dives table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS dives (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dive_number INTEGER NOT NULL,
            date TEXT NOT NULL,
            location TEXT NOT NULL,
            dive_site TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            max_depth REAL,
            duration INTEGER,
            water_temp REAL,
            visibility INTEGER,
            notes TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

def insert_mock_dives():
    """Insert mock dive data for preview."""
    conn = sqlite3.connect('divelogs.db')
    cursor = conn.cursor()
    
    # Check if we already have data
    cursor.execute('SELECT COUNT(*) FROM dives')
    count = cursor.fetchone()[0]
    
    if count == 0:
        mock_dives = [
            {
                'dive_number': 1,
                'date': '2023-06-15',
                'location': 'Great Barrier Reef',
                'dive_site': 'Cod Hole',
                'latitude': -14.6919,
                'longitude': 145.6331,
                'max_depth': 18.5,
                'duration': 45,
                'water_temp': 26.0,
                'visibility': 30,
                'notes': 'Amazing dive! Saw potato cod and white tip reef sharks.'
            },
            {
                'dive_number': 2,
                'date': '2023-06-16',
                'location': 'Great Barrier Reef',
                'dive_site': 'Ribbon Reefs',
                'latitude': -14.5833,
                'longitude': 145.5167,
                'max_depth': 22.0,
                'duration': 50,
                'water_temp': 25.5,
                'visibility': 25,
                'notes': 'Beautiful coral formations and schools of tropical fish.'
            },
            {
                'dive_number': 3,
                'date': '2023-08-10',
                'location': 'Maldives',
                'dive_site': 'Banana Reef',
                'latitude': 4.2744,
                'longitude': 73.5330,
                'max_depth': 15.0,
                'duration': 55,
                'water_temp': 28.0,
                'visibility': 35,
                'notes': 'Crystal clear water. Encountered manta rays!'
            },
            {
                'dive_number': 4,
                'date': '2023-09-05',
                'location': 'Red Sea, Egypt',
                'dive_site': 'Ras Mohammed',
                'latitude': 27.7395,
                'longitude': 34.2304,
                'max_depth': 25.0,
                'duration': 48,
                'water_temp': 27.0,
                'visibility': 30,
                'notes': 'Incredible wall dive with vibrant coral gardens.'
            },
            {
                'dive_number': 5,
                'date': '2023-10-20',
                'location': 'Sipadan, Malaysia',
                'dive_site': 'Barracuda Point',
                'latitude': 4.1128,
                'longitude': 118.6283,
                'max_depth': 28.0,
                'duration': 42,
                'water_temp': 29.0,
                'visibility': 28,
                'notes': 'Huge school of barracudas forming a tornado! Unforgettable.'
            },
            {
                'dive_number': 6,
                'date': '2023-11-12',
                'location': 'Cenotes, Mexico',
                'dive_site': 'Gran Cenote',
                'latitude': 20.2586,
                'longitude': -87.4647,
                'max_depth': 12.0,
                'duration': 60,
                'water_temp': 25.0,
                'visibility': 40,
                'notes': 'Amazing freshwater cavern dive with incredible light beams.'
            },
            {
                'dive_number': 7,
                'date': '2024-01-15',
                'location': 'Galapagos Islands',
                'dive_site': 'Gordon Rocks',
                'latitude': -0.6333,
                'longitude': -90.3167,
                'max_depth': 30.0,
                'duration': 38,
                'water_temp': 22.0,
                'visibility': 20,
                'notes': 'Strong currents but worth it! Hammerhead sharks everywhere.'
            },
            {
                'dive_number': 8,
                'date': '2024-03-08',
                'location': 'Bali, Indonesia',
                'dive_site': 'USS Liberty Wreck',
                'latitude': -8.2775,
                'longitude': 115.5942,
                'max_depth': 20.0,
                'duration': 52,
                'water_temp': 27.5,
                'visibility': 22,
                'notes': 'Historic wreck completely covered in coral. Beautiful!'
            },
            {
                'dive_number': 9,
                'date': '2024-05-22',
                'location': 'Thailand',
                'dive_site': 'Richelieu Rock',
                'latitude': 9.0833,
                'longitude': 97.8667,
                'max_depth': 26.0,
                'duration': 45,
                'water_temp': 28.5,
                'visibility': 25,
                'notes': 'Whale shark encounter! Plus countless colorful fish species.'
            },
            {
                'dive_number': 10,
                'date': '2024-07-10',
                'location': 'Philippines',
                'dive_site': 'Tubbataha Reef',
                'latitude': 8.8333,
                'longitude': 119.8333,
                'max_depth': 24.0,
                'duration': 47,
                'water_temp': 28.0,
                'visibility': 32,
                'notes': 'Pristine reef system. Saw tiger sharks and huge Napoleon wrasse.'
            }
        ]
        
        for dive in mock_dives:
            cursor.execute('''
                INSERT INTO dives (dive_number, date, location, dive_site, latitude, 
                                 longitude, max_depth, duration, water_temp, visibility, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                dive['dive_number'], dive['date'], dive['location'], dive['dive_site'],
                dive['latitude'], dive['longitude'], dive['max_depth'], dive['duration'],
                dive['water_temp'], dive['visibility'], dive['notes']
            ))
        
        conn.commit()
        print(f"Inserted {len(mock_dives)} mock dives into database.")
    else:
        print(f"Database already contains {count} dives. Skipping mock data insertion.")
    
    conn.close()

def get_all_dives():
    """Retrieve all dives from the database."""
    conn = sqlite3.connect('divelogs.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM dives ORDER BY date DESC')
    rows = cursor.fetchall()
    
    dives = []
    for row in rows:
        dives.append(dict(row))
    
    conn.close()
    return dives

def get_dive_by_id(dive_id):
    """Retrieve a specific dive by ID."""
    conn = sqlite3.connect('divelogs.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM dives WHERE id = ?', (dive_id,))
    row = cursor.fetchone()
    
    dive = dict(row) if row else None
    conn.close()
    return dive

def add_dive(dive_data):
    """Add a new dive to the database."""
    conn = sqlite3.connect('divelogs.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO dives (dive_number, date, location, dive_site, latitude, 
                         longitude, max_depth, duration, water_temp, visibility, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        dive_data['dive_number'], dive_data['date'], dive_data['location'],
        dive_data['dive_site'], dive_data['latitude'], dive_data['longitude'],
        dive_data.get('max_depth'), dive_data.get('duration'),
        dive_data.get('water_temp'), dive_data.get('visibility'),
        dive_data.get('notes', '')
    ))
    
    dive_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return dive_id

def update_dive(dive_id, dive_data):
    """Update an existing dive."""
    conn = sqlite3.connect('divelogs.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE dives 
        SET dive_number=?, date=?, location=?, dive_site=?, latitude=?, 
            longitude=?, max_depth=?, duration=?, water_temp=?, visibility=?, notes=?
        WHERE id=?
    ''', (
        dive_data['dive_number'], dive_data['date'], dive_data['location'],
        dive_data['dive_site'], dive_data['latitude'], dive_data['longitude'],
        dive_data.get('max_depth'), dive_data.get('duration'),
        dive_data.get('water_temp'), dive_data.get('visibility'),
        dive_data.get('notes', ''), dive_id
    ))
    
    conn.commit()
    conn.close()
    return cursor.rowcount > 0

def delete_dive(dive_id):
    """Delete a dive from the database."""
    conn = sqlite3.connect('divelogs.db')
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM dives WHERE id = ?', (dive_id,))
    
    conn.commit()
    conn.close()
    return cursor.rowcount > 0

if __name__ == '__main__':
    init_db()
    insert_mock_dives()
    print("Database initialized successfully!")
