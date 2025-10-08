from flask import Blueprint, request, jsonify
import requests
from datetime import datetime

hadith_bp = Blueprint('hadith', __name__)

# Sunnah.com API Configuration
SUNNAH_API_BASE = "https://api.sunnah.com/v1"

# Available Hadith Collections
HADITH_COLLECTIONS = {
    'bukhari': {'name': 'Sahih al-Bukhari', 'description': 'Most authentic collection of Hadith'},
    'muslim': {'name': 'Sahih Muslim', 'description': 'Second most authentic collection'},
    'abudawud': {'name': 'Sunan Abu Dawud', 'description': 'Comprehensive collection covering various topics'},
    'tirmidhi': {'name': 'Jami at-Tirmidhi', 'description': 'Well-organized collection with grades'},
    'nasai': {'name': 'Sunan an-Nasa\'i', 'description': 'Focused on legal matters'},
    'ibnmajah': {'name': 'Sunan Ibn Majah', 'description': 'One of the six major collections'},
    'malik': {'name': 'Muwatta Malik', 'description': 'Early collection focusing on Medina practices'},
    'ahmad': {'name': 'Musnad Ahmad', 'description': 'Largest collection of Hadith'},
    'darimi': {'name': 'Sunan ad-Darimi', 'description': 'Well-structured topical arrangement'}
}

@hadith_bp.route('/collections', methods=['GET'])
def get_collections():
    """Get all available Hadith collections"""
    try:
        # Get collections from Sunnah.com API
        response = requests.get(f"{SUNNAH_API_BASE}/collections", timeout=10)
        
        if response.status_code == 200:
            api_data = response.json()
            
            # Enhanced with local descriptions
            enhanced_collections = []
            for collection in api_data.get('data', []):
                collection_key = collection.get('name', '').lower()
                local_info = HADITH_COLLECTIONS.get(collection_key, {})
                
                enhanced_collection = {
                    'id': collection.get('collectionID'),
                    'name': collection.get('collection', {}).get('en', 'Unknown'),
                    'arabic_name': collection.get('collection', {}).get('ar', ''),
                    'description': local_info.get('description', ''),
                    'total_hadith': collection.get('totalHadith', 0),
                    'hasBooks': collection.get('hasBooks', False),
                    'hasChapters': collection.get('hasChapters', False)
                }
                enhanced_collections.append(enhanced_collection)
            
            return jsonify({
                'success': True,
                'collections': enhanced_collections,
                'total': len(enhanced_collections)
            })
        else:
            # Fallback to local collections
            fallback_collections = []
            for key, info in HADITH_COLLECTIONS.items():
                fallback_collections.append({
                    'id': key,
                    'name': info['name'],
                    'description': info['description'],
                    'total_hadith': 0,
                    'hasBooks': True,
                    'hasChapters': True
                })
            
            return jsonify({
                'success': True,
                'collections': fallback_collections,
                'total': len(fallback_collections),
                'fallback': True
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to fetch collections: {str(e)}'
        }), 500

@hadith_bp.route('/collections/<collection_name>/books', methods=['GET'])
def get_books(collection_name):
    """Get books for a specific collection"""
    try:
        # Get books from Sunnah.com API
        response = requests.get(f"{SUNNAH_API_BASE}/collections/{collection_name}/books", timeout=10)
        
        if response.status_code == 200:
            api_data = response.json()
            books = []
            
            for book in api_data.get('data', []):
                book_info = {
                    'id': book.get('bookID'),
                    'number': book.get('bookNumber'),
                    'name': book.get('book', {}).get('en', 'Unknown'),
                    'arabic_name': book.get('book', {}).get('ar', ''),
                    'hadith_start': book.get('hadithStartNumber'),
                    'hadith_end': book.get('hadithEndNumber'),
                    'total_hadith': book.get('totalHadith', 0)
                }
                books.append(book_info)
            
            return jsonify({
                'success': True,
                'collection': collection_name,
                'books': books,
                'total': len(books)
            })
        else:
            return jsonify({
                'success': False,
                'error': f'Books not found for collection: {collection_name}'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to fetch books: {str(e)}'
        }), 500

@hadith_bp.route('/collections/<collection_name>/hadith', methods=['GET'])
def get_hadith_by_collection(collection_name):
    """Get Hadith from a specific collection"""
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        book_number = request.args.get('book')
        
        # Build API URL
        url = f"{SUNNAH_API_BASE}/collections/{collection_name}/hadith"
        params = {
            'page': page,
            'limit': min(limit, 50)  # Limit to 50 per page max
        }
        
        if book_number:
            params['book'] = book_number
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            api_data = response.json()
            hadith_list = []
            
            for hadith in api_data.get('data', []):
                hadith_info = {
                    'id': hadith.get('hadithID'),
                    'collection': hadith.get('collection'),
                    'book': hadith.get('book', {}).get('en', ''),
                    'book_number': hadith.get('bookNumber'),
                    'hadith_number': hadith.get('hadithNumber'),
                    'chapter': hadith.get('chapter', {}).get('en', ''),
                    'arabic': hadith.get('hadithArabic', ''),
                    'english': hadith.get('hadithEnglish', ''),
                    'narrator': hadith.get('hadithNarrator', ''),
                    'grades': [
                        {
                            'grade': grade.get('grade'),
                            'graded_by': grade.get('gradedBy')
                        }
                        for grade in hadith.get('grades', [])
                    ],
                    'topics': hadith.get('topics', []),
                    'references': hadith.get('references', [])
                }
                hadith_list.append(hadith_info)
            
            return jsonify({
                'success': True,
                'collection': collection_name,
                'hadith': hadith_list,
                'pagination': {
                    'current_page': page,
                    'total_pages': api_data.get('totalPages', 1),
                    'total_hadith': api_data.get('total', len(hadith_list)),
                    'per_page': limit
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': f'Hadith not found for collection: {collection_name}'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to fetch hadith: {str(e)}'
        }), 500

@hadith_bp.route('/hadith/<hadith_id>', methods=['GET'])
def get_hadith_by_id(hadith_id):
    """Get specific Hadith by ID"""
    try:
        response = requests.get(f"{SUNNAH_API_BASE}/hadith/{hadith_id}", timeout=10)
        
        if response.status_code == 200:
            api_data = response.json()
            hadith = api_data.get('data')
            
            if hadith:
                hadith_info = {
                    'id': hadith.get('hadithID'),
                    'collection': hadith.get('collection'),
                    'book': hadith.get('book', {}).get('en', ''),
                    'book_number': hadith.get('bookNumber'),
                    'hadith_number': hadith.get('hadithNumber'),
                    'chapter': hadith.get('chapter', {}).get('en', ''),
                    'arabic': hadith.get('hadithArabic', ''),
                    'english': hadith.get('hadithEnglish', ''),
                    'narrator': hadith.get('hadithNarrator', ''),
                    'grades': [
                        {
                            'grade': grade.get('grade'),
                            'graded_by': grade.get('gradedBy')
                        }
                        for grade in hadith.get('grades', [])
                    ],
                    'topics': hadith.get('topics', []),
                    'references': hadith.get('references', []),
                    'explanation': hadith.get('explanation', ''),
                    'related_hadith': hadith.get('relatedHadith', [])
                }
                
                return jsonify({
                    'success': True,
                    'hadith': hadith_info
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Hadith not found'
                }), 404
        else:
            return jsonify({
                'success': False,
                'error': f'Hadith not found with ID: {hadith_id}'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to fetch hadith: {str(e)}'
        }), 500

@hadith_bp.route('/search', methods=['GET'])
def search_hadith():
    """Search Hadith by text"""
    try:
        query = request.args.get('q', '').strip()
        collection = request.args.get('collection', '')
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        
        if not query:
            return jsonify({
                'success': False,
                'error': 'Search query is required'
            }), 400
        
        # Build search URL
        url = f"{SUNNAH_API_BASE}/hadith"
        params = {
            'q': query,
            'page': page,
            'limit': min(limit, 50)
        }
        
        if collection:
            params['collection'] = collection
        
        response = requests.get(url, params=params, timeout=15)
        
        if response.status_code == 200:
            api_data = response.json()
            search_results = []
            
            for hadith in api_data.get('data', []):
                result = {
                    'id': hadith.get('hadithID'),
                    'collection': hadith.get('collection'),
                    'book': hadith.get('book', {}).get('en', ''),
                    'hadith_number': hadith.get('hadithNumber'),
                    'arabic': hadith.get('hadithArabic', ''),
                    'english': hadith.get('hadithEnglish', ''),
                    'narrator': hadith.get('hadithNarrator', ''),
                    'relevance_score': hadith.get('relevanceScore', 0)
                }
                search_results.append(result)
            
            return jsonify({
                'success': True,
                'query': query,
                'results': search_results,
                'pagination': {
                    'current_page': page,
                    'total_pages': api_data.get('totalPages', 1),
                    'total_results': api_data.get('total', len(search_results)),
                    'per_page': limit
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Search failed'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Search failed: {str(e)}'
        }), 500

@hadith_bp.route('/random', methods=['GET'])
def get_random_hadith():
    """Get a random Hadith"""
    try:
        collection = request.args.get('collection', 'bukhari')
        
        response = requests.get(f"{SUNNAH_API_BASE}/collections/{collection}/hadith/random", timeout=10)
        
        if response.status_code == 200:
            api_data = response.json()
            hadith = api_data.get('data')
            
            if hadith:
                return jsonify({
                    'success': True,
                    'hadith': {
                        'id': hadith.get('hadithID'),
                        'collection': hadith.get('collection'),
                        'arabic': hadith.get('hadithArabic', ''),
                        'english': hadith.get('hadithEnglish', ''),
                        'narrator': hadith.get('hadithNarrator', ''),
                        'reference': f"{hadith.get('collection')} {hadith.get('hadithNumber')}"
                    }
                })
        
        # Fallback random hadith
        return jsonify({
            'success': True,
            'hadith': {
                'id': 'fallback',
                'collection': 'Sahih Bukhari',
                'arabic': 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
                'english': 'Actions are but by intention and every man shall have but that which he intended.',
                'narrator': 'Umar ibn Al-Khattab',
                'reference': 'Sahih Bukhari 1'
            },
            'fallback': True
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to fetch random hadith: {str(e)}'
        }), 500
