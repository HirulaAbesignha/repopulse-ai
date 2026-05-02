"use client";

import { useState } from "react";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function analyzeRepo(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setReport(null);
    setCopied(false);

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

  async function copyReadme() {
    if (!report?.readmeDraft) return;

    await navigator.clipboard.writeText(report.readmeDraft);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function downloadReadme() {
    if (!report?.readmeDraft) return;

    const blob = new Blob([report.readmeDraft], {
      type: "text/markdown",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "README.md";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

            <div className="mb-8 bg-[#0d1117] border border-gray-800 rounded-xl p-5">
              <h3 className="text-xl font-bold mb-3">
                Smart Project Summary
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {report.summary}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">
                Improvement Suggestions
              </h3>

              {report.suggestions && report.suggestions.length > 0 ? (
                <div className="space-y-3">
                  {report.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 text-gray-300"
                    >
                      💡 {suggestion}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-950 border border-green-800 text-green-300 rounded-lg p-4">
                  Great job. No major suggestions found.
                </div>
              )}
            </div>

            {report.readmeDraft && (
              <div className="mb-8">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h3 className="text-xl font-bold">
                    Generated README Draft
                  </h3>

                  <div className="flex gap-3">
                    <button
                      onClick={copyReadme}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium"
                    >
                      {copied ? "Copied!" : "Copy README"}
                    </button>

                    <button
                      onClick={downloadReadme}
                      className="px-4 py-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-gray-700 text-sm font-medium"
                    >
                      Download README.md
                    </button>
                  </div>

                </div>

                <pre className="bg-[#0d1117] border border-gray-800 rounded-xl p-5 text-gray-300 text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                  {report.readmeDraft}
                </pre>
              </div>
            )}

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