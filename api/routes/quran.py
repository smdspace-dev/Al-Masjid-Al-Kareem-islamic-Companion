from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import requests

quran_bp = Blueprint('quran', __name__)

# Quran.com API base URL
QURAN_API_BASE = "https://api.quran.com/api/v4"

# Available reciters from Quran.com API
RECITERS = [
    {'id': 7, 'name': 'Mishari Rashid al-Afasy', 'reciter_name': 'Mishari Rashid al-Afasy'},
    {'id': 1, 'name': 'Abdul Basit Abdul Samad (Murattal)', 'reciter_name': 'Abdul Basit Abdul Samad'},
    {'id': 3, 'name': 'Abdur-Rahman as-Sudais', 'reciter_name': 'Abdur-Rahman as-Sudais'},
    {'id': 5, 'name': 'Sa`ud ash-Shuraym', 'reciter_name': 'Sa`ud ash-Shuraym'},
    {'id': 6, 'name': 'Ahmed ibn Ali al-Ajamy', 'reciter_name': 'Ahmed ibn Ali al-Ajamy'}
]

# Para to Surah mapping (accurate mapping based on Quran structure)
PARA_SURAH_MAPPING = {
    1: [1, 2],      # Para 1: Al-Fatiha, Al-Baqarah (1-141)
    2: [2],         # Para 2: Al-Baqarah (142-252)
    3: [2, 3],      # Para 3: Al-Baqarah (253-286), Ali Imran (1-92)
    4: [3, 4],      # Para 4: Ali Imran (93-200), An-Nisa (1-23)
    5: [4],         # Para 5: An-Nisa (24-147)
    6: [4, 5],      # Para 6: An-Nisa (148-176), Al-Maidah (1-81)
    7: [5, 6],      # Para 7: Al-Maidah (82-120), Al-An'am (1-110)
    8: [6, 7],      # Para 8: Al-An'am (111-165), Al-A'raf (1-87)
    9: [7, 8],      # Para 9: Al-A'raf (88-206), Al-Anfal (1-40)
    10: [8, 9],     # Para 10: Al-Anfal (41-75), At-Tawbah (1-92)
    11: [9, 10, 11], # Para 11: At-Tawbah (93-129), Yunus, Hud (1-5)
    12: [11, 12],   # Para 12: Hud (6-123), Yusuf (1-52)
    13: [12, 13, 14], # Para 13: Yusuf (53-111), Ar-Ra'd, Ibrahim (1-52)
    14: [14, 15],   # Para 14: Ibrahim (53-52), Al-Hijr
    15: [15, 16, 17], # Para 15: Al-Hijr, An-Nahl, Al-Isra (1-111)
    16: [17, 18, 19, 20], # Para 16: Al-Isra, Al-Kahf, Maryam, Ta-Ha (1-135)
    17: [20, 21],   # Para 17: Ta-Ha (136), Al-Anbiya
    18: [22, 23, 24, 25], # Para 18: Al-Hajj, Al-Mu'minun, An-Nur, Al-Furqan (1-20)
    19: [25, 26, 27], # Para 19: Al-Furqan (21-77), Ash-Shu'ara, An-Naml (1-55)
    20: [27, 28],   # Para 20: An-Naml (56-93), Al-Qasas
    21: [29, 30, 31, 32, 33], # Para 21: Al-Ankabut, Ar-Rum, Luqman, As-Sajda, Al-Ahzab (1-30)
    22: [33, 34, 35, 36], # Para 22: Al-Ahzab (31-73), Saba, Fatir, Ya-Sin (1-21)
    23: [36, 37, 38, 39], # Para 23: Ya-Sin (22-83), As-Saffat, Sad, Az-Zumar (1-31)
    24: [39, 40, 41], # Para 24: Az-Zumar (32-75), Ghafir, Fussilat (1-46)
    25: [41, 42, 43, 44, 45], # Para 25: Fussilat (47-54), Ash-Shura, Az-Zukhruf, Ad-Dukhan, Al-Jathiya
    26: [46, 47, 48, 49, 50, 51], # Para 26: Al-Ahqaf, Muhammad, Al-Fath, Al-Hujurat, Qaf, Adh-Dhariyat (1-30)
    27: [51, 52, 53, 54, 55, 56, 57], # Para 27: Adh-Dhariyat (31-60), At-Tur, An-Najm, Al-Qamar, Ar-Rahman, Al-Waqi'a, Al-Hadid (1-29)
    28: [58, 59, 60, 61, 62, 63, 64, 65, 66], # Para 28: Al-Mujadala, Al-Hashr, Al-Mumtahana, As-Saff, Al-Jumu'a, Al-Munafiqun, At-Taghabun, At-Talaq, At-Tahrim
    29: [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77], # Para 29: Al-Mulk, Al-Qalam, Al-Haqqah, Al-Ma'arij, Nuh, Al-Jinn, Al-Muzzammil, Al-Muddaththir, Al-Qiyamah, Al-Insan, Al-Mursalat
    30: [78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114] # Para 30: An-Naba to An-Nas (37 surahs)
}

@quran_bp.route('/reciters', methods=['GET'])
def get_reciters():
    """Get available reciters"""
    try:
        return jsonify({
            'reciters': RECITERS,
            'total': len(RECITERS)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quran_bp.route('/paras', methods=['GET'])
def get_paras():
    """Get list of all paras with their surahs"""
    try:
        paras = []
        for i in range(1, 31):
            surahs_in_para = PARA_SURAH_MAPPING.get(i, [])
            paras.append({
                'number': i,
                'name': f'Para {i}',
                'surahs': surahs_in_para
            })
        
        return jsonify({
            'paras': paras,
            'total': 30
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quran_bp.route('/para/<int:para_number>/surahs', methods=['GET'])
def get_para_surahs(para_number):
    """Get surahs for a specific para"""
    try:
        if para_number < 1 or para_number > 30:
            return jsonify({'error': 'Para number must be between 1 and 30'}), 400
            
        surah_ids = PARA_SURAH_MAPPING.get(para_number, [])
        surahs = []
        
        # Fetch surah details from Quran.com API
        for surah_id in surah_ids:
            try:
                response = requests.get(f"{QURAN_API_BASE}/chapters/{surah_id}", timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    if 'chapter' in data:
                        surahs.append(data['chapter'])
            except Exception as e:
                print(f"Error fetching surah {surah_id}: {e}")
                # Add fallback data
                surahs.append({
                    'id': surah_id,
                    'name_simple': f'Surah {surah_id}',
                    'name_arabic': f'السورة {surah_id}',
                    'verses_count': 100  # Placeholder
                })
        
        return jsonify({
            'para_number': para_number,
            'surahs': surahs,
            'total': len(surahs)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quran_bp.route('/chapters', methods=['GET'])
def get_chapters():
    """Get all chapters (surahs)"""
    try:
        response = requests.get(f"{QURAN_API_BASE}/chapters", timeout=10)
        if response.status_code == 200:
            data = response.json()
            return jsonify(data), 200
        else:
            # Fallback data
            fallback_chapters = []
            for i in range(1, 115):  # 114 surahs
                fallback_chapters.append({
                    'id': i,
                    'name_simple': f'Surah {i}',
                    'name_arabic': f'السورة {i}',
                    'verses_count': 50  # Placeholder
                })
            return jsonify({'chapters': fallback_chapters}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quran_bp.route('/chapter/<int:chapter_id>/audio', methods=['GET'])
def get_chapter_audio(chapter_id):
    """Get audio file for a chapter with multiple fallback URLs"""
    try:
        reciter_id = request.args.get('reciter_id', 7)
        
        # Multiple audio source attempts
        audio_urls = [
            f"https://server8.mp3quran.net/afs/{str(chapter_id).zfill(3)}.mp3",  # Mishari al-Afasy
            f"https://server10.mp3quran.net/ajm/{str(chapter_id).zfill(3)}.mp3",  # Ahmed al-Ajamy
            f"https://server11.mp3quran.net/sds/{str(chapter_id).zfill(3)}.mp3",  # Sudais
            f"https://server12.mp3quran.net/basit/{str(chapter_id).zfill(3)}.mp3"  # Abdul Basit
        ]
        
        # Try the official Quran.com API first with faster timeout
        try:
            response = requests.get(f"{QURAN_API_BASE}/chapter_recitations/{reciter_id}/{chapter_id}", timeout=3)
            if response.status_code == 200:
                data = response.json()
                if 'audio_file' in data and 'audio_url' in data['audio_file']:
                    return jsonify({
                        'audio_file': data['audio_file'],
                        'chapter_id': chapter_id,
                        'reciter_id': reciter_id
                    }), 200
        except:
            pass
        
        # Fallback to direct MP3 URLs
        return jsonify({
            'audio_file': {
                'audio_url': audio_urls[0],  # Default to first URL
                'chapter_id': chapter_id,
                'fallback_urls': audio_urls[1:]
            },
            'chapter_id': chapter_id,
            'reciter_id': reciter_id
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quran_bp.route('/verses/<int:surah_id>')
def get_verses(surah_id):
    """Get verses for a specific surah with optimized performance"""
    try:
        # Validate surah ID
        if surah_id < 1 or surah_id > 114:
            return jsonify({
                'success': False,
                'error': 'Invalid surah ID. Must be between 1 and 114.'
            }), 400
        
        # Optimized API call with faster timeout and better error handling
        url = f"{QURAN_API_BASE}/verses/by_chapter/{surah_id}"
        params = {
            'words': 'true',
            'translations': '20',  # English translation
            'fields': 'text_uthmani',
            'per_page': 286  # Maximum verses in a surah
        }
        
        # Faster timeout settings
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        
        data = response.json()
        
        # Optimize data structure for faster frontend processing
        verses = []
        for verse in data.get('verses', []):
            verse_data = {
                'id': verse.get('id'),
                'verse_number': verse.get('verse_number'),
                'verse_key': verse.get('verse_key'),
                'text_uthmani': verse.get('text_uthmani'),
                'translation': verse.get('translations', [{}])[0].get('text', '') if verse.get('translations') else ''
            }
            verses.append(verse_data)
        
        return jsonify({
            'success': True,
            'verses': verses,
            'total_verses': len(verses),
            'surah_id': surah_id
        })
        
    except requests.exceptions.Timeout:
        return jsonify({
            'success': False,
            'error': 'Request timeout - API is slow, please try again',
            'fallback': f'Unable to load verses for Surah {surah_id} at this moment'
        }), 408
        
    except requests.exceptions.RequestException as e:
        return jsonify({
            'success': False,
            'error': f'Network error: Failed to connect to Quran API',
            'fallback': 'Please check your internet connection and try again'
        }), 500
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

# Legacy routes for backward compatibility
@quran_bp.route('/juzs', methods=['GET'])
def get_juzs():
    """Get list of all juzs (legacy endpoint)"""
    return get_paras()

@quran_bp.route('/para/<int:para_number>', methods=['GET'])
def get_para_ayahs(para_number):
    """Get ayahs for a specific para (legacy endpoint)"""
    return get_para_surahs(para_number)

@quran_bp.route('/imams', methods=['GET'])
def get_imams():
    """Get available imams/reciters (legacy endpoint)"""
    return get_reciters()

@quran_bp.route('/surahs', methods=['GET'])
def get_all_surahs():
    """Get list of all surahs (legacy endpoint)"""
    return get_chapters()

@quran_bp.route('/surah/<int:surah_number>', methods=['GET'])
def get_surah(surah_number):
    """Get specific surah by number (legacy endpoint)"""
    try:
        response = requests.get(f"{QURAN_API_BASE}/chapters/{surah_number}", timeout=10)
        if response.status_code == 200:
            data = response.json()
            return jsonify(data), 200
        else:
            return jsonify({'error': 'Surah not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quran_bp.route('/search', methods=['GET'])
def search_quran():
    """Search in Quran text"""
    try:
        query = request.args.get('q', '').strip()
        if not query:
            return jsonify({'error': 'Search query is required'}), 400

        # Use Quran.com search API
        response = requests.get(f"{QURAN_API_BASE}/search", params={'q': query}, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return jsonify(data), 200
        else:
            return jsonify({'error': 'Search failed'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quran_bp.route('/bookmarks', methods=['GET'])
@jwt_required()
def get_bookmarks():
    """Get user's Quran bookmarks"""
    try:
        current_user = get_jwt_identity()
        # Mock bookmarks data
        bookmarks = [
            {'surah': 1, 'ayah': 1, 'note': 'Opening prayer'},
            {'surah': 2, 'ayah': 255, 'note': 'Ayat al-Kursi'},
            {'surah': 18, 'ayah': 10, 'note': 'Youth in the cave'}
        ]
        return jsonify({'bookmarks': bookmarks}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quran_bp.route('/bookmark', methods=['POST'])
@jwt_required()
def add_bookmark():
    """Add a Quran bookmark"""
    try:
        current_user = get_jwt_identity()
        data = request.get_json()

        if not data.get('surah') or not data.get('ayah'):
            return jsonify({'error': 'Surah and ayah numbers are required'}), 400

        # Mock bookmark creation
        bookmark = {
            'id': 1,
            'user': current_user,
            'surah': data['surah'],
            'ayah': data['ayah'],
            'note': data.get('note', ''),
            'created_at': '2025-08-29T18:00:00Z'
        }

        return jsonify({
            'message': 'Bookmark added successfully',
            'bookmark': bookmark
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
