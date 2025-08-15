"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const themeGradient = "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900";
const accentGradient = "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600";

export default function Home() {
  const [step, setStep] = useState(1);
  const [userInput, setUserInput] = useState("");
  const [domain, setDomain] = useState("");
  const [level, setLevel] = useState("");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [showHero, setShowHero] = useState(true);

  // Smart input processing
  const [inputAnalysis, setInputAnalysis] = useState({
    skills: [] as string[],
    interests: [] as string[],
    experience: "",
    confidence: 0
  });

  useEffect(() => {
    if (userInput.length > 10) {
      analyzeInput(userInput);
    }
  }, [userInput]);

  const analyzeInput = (input: string) => {
    const skills = extractSkills(input);
    const interests = extractInterests(input);
    const experience = determineExperienceLevel(input);
    const confidence = calculateConfidence(input);
    
    setInputAnalysis({ skills, interests, experience, confidence });
  };

  const extractSkills = (input: string): string[] => {
    const skillKeywords = [
      'python', 'javascript', 'java', 'react', 'node', 'sql', 'machine learning',
      'data analysis', 'statistics', 'design', 'ui', 'ux', 'product management',
      'agile', 'leadership', 'communication', 'research', 'prototyping'
    ];
    
    return skillKeywords.filter(skill => 
      input.toLowerCase().includes(skill.toLowerCase())
    );
  };

  const extractInterests = (input: string): string[] => {
    const interestKeywords = [
      'data', 'technology', 'finance', 'design', 'business', 'science',
      'art', 'healthcare', 'education', 'marketing', 'sales', 'engineering'
    ];
    
    return interestKeywords.filter(interest => 
      input.toLowerCase().includes(interest.toLowerCase())
    );
  };

  const determineExperienceLevel = (input: string): string => {
    const inputLower = input.toLowerCase();
    if (inputLower.includes('beginner') || inputLower.includes('new') || inputLower.includes('start')) return 'Beginner';
    if (inputLower.includes('advanced') || inputLower.includes('expert') || inputLower.includes('senior')) return 'Advanced';
    return 'Intermediate';
  };

  const calculateConfidence = (input: string): number => {
    const length = input.length;
    const hasSkills = inputAnalysis.skills.length > 0;
    const hasInterests = inputAnalysis.interests.length > 0;
    
    let confidence = Math.min(length / 50, 1) * 0.4; // 40% for length
    if (hasSkills) confidence += 0.3; // 30% for skills
    if (hasInterests) confidence += 0.3; // 30% for interests
    
    return Math.round(confidence * 100);
  };

  async function getRecommendations() {
    setLoading(true);
    setError("");
    setRecommendations([]);
    setShowHero(false);
    
    try {
      const res = await fetch("http://localhost:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_input: userInput,
          domain: domain || null,
          level: level || null,
          top_n: 6,
        }),
      });
      
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      const data = await res.json();
      setRecommendations(data);
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-400";
    if (confidence >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return "Excellent";
    if (confidence >= 60) return "Good";
    return "Fair";
  };

  return (
    <div className={`min-h-screen w-full ${themeGradient} text-white overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      {showHero && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo */}
            <div className="mb-8 animate-fade-in">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-3xl font-bold">🧠</span>
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-slide-up">
              CareerGuide.ai
            </h1>
            
            {/* Subtitle */}
            <h2 className="text-2xl md:text-3xl font-light mb-8 text-gray-300 animate-slide-up delay-200">
              Discover Your Perfect Career Path with AI
            </h2>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-300">
              Our advanced AI analyzes your skills, interests, and goals to provide personalized career recommendations. 
              Get insights from real-world data and expert-curated learning resources.
            </p>
            
            {/* CTA Button */}
            <button
              onClick={() => setShowHero(false)}
              className={`px-8 py-4 rounded-full ${accentGradient} text-white font-bold text-lg shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 animate-slide-up delay-400`}
            >
              Start Your Journey →
            </button>
          </div>
        </div>
      )}

      {/* Main App */}
      {!showHero && (
        <div className="relative z-10 min-h-screen py-12 px-4">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              CareerGuide.ai
            </h1>
            <p className="text-xl text-gray-300">Your AI Career Companion</p>
          </header>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            {/* Step 1: User Input */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-slate-600/30 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-center text-white">Tell Us About Yourself</h3>
              
              {/* Smart Input Analysis */}
              {userInput.length > 10 && (
                <div className="mb-6 p-6 bg-gradient-to-r from-slate-700/80 to-slate-600/80 rounded-2xl border border-slate-500/40 shadow-lg">
                  <h4 className="text-lg font-semibold mb-4 text-cyan-300">AI Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <span className="text-sm text-gray-400 mb-2 block">Skills Detected:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {inputAnalysis.skills.length > 0 ? (
                          inputAnalysis.skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-cyan-500/30 text-cyan-200 rounded-full text-sm border border-cyan-400/30">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">No specific skills detected</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400 mb-2 block">Interests:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {inputAnalysis.interests.map((interest, idx) => (
                          <span key={idx} className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm border border-purple-400/30">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400 mb-2 block">Experience Level:</span>
                      <div className="mt-2">
                        <span className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-sm border border-blue-400/30">
                          {inputAnalysis.experience}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm text-gray-400">Input Quality:</span>
                    <span className={`font-semibold ${getConfidenceColor(inputAnalysis.confidence)}`}>
                      {getConfidenceText(inputAnalysis.confidence)} ({inputAnalysis.confidence}%)
                    </span>
                  </div>
                </div>
              )}
              
              <textarea
                className={`w-full rounded-2xl p-6 text-black text-lg focus:outline-none transition-all duration-300 ${
                  inputFocused ? 'ring-4 ring-cyan-400/50 shadow-2xl' : 'ring-2 ring-gray-300'
                }`}
                rows={4}
                placeholder="Describe your skills, interests, experience, and career goals... (e.g., I'm passionate about data science, have 2 years of Python experience, and want to work in fintech)"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
              
              {/* Character Count & Quality Indicator */}
              <div className="flex justify-between items-center mt-3 text-sm text-gray-400">
                <span>{userInput.length} characters</span>
                {userInput.length > 0 && (
                  <span className={getConfidenceColor(inputAnalysis.confidence)}>
                    {inputAnalysis.confidence}% quality
                  </span>
                )}
              </div>
            </div>

            {/* Step 2: Filters */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-slate-600/30 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-center text-white">Refine Your Search</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-3 font-semibold text-lg text-gray-200">Domain Preference</label>
                  <select 
                    className="w-full rounded-2xl p-4 text-black text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white shadow-lg"
                    value={domain} 
                    onChange={(e) => setDomain(e.target.value)}
                  >
                    <option value="">All Domains</option>
                    <option>Technology</option>
                    <option>Business</option>
                    <option>Finance</option>
                    <option>Design</option>
                    <option>Healthcare</option>
                    <option>Education</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-3 font-semibold text-lg text-gray-200">Career Level</label>
                  <select 
                    className="w-full rounded-2xl p-4 text-black text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white shadow-lg"
                    value={level} 
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option value="">All Levels</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Get Recommendations */}
            <div className="text-center mb-12">
              <button
                className={`px-12 py-5 rounded-2xl ${accentGradient} text-white font-bold text-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed`}
                onClick={getRecommendations}
                disabled={loading || !userInput.trim() || inputAnalysis.confidence < 30}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyzing Your Profile...
                  </div>
                ) : (
                  "🚀 Get AI-Powered Recommendations"
                )}
              </button>
              
              {inputAnalysis.confidence < 30 && userInput.length > 0 && (
                <p className="text-yellow-400 mt-3 text-sm">
                  💡 Tip: Add more details about your skills and experience for better recommendations
                </p>
              )}
              
              {!userInput.trim() && (
                <div className="mt-6 p-6 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-2xl border border-slate-500/40 max-w-2xl mx-auto">
                  <h4 className="text-lg font-semibold mb-3 text-cyan-300">Ready to Discover Your Career Path?</h4>
                  <p className="text-gray-300 text-sm mb-4">
                    Our AI will analyze your input to find the perfect career matches. The more detailed you are, the better the recommendations!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-400 text-sm">Skills & technologies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-400 text-sm">Interests & passions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-400 text-sm">Experience level</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-400 text-sm">Career goals</span>
                    </div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-300">
                  {error}
                </div>
              )}
            </div>

            {/* Results */}
            {recommendations.length > 0 && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                  Your Personalized Career Matches
                </h2>
                
                <div className="grid grid-cols-1 gap-8">
                  {recommendations.map((career, idx) => (
                    <div 
                      key={career.title} 
                      className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-lg rounded-3xl p-8 border border-slate-600/40 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl shadow-lg"
                    >
                      {/* Career Header with Match Score */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h3 className="text-3xl font-bold text-cyan-300 mb-2">{career.title}</h3>
                          <div className="flex gap-3 mb-3">
                            <span className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-sm font-medium border border-blue-400/30">
                              {career.domain}
                            </span>
                            <span className="px-3 py-1 bg-green-500/30 text-green-200 rounded-full text-sm font-medium border border-green-400/30">
                              {career.level}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400 mb-1">AI Confidence</div>
                          <div className="text-3xl font-bold text-green-400 mb-1">
                            {Math.round(career.confidence_score * 100)}%
                          </div>
                          <div className="text-sm text-gray-400">Match Score</div>
                          <div className="text-xl font-bold text-cyan-400">
                            {Math.round(career.similarity * 100)}%
                          </div>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-gray-300 mb-6 leading-relaxed text-lg">{career.description}</p>
                      
                      {/* Key Metrics Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-slate-700/80 to-slate-600/80 p-4 rounded-2xl border border-slate-500/40">
                          <div className="text-sm text-gray-400 mb-1">Skill Match</div>
                          <div className="text-2xl font-bold text-cyan-300">{career.skill_match_percentage}%</div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-700/80 to-slate-600/80 p-4 rounded-2xl border border-slate-500/40">
                          <div className="text-sm text-gray-400 mb-1">Growth Potential</div>
                          <div className="text-lg font-semibold text-purple-300 leading-tight">{career.growth_potential.split(' - ')[0]}</div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-700/80 to-slate-600/80 p-4 rounded-2xl border border-slate-500/40">
                          <div className="text-sm text-gray-400 mb-1">Salary Range</div>
                          <div className="text-lg font-semibold text-green-300">{career.salary_range}</div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-700/80 to-slate-600/80 p-4 rounded-2xl border border-slate-500/40">
                          <div className="text-sm text-gray-400 mb-1">Job Outlook</div>
                          <div className="text-lg font-semibold text-orange-300 leading-tight">{career.job_outlook.split(' - ')[0]}</div>
                        </div>
                      </div>
                      
                      {/* Match Reasons */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-3 text-purple-300">Why This Career Matches You</h4>
                        <div className="space-y-2">
                          {career.match_reasons.map((reason: string, reasonIdx: number) => (
                            <div key={reasonIdx} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-xl border border-slate-500/30">
                              <span className="text-purple-400 text-lg">✨</span>
                              <span className="text-gray-300">{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Skills */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-3 text-cyan-300">Required Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {career.skills.map((skill: string, skillIdx: number) => (
                            <span key={skillIdx} className="px-3 py-2 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium border border-cyan-400/30">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Learning Resources */}
                      <details className="mb-6">
                        <summary className="cursor-pointer text-lg font-semibold text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-2">
                          <span>📚</span>
                          Learning Resources
                        </summary>
                        <div className="mt-4 space-y-3">
                          {career.resources.map((resource: any, resIdx: number) => (
                            <a 
                              key={resIdx}
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block p-4 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl hover:from-slate-600/70 hover:to-slate-500/70 transition-all duration-300 border border-slate-500/40 hover:border-slate-400/60"
                            >
                              <div className="font-semibold text-purple-200 text-lg mb-1">{resource.name}</div>
                              <div className="text-sm text-purple-300/70 truncate">{resource.url}</div>
                            </a>
                          ))}
                        </div>
                      </details>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-4 border-t border-slate-600/40">
                        <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105">
                          Save Career
                        </button>
                        <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                          Get More Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Summary Stats */}
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-lg rounded-3xl p-8 border border-slate-600/40 shadow-lg">
                  <h3 className="text-2xl font-bold text-center mb-6 text-cyan-300">Your Career Analysis Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        {Math.round(recommendations.reduce((acc, c) => acc + c.confidence_score, 0) / recommendations.length * 100)}%
                      </div>
                      <div className="text-gray-400">Average Confidence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-cyan-400 mb-2">
                        {Math.round(recommendations.reduce((acc, c) => acc + c.skill_match_percentage, 0) / recommendations.length)}%
                      </div>
                      <div className="text-gray-400">Average Skill Match</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">
                        {recommendations.length}
                      </div>
                      <div className="text-gray-400">Careers Found</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* No Results State */}
            {!loading && !showHero && userInput.trim() && recommendations.length === 0 && (
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-lg rounded-3xl p-12 border border-slate-600/40 shadow-2xl text-center">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-3xl font-bold mb-4 text-red-300">No Matching Careers Found</h3>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  We couldn't find any careers that match your current input. This might be because:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
                  <div className="bg-slate-700/50 p-6 rounded-2xl border border-slate-500/40">
                    <div className="text-2xl mb-3">💡</div>
                    <h4 className="text-lg font-semibold mb-2 text-cyan-300">Try More Specific Input</h4>
                    <p className="text-gray-400 text-sm">Include specific skills, technologies, or industries you're interested in</p>
                  </div>
                  <div className="bg-slate-700/50 p-6 rounded-2xl border border-slate-500/40">
                    <div className="text-2xl mb-3">🎯</div>
                    <h4 className="text-lg font-semibold mb-2 text-purple-300">Adjust Your Filters</h4>
                    <p className="text-gray-400 text-sm">Try different domain preferences or career levels</p>
                  </div>
                  <div className="bg-slate-700/50 p-6 rounded-2xl border border-slate-500/40">
                    <div className="text-2xl mb-3">🚀</div>
                    <h4 className="text-lg font-semibold mb-2 text-green-300">Explore Related Fields</h4>
                    <p className="text-gray-400 text-sm">Consider broader categories or related domains</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setUserInput("");
                      setDomain("");
                      setLevel("");
                      setRecommendations([]);
                      setInputAnalysis({ skills: [], interests: [], experience: "", confidence: 0 });
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Start Fresh
                  </button>
                  
                  <div className="text-sm text-gray-400">
                    💡 <strong>Pro tip:</strong> Try describing your interests more broadly, like "I enjoy working with data and technology" or "I'm creative and like solving problems"
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-gray-400 border-t border-slate-600/30">
        <p>CareerGuide.ai &copy; 2025 | Powered by Advanced AI & Machine Learning</p>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-slide-up.delay-200 { animation-delay: 0.2s; }
        .animate-slide-up.delay-300 { animation-delay: 0.4s; }
        .animate-slide-up.delay-400 { animation-delay: 0.6s; }
      `}</style>
    </div>
  );
}
