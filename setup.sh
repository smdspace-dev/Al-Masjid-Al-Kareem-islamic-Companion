#!/bin/bash

# Muslim Lifestyle App - Ancient Rich Islamic Companion
# Complete Setup Script for Flask + React Application

echo "🕌 Al-Masjid Al-Kareem - Ancient Rich Islamic Companion"
echo "======================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🚀 Starting complete application setup...${NC}"
echo ""

# Create virtual environment for backend
echo -e "${YELLOW}📦 Setting up Python virtual environment...${NC}"
cd backend
python -m venv venv

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

echo -e "${GREEN}✅ Virtual environment activated${NC}"

# Install Python dependencies
echo -e "${YELLOW}📚 Installing Python dependencies...${NC}"
pip install -r requirements.txt

echo -e "${GREEN}✅ Python dependencies installed${NC}"

# Initialize database
echo -e "${YELLOW}🗄️  Initializing database...${NC}"
python -c "
from app import create_tables
create_tables()
print('Database initialized successfully!')
"

# Install Node.js dependencies
echo -e "${YELLOW}📦 Installing Node.js dependencies...${NC}"
cd ../frontend
npm install

echo -e "${GREEN}✅ Node.js dependencies installed${NC}"

# Build frontend
echo -e "${YELLOW}🏗️  Building frontend...${NC}"
npm run build

echo -e "${GREEN}✅ Frontend built successfully${NC}"

cd ..

echo ""
echo -e "${PURPLE}🎉 Setup completed successfully!${NC}"
echo ""
echo -e "${CYAN}🔧 To start the application:${NC}"
echo ""
echo -e "${YELLOW}Backend (Flask):${NC}"
echo "cd backend"
echo "source venv/bin/activate  # On Windows: venv\Scripts\activate"
echo "python app.py"
echo ""
echo -e "${YELLOW}Frontend (React):${NC}"
echo "cd frontend"
echo "npm run dev"
echo ""
echo -e "${BLUE}📊 Default users:${NC}"
echo "Admin: admin / admin123"
echo "Arranger: organizer1 / org123"
echo "User: user1 / user123"
echo ""
echo -e "${GREEN}🌟 Application will be available at:${NC}"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo ""
echo -e "${PURPLE}✨ Enjoy your Ancient Rich Islamic Companion!${NC}"
