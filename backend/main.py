from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import sys
import os
import uvicorn
import json

# Ensure the parent directory is in sys.path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from model_utils import CareerRecommender

app = FastAPI(
    title="CareerGuide AI Backend",
    description="Advanced AI-powered career recommendation system with semantic understanding",
    version="2.0.0"
)

# Allow CORS for local frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

recommender = CareerRecommender()

class RecommendationRequest(BaseModel):
    user_input: str
    domain: Optional[str] = None
    level: Optional[str] = None
    top_n: Optional[int] = 6
    min_confidence: Optional[float] = 0.3

class CareerInsight(BaseModel):
    title: str
    description: str
    skills: List[str]
    resources: List[Dict[str, str]]
    level: str
    domain: str
    similarity: float
    confidence_score: float
    match_reasons: List[str]
    skill_match_percentage: float
    growth_potential: str
    salary_range: str
    job_outlook: str

@app.get("/")
def root():
    return {
        "message": "CareerGuide AI Backend",
        "version": "2.0.0",
        "status": "running",
        "endpoints": [
            "/recommend - Get career recommendations",
            "/domains - Get available domains",
            "/levels - Get available levels",
            "/careers - Get all career profiles",
            "/insights/{career_title} - Get detailed career insights"
        ]
    }

@app.post("/recommend", response_model=List[CareerInsight])
def recommend(req: RecommendationRequest):
    """Get AI-powered career recommendations with enhanced insights."""
    try:
        # Get base recommendations
        recs = recommender.get_recommendations(
            req.user_input,
            top_n=req.top_n,
            domain=req.domain,
            level=req.level
        )
        
        # Filter by minimum confidence if specified
        if req.min_confidence:
            recs = [(c, s) for c, s in recs if s >= req.min_confidence]
        
        # Enhance recommendations with additional insights
        enhanced_recs = []
        for career, similarity in recs:
            insight = create_career_insight(career, similarity, req.user_input)
            enhanced_recs.append(insight)
        
        return enhanced_recs
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

def create_career_insight(career: Dict[str, Any], similarity: float, user_input: str) -> CareerInsight:
    """Create enhanced career insights with additional analysis."""
    
    # Calculate skill match percentage
    user_skills = extract_user_skills(user_input)
    career_skills = set(skill.lower() for skill in career['skills'])
    skill_matches = sum(1 for skill in user_skills if skill.lower() in career_skills)
    skill_match_percentage = (skill_matches / len(career_skills)) * 100 if career_skills else 0
    
    # Generate match reasons
    match_reasons = generate_match_reasons(career, user_input, similarity)
    
    # Determine growth potential based on domain and level
    growth_potential = determine_growth_potential(career['domain'], career['level'])
    
    # Estimate salary range
    salary_range = estimate_salary_range(career['domain'], career['level'])
    
    # Determine job outlook
    job_outlook = determine_job_outlook(career['domain'])
    
    # Calculate confidence score (combination of similarity and skill match)
    confidence_score = (similarity * 0.7) + (skill_match_percentage / 100 * 0.3)
    
    return CareerInsight(
        title=career['title'],
        description=career['description'],
        skills=career['skills'],
        resources=career['resources'],
        level=career['level'],
        domain=career['domain'],
        similarity=similarity,
        confidence_score=round(confidence_score, 3),
        match_reasons=match_reasons,
        skill_match_percentage=round(skill_match_percentage, 1),
        growth_potential=growth_potential,
        salary_range=salary_range,
        job_outlook=job_outlook
    )

def extract_user_skills(user_input: str) -> List[str]:
    """Extract skills mentioned in user input."""
    skill_keywords = [
        'python', 'javascript', 'java', 'react', 'node', 'sql', 'machine learning',
        'data analysis', 'statistics', 'design', 'ui', 'ux', 'product management',
        'agile', 'leadership', 'communication', 'research', 'prototyping',
        'excel', 'tableau', 'powerbi', 'r', 'matlab', 'tensorflow', 'pytorch'
    ]
    
    user_input_lower = user_input.lower()
    return [skill for skill in skill_keywords if skill in user_input_lower]

def generate_match_reasons(career: Dict[str, Any], user_input: str, similarity: float) -> List[str]:
    """Generate reasons why this career matches the user."""
    reasons = []
    user_input_lower = user_input.lower()
    
    # Check for domain match
    if career['domain'].lower() in user_input_lower:
        reasons.append(f"Your interests align with {career['domain']} domain")
    
    # Check for skill matches
    user_skills = extract_user_skills(user_input)
    career_skills = [skill.lower() for skill in career['skills']]
    matching_skills = [skill for skill in user_skills if skill in career_skills]
    
    if matching_skills:
        reasons.append(f"You have relevant skills: {', '.join(matching_skills[:3])}")
    
    # Check for level appropriateness
    if 'beginner' in user_input_lower and career['level'] == 'Beginner':
        reasons.append("Perfect for your experience level")
    elif 'advanced' in user_input_lower and career['level'] == 'Advanced':
        reasons.append("Matches your advanced skill level")
    
    # Add similarity-based reason
    if similarity > 0.8:
        reasons.append("Excellent semantic match with your profile")
    elif similarity > 0.6:
        reasons.append("Strong alignment with your interests")
    else:
        reasons.append("Good potential match based on your input")
    
    return reasons[:3]  # Limit to top 3 reasons

def determine_growth_potential(domain: str, level: str) -> str:
    """Determine growth potential for a career."""
    if domain == "Technology":
        if level == "Beginner":
            return "High - Rapid advancement opportunities"
        elif level == "Intermediate":
            return "Very High - Strong career progression"
        else:
            return "Excellent - Leadership and specialization paths"
    elif domain == "Finance":
        return "High - Stable industry with growth potential"
    elif domain == "Design":
        return "Medium-High - Creative field with expanding opportunities"
    elif domain == "Business":
        return "High - Versatile skills transfer across industries"
    else:
        return "Medium - Steady growth with industry trends"

def estimate_salary_range(domain: str, level: str) -> str:
    """Estimate salary range for a career."""
    if domain == "Technology":
        if level == "Beginner":
            return "$60K - $90K"
        elif level == "Intermediate":
            return "$90K - $130K"
        else:
            return "$130K - $200K+"
    elif domain == "Finance":
        if level == "Beginner":
            return "$50K - $80K"
        elif level == "Intermediate":
            return "$80K - $120K"
        else:
            return "$120K - $180K+"
    elif domain == "Design":
        if level == "Beginner":
            return "$45K - $70K"
        elif level == "Intermediate":
            return "$70K - $100K"
        else:
            return "$100K - $150K+"
    else:
        if level == "Beginner":
            return "$40K - $70K"
        elif level == "Intermediate":
            return "$70K - $110K"
        else:
            return "$110K - $160K+"

def determine_job_outlook(domain: str) -> str:
    """Determine job outlook for a domain."""
    if domain == "Technology":
        return "Excellent - High demand, growing rapidly"
    elif domain == "Finance":
        return "Good - Stable demand with digital transformation"
    elif domain == "Design":
        return "Good - Increasing demand for UX/UI skills"
    elif domain == "Business":
        return "Good - Consistent demand across industries"
    else:
        return "Stable - Consistent demand with moderate growth"

@app.get("/domains")
def get_domains():
    """Get list of all available career domains."""
    return {
        "domains": recommender.get_all_domains(),
        "count": len(recommender.get_all_domains())
    }

@app.get("/levels")
def get_levels():
    """Get list of all available career levels."""
    return {
        "levels": recommender.get_all_levels(),
        "count": len(recommender.get_all_levels())
    }

@app.get("/careers")
def get_all_careers():
    """Get all career profiles."""
    return {
        "careers": recommender.career_data,
        "total": len(recommender.career_data)
    }

@app.get("/insights/{career_title}")
def get_career_insights(career_title: str):
    """Get detailed insights for a specific career."""
    career = None
    for c in recommender.career_data:
        if c['title'].lower() == career_title.lower():
            career = c
            break
    
    if not career:
        raise HTTPException(status_code=404, detail="Career not found")
    
    # Create detailed insights
    insight = create_career_insight(career, 0.8, "")  # Default similarity for single career view
    
    return insight

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": hasattr(recommender, 'model'),
        "careers_loaded": len(recommender.career_data) > 0,
        "timestamp": "2024-01-01T00:00:00Z"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 