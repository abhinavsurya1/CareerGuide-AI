"use client";
import Image from "next/image";
import { useState } from "react";

const themeGradient = "bg-gradient-to-br from-blue-600 via-purple-500 to-indigo-600";

export default function Home() {
  // UI state (no backend yet)
  const [step, setStep] = useState(1);
  const [userInput, setUserInput] = useState("");
  const [domain, setDomain] = useState("");
  const [level, setLevel] = useState("");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getRecommendations() {
    setLoading(true);
    setError("");
    setRecommendations([]);
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

  return (
    <div className={`min-h-screen w-full ${themeGradient} text-white flex flex-col items-center justify-start pb-12`}>
      {/* Hero Section */}
      <header className="w-full max-w-3xl mx-auto flex flex-col items-center py-12">
        <Image src="/logo.svg" alt="CareerGuide.ai Logo" width={80} height={80} className="mb-4" />
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-center drop-shadow-lg">CareerGuide.ai</h1>
        <h2 className="text-xl sm:text-2xl font-medium mb-4 text-center">Discover your best-fit career path with AI</h2>
        <p className="text-center text-lg max-w-xl mb-6 opacity-90">Personalized recommendations based on your unique skills, interests, and goals. Shape your future with confidence.</p>
      </header>

      {/* Stepper */}
      <div className="w-full max-w-2xl bg-white/10 rounded-xl shadow-lg p-8 flex flex-col gap-8">
        {/* Step 1: User Input */}
        <div>
          <h3 className="text-2xl font-bold mb-2">1. Tell us about yourself</h3>
          <textarea
            className="w-full rounded-lg p-3 text-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
            placeholder="E.g. I enjoy working with data, building models, and using Python for analysis. I'm also interested in solving real-world problems in finance."
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
          />
        </div>
        {/* Step 2: Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Domain</label>
            <select className="w-full rounded-lg p-2 text-black" value={domain} onChange={e => setDomain(e.target.value)}>
              <option value="">All</option>
              <option>Technology</option>
              <option>Business</option>
              <option>Finance</option>
              <option>Design</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Career Level</label>
            <select className="w-full rounded-lg p-2 text-black" value={level} onChange={e => setLevel(e.target.value)}>
              <option value="">All</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>
        {/* Step 3: Get Recommendations */}
        <button
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 font-bold text-lg shadow-lg transition disabled:opacity-60"
          onClick={getRecommendations}
          disabled={loading || !userInput.trim()}
        >
          {loading ? "Finding your best-fit careers..." : "✨ Get Career Recommendations"}
        </button>
        {error && <div className="text-red-200 text-center font-semibold mt-2">{error}</div>}
      </div>

      {/* Results */}
      {step === 2 && (
        <section className="w-full max-w-5xl mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.length === 0 && !loading && (
            <div className="col-span-full text-center text-white/80 text-lg">No matching careers found. Try adjusting your input or filters.</div>
          )}
          {recommendations.map((career, idx) => (
            <div key={career.title} className="bg-white/90 text-gray-900 rounded-2xl shadow-xl p-6 flex flex-col gap-3 hover:scale-[1.03] transition">
              <h4 className="text-xl font-bold mb-1 text-blue-700">{career.title}</h4>
              <p className="mb-2 text-gray-700">{career.description}</p>
              <div className="mb-2">
                <span className="font-semibold">Required Skills:</span> {career.skills.join(", ")}
              </div>
              <details>
                <summary className="cursor-pointer text-blue-600 font-semibold">Learning Resources</summary>
                <ul className="list-disc ml-6 mt-1">
                  {career.resources.map((r: any) => (
                    <li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">{r.name}</a></li>
                  ))}
                </ul>
              </details>
              <div className="flex gap-2 mt-2 text-sm">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{career.domain}</span>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">{career.level}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Footer */}
      <footer className="mt-20 text-center text-white/80 text-sm">
        <hr className="my-4 border-white/30" />
        CareerGuide.ai &copy; 2024 | Built with <span className="text-pink-400">♥</span> using Next.js, Tailwind, and AI
      </footer>
    </div>
  );
}
