-- Muslim Lifestyle App - Database Initialization
-- Creates all necessary tables with sample data

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'normal',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prayer times table
CREATE TABLE IF NOT EXISTS prayer_times (
    id SERIAL PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    fajr VARCHAR(8) NOT NULL,
    dhuhr VARCHAR(8) NOT NULL,
    asr VARCHAR(8) NOT NULL,
    maghrib VARCHAR(8) NOT NULL,
    isha VARCHAR(8) NOT NULL,
    sunrise VARCHAR(8) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    method VARCHAR(20) DEFAULT 'ISNA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ramadan arrangements table
CREATE TABLE IF NOT EXISTS arrangements (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Sehri', 'Iftari', 'Taraweeh', 'Other')),
    location VARCHAR(255) NOT NULL,
    description TEXT,
    organizer VARCHAR(100),
    contact VARCHAR(100),
    map_link TEXT,
    coordinates JSON,
    user_id INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quran surahs table
CREATE TABLE IF NOT EXISTS quran_surahs (
    number INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    english_name VARCHAR(100) NOT NULL,
    number_of_ayahs INTEGER NOT NULL,
    revelation_type VARCHAR(20) CHECK (revelation_type IN ('Meccan', 'Medinan')),
    para INTEGER NOT NULL
);

-- Quran ayahs table
CREATE TABLE IF NOT EXISTS quran_ayahs (
    id SERIAL PRIMARY KEY,
    surah_number INTEGER REFERENCES quran_surahs(number),
    ayah_number INTEGER NOT NULL,
    arabic_text TEXT NOT NULL,
    translation TEXT NOT NULL,
    transliteration TEXT,
    para INTEGER NOT NULL,
    audio_url VARCHAR(255)
);

-- Imam voices table
CREATE TABLE IF NOT EXISTS imams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    audio_path VARCHAR(255) NOT NULL
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    content_type VARCHAR(20) NOT NULL,
    content_id VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    dark_mode BOOLEAN DEFAULT TRUE,
    language VARCHAR(10) DEFAULT 'en',
    notifications JSON,
    prayer_method VARCHAR(50) DEFAULT 'ISNA',
    location VARCHAR(100),
    preferred_imam_id INTEGER REFERENCES imams(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default users
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@muslim-app.com', 'pbkdf2:sha256:260000$1234567890$abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890', 'admin'),
('organizer1', 'org1@muslim-app.com', 'pbkdf2:sha256:260000$1234567890$abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890', 'arranger'),
('user1', 'user1@muslim-app.com', 'pbkdf2:sha256:260000$1234567890$abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890', 'normal')
ON CONFLICT (username) DO NOTHING;

-- Insert sample prayer times
INSERT INTO prayer_times (city, fajr, dhuhr, asr, maghrib, isha, sunrise) VALUES
('Delhi', '04:25', '12:10', '15:45', '18:30', '20:00', '06:15'),
('Mumbai', '05:15', '12:25', '16:00', '18:45', '20:15', '06:45'),
('Bengaluru', '05:20', '12:20', '15:50', '18:40', '20:10', '06:30');

-- Insert sample arrangements
INSERT INTO arrangements (type, location, description, organizer, contact, map_link, coordinates, user_id, is_approved) VALUES
('Sehri', 'Jama Masjid, Delhi', 'Free traditional Sehri with parathas and lassi, 4:00 AM daily', 'Delhi Muslim Community', '+91-11-23456789', 'https://maps.google.com/?q=28.6507,77.2334', '{"lat": 28.6507, "lng": 77.2334}', 2, TRUE),
('Iftari', 'Mohammed Ali Road, Mumbai', 'Grand community Iftari with dates, samosas, and biryani, 6:30 PM', 'Mumbai Muslim Welfare', '+91-22-23456789', 'https://maps.google.com/?q=18.9641,72.8270', '{"lat": 18.9641, "lng": 72.8270}', 2, TRUE);

-- Insert sample imams
INSERT INTO imams (name, description, audio_path) VALUES
('Sheikh Abdul Rahman Al-Sudais', 'Imam of the Grand Mosque in Mecca', '/audio/imams/imam1/'),
('Sheikh Mishari Rashid al-Afasy', 'Renowned Kuwaiti Quran reciter', '/audio/imams/imam2/'),
('Sheikh Muhammad Siddiq Al-Minshawi', 'Famous Egyptian Quran reciter', '/audio/imams/imam3/'),
('Sheikh Maher Al-Muaiqly', 'Imam of the Grand Mosque in Mecca', '/audio/imams/imam4/'),
('Sheikh Saad Al-Ghamdi', 'Saudi Arabian Quran reciter', '/audio/imams/imam5/');

-- Insert sample surahs for each para (1-30)
INSERT INTO quran_surahs (number, name, english_name, number_of_ayahs, revelation_type, para) VALUES
(1, 'الفاتحة', 'Al-Fatiha', 7, 'Meccan', 1),
(2, 'البقرة', 'Al-Baqara', 286, 'Medinan', 1),
(2, 'البقرة', 'Al-Baqara', 286, 'Medinan', 2),
(2, 'البقرة', 'Al-Baqara', 286, 'Medinan', 3),
(3, 'آل عمران', 'Ali 'Imran', 200, 'Medinan', 3),
(3, 'آل عمران', 'Ali 'Imran', 200, 'Medinan', 4),
(4, 'النساء', 'An-Nisa', 176, 'Medinan', 4),
(4, 'النساء', 'An-Nisa', 176, 'Medinan', 5),
(4, 'النساء', 'An-Nisa', 176, 'Medinan', 6),
(5, 'المائدة', 'Al-Ma\'ida', 120, 'Medinan', 6),
(5, 'المائدة', 'Al-Ma\'ida', 120, 'Medinan', 7),
(6, 'الأنعام', 'Al-An\'am', 165, 'Meccan', 7),
(6, 'الأنعام', 'Al-An\'am', 165, 'Meccan', 8),
(7, 'الأعراف', 'Al-A\'raf', 206, 'Meccan', 8),
(7, 'الأعراف', 'Al-A\'raf', 206, 'Meccan', 9),
(8, 'الأنفال', 'Al-Anfal', 75, 'Medinan', 9),
(8, 'الأنفال', 'Al-Anfal', 75, 'Medinan', 10),
(9, 'التوبة', 'At-Tawba', 129, 'Medinan', 10),
(9, 'التوبة', 'At-Tawba', 129, 'Medinan', 11),
(10, 'يونس', 'Yunus', 109, 'Meccan', 11),
(11, 'هود', 'Hud', 123, 'Meccan', 11),
(11, 'هود', 'Hud', 123, 'Meccan', 12),
(12, 'يوسف', 'Yusuf', 111, 'Meccan', 12),
(12, 'يوسف', 'Yusuf', 111, 'Meccan', 13),
(13, 'الرعد', 'Ar-Ra\'d', 43, 'Medinan', 13),
(14, 'إبراهيم', 'Ibrahim', 52, 'Meccan', 13),
(15, 'الحجر', 'Al-Hijr', 99, 'Meccan', 14),
(16, 'النحل', 'An-Nahl', 128, 'Meccan', 14),
(17, 'الإسراء', 'Al-Isra', 111, 'Meccan', 15),
(18, 'الكهف', 'Al-Kahf', 110, 'Meccan', 15),
(18, 'الكهف', 'Al-Kahf', 110, 'Meccan', 16),
(19, 'مريم', 'Maryam', 98, 'Meccan', 16),
(20, 'طه', 'Ta-Ha', 135, 'Meccan', 16),
(21, 'الأنبياء', 'Al-Anbya', 112, 'Meccan', 17),
(22, 'الحج', 'Al-Hajj', 78, 'Medinan', 17),
(23, 'المؤمنون', 'Al-Mu\'minun', 118, 'Meccan', 18),
(24, 'النور', 'An-Nur', 64, 'Medinan', 18),
(25, 'الفرقان', 'Al-Furqan', 77, 'Meccan', 19),
(26, 'الشعراء', 'Ash-Shu\'ara', 227, 'Meccan', 19),
(27, 'النمل', 'An-Naml', 93, 'Meccan', 19),
(27, 'النمل', 'An-Naml', 93, 'Meccan', 20),
(28, 'القصص', 'Al-Qasas', 88, 'Meccan', 20),
(29, 'العنكبوت', 'Al-\'Ankabut', 69, 'Meccan', 20),
(29, 'العنكبوت', 'Al-\'Ankabut', 69, 'Meccan', 21),
(30, 'الروم', 'Ar-Rum', 60, 'Meccan', 21),
(31, 'لقمان', 'Luqman', 34, 'Meccan', 21),
(32, 'السجدة', 'As-Sajda', 30, 'Meccan', 21),
(33, 'الأحزاب', 'Al-Ahzab', 73, 'Medinan', 21),
(33, 'الأحزاب', 'Al-Ahzab', 73, 'Medinan', 22),
(34, 'سبإ', 'Saba', 54, 'Meccan', 22),
(35, 'فاطر', 'Fatir', 45, 'Meccan', 22),
(36, 'يس', 'Ya-Sin', 83, 'Meccan', 22),
(36, 'يس', 'Ya-Sin', 83, 'Meccan', 23),
(37, 'الصافات', 'As-Saffat', 182, 'Meccan', 23),
(38, 'ص', 'Sad', 88, 'Meccan', 23),
(39, 'الزمر', 'Az-Zumar', 75, 'Meccan', 23),
(39, 'الزمر', 'Az-Zumar', 75, 'Meccan', 24),
(40, 'غافر', 'Ghafir', 85, 'Meccan', 24),
(41, 'فصلت', 'Fussilat', 54, 'Meccan', 24),
(41, 'فصلت', 'Fussilat', 54, 'Meccan', 25),
(42, 'الشورى', 'Ash-Shura', 53, 'Meccan', 25),
(43, 'الزخرف', 'Az-Zukhruf', 89, 'Meccan', 25),
(44, 'الدخان', 'Ad-Dukhan', 59, 'Meccan', 25),
(45, 'الجاثية', 'Al-Jathiya', 37, 'Meccan', 25),
(46, 'الأحقاف', 'Al-Ahqaf', 35, 'Meccan', 26),
(47, 'محمد', 'Muhammad', 38, 'Medinan', 26),
(48, 'الفتح', 'Al-Fath', 29, 'Medinan', 26),
(49, 'الحجرات', 'Al-Hujurat', 18, 'Medinan', 26),
(50, 'ق', 'Qaf', 45, 'Meccan', 26),
(51, 'الذاريات', 'Adh-Dhariyat', 60, 'Meccan', 26),
(51, 'الذاريات', 'Adh-Dhariyat', 60, 'Meccan', 27),
(52, 'الطور', 'At-Tur', 49, 'Meccan', 27),
(53, 'النجم', 'An-Najm', 62, 'Meccan', 27),
(54, 'القمر', 'Al-Qamar', 55, 'Meccan', 27),
(55, 'الرحمن', 'Ar-Rahman', 78, 'Medinan', 27),
(56, 'الواقعة', 'Al-Waqi\'a', 96, 'Meccan', 27),
(57, 'الحديد', 'Al-Hadid', 29, 'Medinan', 27),
(58, 'المجادلة', 'Al-Mujadila', 22, 'Medinan', 28),
(59, 'الحشر', 'Al-Hashr', 24, 'Medinan', 28),
(60, 'الممتحنة', 'Al-Mumtahina', 13, 'Medinan', 28),
(61, 'الصف', 'As-Saf', 14, 'Medinan', 28),
(62, 'الجمعة', 'Al-Jumu\'a', 11, 'Medinan', 28),
(63, 'المنافقون', 'Al-Munafiqun', 11, 'Medinan', 28),
(64, 'التغابن', 'At-Taghabun', 18, 'Medinan', 28),
(65, 'الطلاق', 'At-Talaq', 12, 'Medinan', 28),
(66, 'التحريم', 'At-Tahrim', 12, 'Medinan', 28),
(67, 'الملك', 'Al-Mulk', 30, 'Meccan', 29),
(68, 'القلم', 'Al-Qalam', 52, 'Meccan', 29),
(69, 'الحاقة', 'Al-Haaqqa', 52, 'Meccan', 29),
(70, 'المعارج', 'Al-Ma\'arij', 44, 'Meccan', 29),
(71, 'نوح', 'Nuh', 28, 'Meccan', 29),
(72, 'الجن', 'Al-Jinn', 28, 'Meccan', 29),
(73, 'المزمل', 'Al-Muzzammil', 20, 'Meccan', 29),
(74, 'المدثر', 'Al-Muddathir', 56, 'Meccan', 29),
(75, 'القيامة', 'Al-Qiyama', 40, 'Meccan', 29),
(76, 'الانسان', 'Al-Insan', 31, 'Medinan', 29),
(77, 'المرسلات', 'Al-Mursalat', 50, 'Meccan', 29),
(78, 'النبإ', 'An-Naba', 40, 'Meccan', 30),
(79, 'النازعات', 'An-Nazi\'at', 46, 'Meccan', 30),
(80, 'عبس', '\'Abasa', 42, 'Meccan', 30),
(81, 'التكوير', 'At-Takwir', 29, 'Meccan', 30),
(82, 'الإنفطار', 'Al-Infitar', 19, 'Meccan', 30),
(83, 'المطففين', 'Al-Mutaffifin', 36, 'Meccan', 30),
(84, 'الإنشقاق', 'Al-Inshiqaq', 25, 'Meccan', 30),
(85, 'البروج', 'Al-Buruj', 22, 'Meccan', 30),
(86, 'الطارق', 'At-Tariq', 17, 'Meccan', 30),
(87, 'الأعلى', 'Al-A\'la', 19, 'Meccan', 30),
(88, 'الغاشية', 'Al-Ghashiya', 26, 'Meccan', 30),
(89, 'الفجر', 'Al-Fajr', 30, 'Meccan', 30),
(90, 'البلد', 'Al-Balad', 20, 'Meccan', 30),
(91, 'الشمس', 'Ash-Shams', 15, 'Meccan', 30),
(92, 'الليل', 'Al-Layl', 21, 'Meccan', 30),
(93, 'الضحى', 'Ad-Dhuha', 11, 'Meccan', 30),
(94, 'الشرح', 'Ash-Sharh', 8, 'Meccan', 30),
(95, 'التين', 'At-Tin', 8, 'Meccan', 30),
(96, 'العلق', 'Al-\'Alaq', 19, 'Meccan', 30),
(97, 'القدر', 'Al-Qadr', 5, 'Meccan', 30),
(98, 'البينة', 'Al-Bayyina', 8, 'Medinan', 30),
(99, 'الزلزلة', 'Az-Zalzala', 8, 'Medinan', 30),
(100, 'العاديات', 'Al-\'Adiyat', 11, 'Meccan', 30),
(101, 'القارعة', 'Al-Qari\'a', 11, 'Meccan', 30),
(102, 'التكاثر', 'At-Takathur', 8, 'Meccan', 30),
(103, 'العصر', 'Al-\'Asr', 3, 'Meccan', 30),
(104, 'الهمزة', 'Al-Humaza', 9, 'Meccan', 30),
(105, 'الفيل', 'Al-Fil', 5, 'Meccan', 30),
(106, 'قريش', 'Quraysh', 4, 'Meccan', 30),
(107, 'الماعون', 'Al-Ma\'un', 7, 'Meccan', 30),
(108, 'الكوثر', 'Al-Kawthar', 3, 'Meccan', 30),
(109, 'الكافرون', 'Al-Kafirun', 6, 'Meccan', 30),
(110, 'النصر', 'An-Nasr', 3, 'Medinan', 30),
(111, 'المسد', 'Al-Masad', 5, 'Meccan', 30),
(112, 'الإخلاص', 'Al-Ikhlas', 4, 'Meccan', 30),
(113, 'الفلق', 'Al-Falaq', 5, 'Meccan', 30),
(114, 'الناس', 'An-Nas', 6, 'Meccan', 30);

-- Add audio file path pattern (Note: actual audio files will need to be organized in this structure)
-- Audio file structure: /audio/imams/imam1/001.mp3, 002.mp3, etc. (for Surah 1, 2, etc.)
