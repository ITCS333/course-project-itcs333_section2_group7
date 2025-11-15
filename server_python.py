#!/usr/bin/env python3
"""
Task 2 Course Resources - Python Flask Server
Alternative to Express.js for environments without Node.js
"""

from flask import Flask, jsonify, request
import json
import os
from datetime import datetime

app = Flask(__name__, static_folder='.', static_url_path='')

# Data directory
DATA_DIR = os.path.join(os.path.dirname(__file__), 'src', 'resources', 'api')
RES_FILE = os.path.join(DATA_DIR, 'resources.json')
COMMENTS_FILE = os.path.join(DATA_DIR, 'comments.json')

def read_json(file_path):
    """Read JSON file safely"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return [] if 'resources' in file_path else {}

def write_json(file_path, data):
    """Write JSON file safely"""
    try:
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error writing {file_path}: {e}")
        return False

# --- Resources Endpoints ---

@app.route('/api/resources', methods=['GET'])
def get_resources():
    """Get all resources"""
    resources = read_json(RES_FILE)
    return jsonify(resources if isinstance(resources, list) else [])

@app.route('/api/resources', methods=['POST'])
def create_resource():
    """Create new resource"""
    data = request.get_json()
    if not data or not data.get('title') or not data.get('link'):
        return jsonify({'error': 'title and link required'}), 400
    
    resources = read_json(RES_FILE)
    new_resource = {
        'id': f"res_{int(datetime.now().timestamp() * 1000)}",
        'title': data.get('title'),
        'description': data.get('description', ''),
        'link': data.get('link')
    }
    resources.append(new_resource)
    
    if write_json(RES_FILE, resources):
        return jsonify(new_resource), 201
    return jsonify({'error': 'Failed to save'}), 500

@app.route('/api/resources/<resource_id>', methods=['PUT'])
def update_resource(resource_id):
    """Update resource"""
    data = request.get_json()
    if not data or not data.get('title') or not data.get('link'):
        return jsonify({'error': 'title and link required'}), 400
    
    resources = read_json(RES_FILE)
    for i, res in enumerate(resources):
        if res['id'] == resource_id:
            resources[i]['title'] = data.get('title')
            resources[i]['description'] = data.get('description', '')
            resources[i]['link'] = data.get('link')
            if write_json(RES_FILE, resources):
                return jsonify(resources[i]), 200
            return jsonify({'error': 'Failed to save'}), 500
    
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/resources/<resource_id>', methods=['DELETE'])
def delete_resource(resource_id):
    """Delete resource"""
    resources = read_json(RES_FILE)
    new_resources = [r for r in resources if r['id'] != resource_id]
    
    if len(new_resources) == len(resources):
        return jsonify({'error': 'Not found'}), 404
    
    if write_json(RES_FILE, new_resources):
        return jsonify({'success': True}), 200
    return jsonify({'error': 'Failed to delete'}), 500

# --- Comments Endpoints ---

@app.route('/api/comments', methods=['GET'])
def get_comments():
    """Get all comments"""
    comments = read_json(COMMENTS_FILE)
    return jsonify(comments if isinstance(comments, dict) else {})

@app.route('/api/comments/<resource_id>', methods=['POST'])
def add_comment(resource_id):
    """Add comment to resource"""
    data = request.get_json()
    if not data or not data.get('text'):
        return jsonify({'error': 'text required'}), 400
    
    comments = read_json(COMMENTS_FILE)
    if resource_id not in comments:
        comments[resource_id] = []
    
    comment = {
        'author': data.get('author', 'Student'),
        'text': data.get('text')
    }
    comments[resource_id].append(comment)
    
    if write_json(COMMENTS_FILE, comments):
        return jsonify(comment), 201
    return jsonify({'error': 'Failed to save'}), 500

# --- Static Files ---

@app.route('/')
def index():
    """Serve index.html"""
    if os.path.exists('index.html'):
        with open('index.html', 'r', encoding='utf-8') as f:
            return f.read()
    return 'Course Project - Task 2 Resources Server Running'

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    print(f"Starting Task 2 Server on http://localhost:{port}")
    print("Open your browser to:")
    print(f"  - Student List:   http://localhost:{port}/src/resources/list.html")
    print(f"  - Admin Page:     http://localhost:{port}/src/resources/admin.html")
    print(f"  - Resource Detail: http://localhost:{port}/src/resources/details.html?id=res_1")
    app.run(host='localhost', port=port, debug=False)
