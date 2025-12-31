from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import database
import os

app = Flask(__name__, static_folder='static')
CORS(app)

# Initialize database on startup
database.init_db()
database.insert_mock_dives()

@app.route('/')
def index():
    """Serve the main page."""
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files."""
    if path.startswith('api/'):
        # Let API routes handle these
        return jsonify({'error': 'Not found'}), 404
    return send_from_directory('static', path)

@app.route('/api/dives', methods=['GET'])
def get_dives():
    """Get all dives."""
    try:
        dives = database.get_all_dives()
        return jsonify(dives), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dives/<int:dive_id>', methods=['GET'])
def get_dive(dive_id):
    """Get a specific dive by ID."""
    try:
        dive = database.get_dive_by_id(dive_id)
        if dive:
            return jsonify(dive), 200
        else:
            return jsonify({'error': 'Dive not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dives', methods=['POST'])
def create_dive():
    """Create a new dive."""
    try:
        dive_data = request.get_json()
        
        # Validate required fields
        required_fields = ['dive_number', 'date', 'location', 'dive_site', 'latitude', 'longitude']
        for field in required_fields:
            if field not in dive_data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        dive_id = database.add_dive(dive_data)
        return jsonify({'id': dive_id, 'message': 'Dive created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dives/<int:dive_id>', methods=['PUT'])
def update_dive(dive_id):
    """Update an existing dive."""
    try:
        dive_data = request.get_json()
        
        # Validate required fields
        required_fields = ['dive_number', 'date', 'location', 'dive_site', 'latitude', 'longitude']
        for field in required_fields:
            if field not in dive_data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        success = database.update_dive(dive_id, dive_data)
        if success:
            return jsonify({'message': 'Dive updated successfully'}), 200
        else:
            return jsonify({'error': 'Dive not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dives/<int:dive_id>', methods=['DELETE'])
def delete_dive(dive_id):
    """Delete a dive."""
    try:
        success = database.delete_dive(dive_id)
        if success:
            return jsonify({'message': 'Dive deleted successfully'}), 200
        else:
            return jsonify({'error': 'Dive not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get diving statistics."""
    try:
        dives = database.get_all_dives()
        
        if not dives:
            return jsonify({
                'total_dives': 0,
                'total_dive_time': 0,
                'max_depth': 0,
                'locations': 0
            }), 200
        
        total_dive_time = sum(dive.get('duration', 0) or 0 for dive in dives)
        max_depth = max((dive.get('max_depth', 0) or 0 for dive in dives), default=0)
        unique_locations = len(set(dive['location'] for dive in dives))
        
        stats = {
            'total_dives': len(dives),
            'total_dive_time': total_dive_time,
            'max_depth': max_depth,
            'locations': unique_locations
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Create static directory if it doesn't exist
    if not os.path.exists('static'):
        os.makedirs('static')
    
    app.run(debug=True, host='0.0.0.0', port=5000)
