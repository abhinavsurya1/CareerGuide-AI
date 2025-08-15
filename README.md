# 🧠 CareerGuide.ai - AI-Powered Career Path Discovery

> **Transform your career journey with advanced AI and machine learning**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116.0-green)](https://fastapi.tiangolo.com/)
[![AI/ML](https://img.shields.io/badge/AI%2FML-SentenceTransformers-blue)](https://www.sbert.net/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## ✨ What's New in v2.0

### 🎨 **Complete UI Transformation**
- **Stunning Landing Page**: Hero section with custom animations and premium design
- **Modern Glassmorphism**: Backdrop blur effects, gradient borders, and smooth transitions
- **Interactive Elements**: Hover effects, micro-animations, and responsive design
- **Custom Color Scheme**: Unique indigo-purple-pink gradient theme

### 🚀 **Enhanced AI Capabilities**
- **Smart Input Processing**: Real-time analysis of user input with skill detection
- **Confidence Scoring**: AI confidence levels and input quality assessment
- **Advanced Matching**: Semantic understanding with skill match percentages
- **Comprehensive Insights**: Growth potential, salary ranges, and job outlook

### 📊 **Rich Career Data**
- **Match Reasons**: AI explains why each career matches the user
- **Skill Analysis**: Detailed skill matching with percentages
- **Market Insights**: Salary ranges, growth potential, and industry outlook
- **Learning Resources**: Curated educational materials for each career path

## 🏗️ Architecture

```
CareerGuide.ai/
├── frontend/                 # Next.js 15 + TypeScript + Tailwind CSS
│   ├── src/app/             # App router with modern React patterns
│   ├── public/              # Static assets and custom logo
│   └── package.json         # Frontend dependencies
├── backend/                  # FastAPI + Python AI backend
│   ├── main.py              # Enhanced API with career insights
│   ├── model_utils.py       # AI recommendation engine
│   ├── career_data.json     # Comprehensive career database
│   └── venv/                # Python virtual environment
└── README.md                # This file
```

## 🚀 Quick Start

### 1. **Clone & Setup**
```bash
git clone <your-repo-url>
cd "CareerGuide AI"
```

### 2. **Start Backend (FastAPI)**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. **Start Frontend (Next.js)**
```bash
cd frontend
npm run dev
```

### 4. **Open Your App**
Navigate to [http://localhost:3000](http://localhost:3000) 🎉

## 🔧 Features

### **Frontend (Next.js)**
- ✨ **Hero Landing Page**: Engaging introduction with smooth animations
- 🎯 **Smart Input Analysis**: Real-time skill and interest detection
- 📊 **Interactive Results**: Beautiful career cards with comprehensive data
- 📱 **Responsive Design**: Works perfectly on all devices
- 🎨 **Custom Animations**: Smooth transitions and micro-interactions

### **Backend (FastAPI)**
- 🤖 **AI-Powered Recommendations**: SentenceTransformer-based semantic matching
- 📈 **Enhanced Insights**: Confidence scores, skill matching, and market data
- 🔍 **Smart Filtering**: Domain and level-based career filtering
- 📊 **Comprehensive API**: Multiple endpoints for different use cases
- ⚡ **High Performance**: Fast response times with async processing

### **AI/ML Engine**
- 🧠 **Semantic Understanding**: Advanced NLP for text comprehension
- 🎯 **Smart Matching**: Cosine similarity with career profiles
- 📊 **Confidence Scoring**: Multi-factor assessment of recommendations
- 🔄 **Real-time Analysis**: Instant processing of user input

## 🎯 How It Works

### **1. User Input Processing**
- User describes their skills, interests, and goals
- AI analyzes input for skills, interests, and experience level
- Real-time confidence scoring and quality assessment

### **2. AI Recommendation Engine**
- Converts user input and career profiles to embeddings
- Calculates semantic similarity using advanced NLP
- Applies intelligent filtering and ranking

### **3. Enhanced Results**
- Comprehensive career insights with confidence scores
- Skill match percentages and growth potential
- Salary ranges and job market outlook
- Personalized learning resources

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Animations**: CSS keyframes and transitions

### **Backend**
- **FastAPI**: Modern Python web framework
- **Uvicorn**: ASGI server for high performance
- **Pydantic**: Data validation and serialization

### **AI/ML**
- **SentenceTransformers**: State-of-the-art NLP models
- **scikit-learn**: Machine learning utilities
- **NumPy/Pandas**: Data processing and analysis

## 📱 API Endpoints

### **Core Endpoints**
- `POST /recommend` - Get AI-powered career recommendations
- `GET /domains` - List available career domains
- `GET /levels` - List available career levels
- `GET /careers` - Get all career profiles
- `GET /insights/{career}` - Get detailed career insights
- `GET /health` - Health check endpoint

### **Enhanced Response Format**
```json
{
  "title": "Data Scientist",
  "confidence_score": 0.85,
  "skill_match_percentage": 75.0,
  "match_reasons": ["Your interests align with Technology domain"],
  "growth_potential": "Very High - Strong career progression",
  "salary_range": "$90K - $130K",
  "job_outlook": "Excellent - High demand, growing rapidly"
}
```

## 🎨 Customization

### **Themes & Colors**
- Modify `themeGradient` and `accentGradient` in `page.tsx`
- Customize color schemes in Tailwind classes
- Add new animations in the `<style jsx>` section

### **Career Data**
- Expand `career_data.json` with new careers
- Add more skills, keywords, and resources
- Customize domain and level categories

### **AI Parameters**
- Adjust confidence thresholds in the backend
- Modify skill matching algorithms
- Fine-tune similarity calculations

## 🚀 Deployment

### **Frontend (Vercel)**
```bash
cd frontend
npm run build
# Deploy to Vercel or your preferred platform
```

### **Backend (Cloud)**
```bash
cd backend
pip install -r requirements.txt
# Deploy to AWS, Google Cloud, or your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **FastAPI Community** for the high-performance Python framework
- **SentenceTransformers** for state-of-the-art NLP capabilities
- **Tailwind CSS** for the utility-first CSS framework

---

**Built with ❤️ using Next.js, FastAPI, and Advanced AI**

*Transform your career journey with the power of artificial intelligence* 🚀
