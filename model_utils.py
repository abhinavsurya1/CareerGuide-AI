import json
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class CareerRecommender:
    def __init__(self):
        # Load the sentence transformer model
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Load career data
        with open('career_data.json', 'r') as f:
            self.career_data = json.load(f)['careers']
        
        # Pre-compute embeddings for all careers
        self.career_embeddings = self._compute_career_embeddings()
    
    def _compute_career_embeddings(self):
        """Compute embeddings for all career descriptions and keywords."""
        career_texts = []
        for career in self.career_data:
            # Combine title, description, and keywords for better matching
            text = f"{career['title']} {career['description']} {' '.join(career['keywords'])}"
            career_texts.append(text)
        
        return self.model.encode(career_texts)
    
    def get_recommendations(self, user_input, top_n=3, domain=None, level=None):
        """Get career recommendations based on user input and optional filters."""
        # Compute embedding for user input
        user_embedding = self.model.encode([user_input])[0]
        
        # Calculate similarities
        similarities = cosine_similarity([user_embedding], self.career_embeddings)[0]
        
        # Create list of (career, similarity) tuples
        career_similarities = list(zip(self.career_data, similarities))
        
        # Apply filters if specified
        if domain:
            career_similarities = [(c, s) for c, s in career_similarities if c['domain'] == domain]
        if level:
            career_similarities = [(c, s) for c, s in career_similarities if c['level'] == level]
        
        # Sort by similarity score
        career_similarities.sort(key=lambda x: x[1], reverse=True)
        
        # Return top N recommendations
        return career_similarities[:top_n]
    
    def get_all_domains(self):
        """Get list of all available domains."""
        return list(set(career['domain'] for career in self.career_data))
    
    def get_all_levels(self):
        """Get list of all available career levels."""
        return list(set(career['level'] for career in self.career_data)) 