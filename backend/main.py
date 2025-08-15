from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sys
import os
import uvicorn

# Ensure the parent directory is in sys.path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from model_utils import CareerRecommender

app = FastAPI(title="CareerGuide AI Backend")

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
    top_n: Optional[int] = 3

@app.post("/recommend")
def recommend(req: RecommendationRequest):
    recs = recommender.get_recommendations(
        req.user_input,
        top_n=req.top_n,
        domain=req.domain,
        level=req.level
    )
    # Format for frontend
    return [{
        "title": c['title'],
        "description": c['description'],
        "skills": c['skills'],
        "resources": c['resources'],
        "level": c['level'],
        "domain": c['domain'],
        "similarity": float(sim)
    } for c, sim in recs]

@app.get("/domains")
def get_domains():
    return recommender.get_all_domains()

@app.get("/levels")
def get_levels():
    return recommender.get_all_levels()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 