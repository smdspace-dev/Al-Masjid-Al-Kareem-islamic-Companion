# 🕌 Al-Masjid Al-Kareem 

>Islamic lifestyle application for Indian Muslims, featuring a rich ancient theme inspired by traditional Islamic art and architecture.

## ✨ Latest Updates (January 2025)

### 🕌 Enhanced Quran Module
- **Para-based Reading**: Browse the Holy Quran by Para (Juz) 1-30 for structured reading
- **Multiple Reciters**: Choose from 5 renowned Quran reciters including Mishari al-Afasy, Abdul Basit Abdul Samad, and Ahmed Al Ajmi
- **High-Quality Audio**: Stream crystal-clear audio recitations with play/stop controls
- **Improved Typography**: Enhanced Arabic text rendering with Amiri font for beautiful Quranic display
- **Backend API Integration**: Simplified and reliable API endpoints for better performance
- **Mobile Responsive**: Optimized for all screen sizes with touch-friendly controls

### 🔐 Authentication Enhancements
- **Guest Access**: Open access for basic features without requiring user registration
- **Admin Panel**: Enhanced admin dashboard for user and content management
- **Arranger Accounts**: Special accounts for community Ramadan arrangement coordinators
- **Secure JWT**: Improved token-based authentication system

### 🎨 UI/UX Improvements
- **Fixed Layout Issues**: Resolved sidebar overlapping problems for better navigation
- **Loading States**: Smooth loading spinners and better user feedback
- **Error Handling**: Robust error handling with fallback content
- **Dark Theme**: Consistent dark theme across all components for comfortable viewing

### 🛠 Technical Improvements
- **API Optimization**: Simplified API calls with proper error handling and fallbacks
- **CORS Configuration**: Enhanced cross-origin resource sharing for multiple ports
- **Module Organization**: Better code structure and component organization
- **Performance**: Faster loading times and smoother interactions

## ✨ Overview

Al-Masjid Al-Kareem is a comprehensive Islamic companion app designed specifically for the Indian Muslim community. It combines modern web technology with classical Islamic aesthetics, featuring a rich ancient theme with deep golds, royal blues, and ornate design elements reminiscent of Islamic manuscripts and palace decorations.

## 🎨 Ancient Rich Theme Features

### Visual Design
- **Color Palette**: Deep golds (#D4AF37), rich burgundy (#800020), royal navy (#1e3a8a), warm browns (#8B4513)
- **Typography**: Elegant Playfair Display for headings, Crimson Text for body, beautiful Amiri for Arabic text
- **UI Elements**: Ornate cards with golden borders, Islamic geometric patterns, luxury gradients
- **Animations**: Smooth transitions, golden glow effects, elegant hover states

### Cultural Elements
- Traditional Islamic geometric patterns
- Classical calligraphy styling
- Ornate borders and decorative elements
- Luxury textures and rich gradients
- Mosque and minaret iconography

## 🚀 Technology Stack

### Backend (Flask)
- **Framework**: Flask 2.3.3 with SQLAlchemy
- **Authentication**: JWT-based with role management
- **Database**: SQLite (development) / PostgreSQL (production)
- **APIs**: RESTful endpoints for all features
- **Security**: CORS, input validation, password hashing

### Frontend (React)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom ancient rich theme
- **Routing**: React Router for navigation
- **State Management**: Context API for authentication
- **HTTP Client**: Axios for API communication

## 🚀 Getting Started

### Quick Start

For Windows users, simply run the PowerShell script:

```powershell
.\StartApp.ps1
```

This will start both the backend and frontend servers and open the application in your browser.

### Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the Flask application:
   ```bash
   python app.py
   ```
   
   The backend will run on http://127.0.0.1:5000

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The frontend will run on http://localhost:3000

### Default Users

The application comes with pre-configured user accounts:

- **Admin User**
  - Username: `admin`
  - Password: `admin123`
  - Role: Administrator

- **Organizer User**
  - Username: `organizer1`
  - Password: `org123`
  - Role: Arranger (can create and manage arrangements)

### Troubleshooting

You can check the status of both servers using the test page:
http://localhost:3000/test.html

## 🌟 Core Features

### 🕌 Islamic Essentials
1. **Prayer Times**: Accurate times for 20+ Indian cities with beautiful displays
2. **Quran Reader**: Complete Quran with Arabic text, translations, and audio
3. **Qibla Compass**: Interactive compass pointing to Kaaba with precise calculations
4. **Hadith Library**: Searchable collection from Sahih Bukhari, Muslim, and others
5. **Islamic Calendar**: Hijri calendar with important Islamic dates for 2025
6. **Religious Guides**: Step-by-step guides for Ramadan, Hajj, Umrah, Namaz, Wudu

### 🌙 Special Ramadan Features
7. **Community Arrangements**: Interactive map of Sehri and Iftari events across India
8. **Google Maps Integration**: Pin locations with detailed information
9. **Role-based Management**: Admin approval system for community events
10. **Event Upload**: Arrangers can add new community arrangements

### 👑 Admin Features
11. **User Management**: Complete admin panel with role assignments
12. **Content Moderation**: Approve/reject community arrangements
13. **Analytics Dashboard**: User statistics and activity monitoring
14. **Role System**: Three levels - normal, arranger, admin

## 📱 Application Structure

```
muslim-lifestyle-flask-react/
├── backend/                    # Flask API server
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration settings
│   ├── models.py              # Database models
│   ├── routes/                # API route modules
│   │   ├── auth.py           # Authentication endpoints
│   │   ├── prayer.py         # Prayer times API
│   │   ├── quran.py          # Quran and bookmarks
│   │   ├── hadith.py         # Hadith collections
│   │   ├── arrangements.py   # Ramadan arrangements
│   │   └── admin.py          # Admin panel endpoints
│   └── requirements.txt       # Python dependencies
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context
│   │   ├── styles/          # CSS and styling
│   │   └── services/        # API services
│   ├── public/              # Static assets
│   ├── package.json         # Node.js dependencies
│   └── tailwind.config.js   # Tailwind configuration
├── database/                   # Database scripts
├── docs/                      # Documentation
├── setup.sh                  # Complete setup script
└── README.md                 # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+ 
- Node.js 16+
- Git

### Quick Setup
```bash
# Clone or extract the application
cd muslim-lifestyle-flask-react

# Run the complete setup script
chmod +x setup.sh
./setup.sh
```

### Manual Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python app.py
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Running the Application

### Development Mode
```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate
python app.py

# Terminal 2: Frontend  
cd frontend
npm run dev
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/health

## 👥 Default User Accounts

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| Admin | `admin` | `admin123` | Full system access |
| Arranger | `organizer1` | `org123` | Can upload arrangements |
| User | `user1` | `user123` | Basic app features |

## 🗺️ API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - User profile

### Prayer Times
- `GET /api/prayer/times/{city}` - Get prayer times for city
- `GET /api/prayer/cities` - List available cities
- `GET /api/prayer/current` - Current and next prayer

### Quran
- `GET /api/quran/surahs` - List all surahs
- `GET /api/quran/surah/{number}` - Get specific surah
- `GET /api/quran/search` - Search Quran text

### Hadith
- `GET /api/hadith/collections` - List collections
- `GET /api/hadith/search` - Search hadiths
- `GET /api/hadith/random` - Random hadith

### Arrangements
- `GET /api/arrangements/` - List arrangements
- `POST /api/arrangements/` - Create arrangement (arranger+)
- `GET /api/arrangements/map-data` - Map markers data

### Admin
- `GET /api/admin/users` - List all users (admin)
- `PUT /api/admin/users/{id}/role` - Update user role (admin)
- `GET /api/admin/dashboard` - Admin statistics

## 🎨 Customization

### Color Scheme
Modify the ancient rich color palette in `frontend/tailwind.config.js`:
```javascript
colors: {
  gold: { 500: '#D4AF37', 600: '#B8860B' },
  burgundy: { 500: '#800020' },
  royal: { 500: '#1e3a8a' }
}
```

### Adding Cities
Add prayer times for new cities in `backend/routes/prayer.py`:
```python
INDIAN_CITIES_PRAYER_TIMES = {
  'YourCity': {
    'Fajr': '05:00', 'Dhuhr': '12:15', 
    'Asr': '15:45', 'Maghrib': '18:30', 
    'Isha': '20:00', 'Sunrise': '06:30'
  }
}
```

## 🌍 Features by Indian Context

### Localization
- **Cities**: 20+ major Indian cities with accurate prayer times
- **Time Zones**: Proper handling of Indian Standard Time
- **Cultural Context**: References to Indian Islamic traditions
- **Community Focus**: Ramadan arrangements across Indian cities

### Indian Cities Supported
Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Lucknow, Ahmedabad, Pune, Jaipur, Surat, Kanpur, Nagpur, Patna, Indore, Thane, Bhopal, Visakhapatnam, Vadodara, Ghaziabad

## 📱 Mobile Responsiveness

The application is fully responsive with:
- Mobile-first design approach
- Touch-friendly interface
- Optimized performance for various devices
- Progressive Web App capabilities

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- SQL injection prevention

## 🚀 Deployment Options

### Local Development
- Built-in Flask development server
- Vite development server with hot reload
- SQLite database for quick setup

### Production Deployment
- **Backend**: Gunicorn + Nginx
- **Frontend**: Static build files
- **Database**: PostgreSQL
- **Cloud**: AWS, Google Cloud, DigitalOcean

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Islamic APIs**: Aladhan.com, Al Quran Cloud, Hadith API
- **Design Inspiration**: Classical Islamic art and architecture
- **Community**: Indian Muslim developers and users
- **Typography**: Google Fonts (Amiri, Playfair Display, Crimson Text)

## 🆘 Support & Contact

- **Issues**: Create an issue on GitHub
- **Email**: support@al-masjid-al-kareem.com
- **Documentation**: Check the `/docs` folder
- **Community**: Join our Discord server

## 📈 Roadmap

### Upcoming Features
- [ ] Multiple language support (Hindi, Urdu, Arabic)
- [ ] Offline functionality with PWA
- [ ] Push notifications for prayer times
- [ ] Social features and community discussions
- [ ] Islamic finance calculator
- [ ] Zakat calculator
- [ ] Mosque finder with reviews
- [ ] Islamic events calendar
- [ ] Dua collections
- [ ] Tafsir integration

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added Ramadan arrangements
- **v1.2.0** - Enhanced ancient rich theme
- **v1.3.0** - Admin panel and user management

---

**✨ Experience the beauty of classical Islamic design with modern functionality**

*"And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose."* - Quran 65:3

Made with ❤️ for the Muslim Ummah
