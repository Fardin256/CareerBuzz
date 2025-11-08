import React, { useState } from "react";

const Dashboard = () => {
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState(null);

  const analyzeSkills = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills: skills.split(",").map(s => s.trim()) }),
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">CareerBuzz Dashboard</h1>

      <form
        onSubmit={analyzeSkills}
        className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg space-y-4"
      >
        <label className="block text-lg font-medium mb-2">
          Enter Your Skills (comma separated)
        </label>
        <input
          type="text"
          placeholder="e.g. Python, JavaScript, HTML"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all"
        >
          Analyze Skills
        </button>
      </form>

      {result && (
        <div className="max-w-xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-3">Results</h2>
          <p><strong>Entered Skills:</strong> {result.entered_skills.join(", ")}</p>
          <p className="mt-2">
            <strong>Suggested Careers:</strong> {result.suggested_careers.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;