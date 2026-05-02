"use client";

import { useState } from "react";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyzeRepo(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setReport(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze repository");
      }

      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0d1117] text-white px-6 py-12">
      <section className="max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="text-sm text-gray-400 mb-3">
            GitHub Repository Analyzer
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            RepoPulse AI
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl">
            Analyze any GitHub repository and get a clean project health report
            with README checks, activity insights, and improvement suggestions.
          </p>
        </div>

        <form
          onSubmit={analyzeRepo}
          className="flex flex-col md:flex-row gap-3 mb-8"
        >
          <input
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            className="flex-1 px-4 py-3 rounded-lg bg-[#161b22] border border-gray-700 text-white outline-none focus:border-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? "Analyzing..." : "Analyze Repo"}
          </button>
        </form>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {report && (
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">{report.repo.fullName}</h2>

                <p className="text-gray-400 mt-1">
                  {report.repo.description || "No description available"}
                </p>
              </div>

              <div className="text-center bg-[#0d1117] border border-gray-800 rounded-xl px-6 py-4">
                <p className="text-gray-400 text-sm">Repo Score</p>
                <p className="text-4xl font-bold">{report.score}/100</p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Stat title="Stars" value={report.repo.stars} />
              <Stat title="Forks" value={report.repo.forks} />
              <Stat title="Issues" value={report.repo.openIssues} />
              <Stat
                title="Main Language"
                value={report.repo.language || "N/A"}
              />
            </div>

            <h3 className="text-xl font-bold mb-4">Health Checks</h3>

            <div className="space-y-3">
              {report.checks.map((check, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-[#0d1117] border border-gray-800 rounded-lg p-4"
                >
                  <span>{check.status === "pass" ? "✅" : "❌"}</span>
                  <p className="text-gray-300">{check.text}</p>
                </div>
              ))}
            </div>

            <a
              href={report.repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 text-blue-400 hover:underline"
            >
              Open repository on GitHub →
            </a>
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-4">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}