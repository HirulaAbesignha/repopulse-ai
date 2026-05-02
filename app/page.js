"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [copied, setCopied] = useState(false);
  const [repos, setRepos] = useState([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfileQuietly();
    loadReposQuietly();
  }, []);

  async function safeJsonResponse(res) {
    const text = await res.text();

    try {
      return text ? JSON.parse(text) : {};
    } catch {
      throw new Error("API did not return valid JSON. Check your terminal.");
    }
  }

  async function loadReposQuietly() {
    try {
      const res = await fetch("/api/user/repos");
      const data = await safeJsonResponse(res);

      if (res.ok) {
        setSignedIn(true);
        setRepos(data.repos || []);
      }
    } catch {
      setSignedIn(false);
    }
  }
  async function loadProfileQuietly() {
    try {
      const res = await fetch("/api/user/profile");
      const data = await safeJsonResponse(res);

      if (res.ok) {
        setProfile(data.user);
        setSignedIn(true);
      }
    } catch {
      setProfile(null);
    }
  }
  
  async function loadRepos() {
    setReposLoading(true);
    setError("");

    try {
      const res = await fetch("/api/user/repos");
      const data = await safeJsonResponse(res);

      if (!res.ok) {
        throw new Error(data.error || "Failed to load repositories");
      }

      setSignedIn(true);
      setRepos(data.repos || []);
    } catch (err) {
      setSignedIn(false);
      setError(err.message);
    } finally {
      setReposLoading(false);
    }
  }

  async function analyzeRepo(e) {
    e.preventDefault();
    await analyzeRepoUrl(repoUrl);
  }

  async function analyzeRepoUrl(url) {
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
        body: JSON.stringify({ repoUrl: url }),
      });

      const data = await safeJsonResponse(res);

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze repository");
      }

      setReport(data);
      setRepoUrl(url);
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
      <section className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between mb-12">
          <p className="text-sm text-gray-400">GitHub Repository Analyzer</p>

          <div className="flex items-center gap-3">
            {signedIn ? (
              <>
              {profile && (
                <a
                  href={profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-2 bg-[#161b22] border border-gray-800 rounded-lg px-3 py-2"
                >
                  <img
                    src={profile.avatarUrl}
                    alt={profile.login}
                    className="w-6 h-6 rounded-full"
                  />

                  <span className="text-sm text-gray-300">
                    {profile.name || profile.login}
                  </span>
                </a>
              )}
                <button
                  onClick={loadRepos}
                  className="px-4 py-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-gray-700 text-sm font-medium"
                >
                  {reposLoading ? "Loading..." : "Refresh Repos"}
                </button>

                <a
                  href="/api/auth/logout"
                  className="px-4 py-2 rounded-lg bg-red-950 hover:bg-red-900 border border-red-800 text-red-200 text-sm font-medium"
                >
                  Logout
                </a>
              </>
            ) : (
              <a
                href="/api/auth/github/login"
                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200 text-sm font-semibold"
              >
                Sign in with GitHub
              </a>
            )}
          </div>
        </nav>

        <div className="mb-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            RepoPulse AI
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl">
            Analyze any GitHub repository and get a clean project health report
            with README checks, activity insights, improvement suggestions, and
            a professional README draft.
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

        {signedIn && (
          <div className="mb-8 bg-[#161b22] border border-gray-800 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-2xl font-bold">Your GitHub Repositories</h2>
                <p className="text-gray-400">
                  Select one of your repositories and analyze it instantly.
                </p>
              </div>

              <p className="text-sm text-gray-400">
                {repos.length} repositories loaded
              </p>
            </div>

            {repos.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-2">
                {repos.map((repo) => (
                  <div
                    key={repo.id}
                    className="bg-[#0d1117] border border-gray-800 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-bold">{repo.fullName}</h3>
                        <p className="text-gray-400 text-sm mt-1">
                          {repo.description || "No description available"}
                        </p>
                      </div>

                      {repo.private && (
                        <span className="text-xs bg-yellow-950 border border-yellow-800 text-yellow-300 px-2 py-1 rounded-full">
                          Private
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-400 mt-4 mb-4">
                      <span>⭐ {repo.stars}</span>
                      <span>⑂ {repo.forks}</span>
                      <span>{repo.language || "N/A"}</span>
                    </div>

                    <button
                      onClick={() => analyzeRepoUrl(repo.url)}
                      disabled={loading}
                      className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                    >
                      Analyze this repo
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-5 text-gray-400">
                No repositories loaded yet. Click Refresh Repos.
              </div>
            )}
          </div>
        )}

        {!signedIn && (
          <div className="mb-8 bg-[#161b22] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-2">Connect GitHub</h2>
            <p className="text-gray-400 mb-4">
              Sign in with GitHub to load your repositories directly inside
              RepoPulse AI. You can still analyze public repositories manually
              using the URL input above.
            </p>

            <a
              href="/api/auth/github/login"
              className="inline-block px-5 py-3 rounded-lg bg-white text-black hover:bg-gray-200 font-semibold"
            >
              Sign in with GitHub
            </a>
          </div>
        )}

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
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
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
        <footer className="mt-12 border-t border-gray-800 pt-6 text-sm text-gray-500 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p>
            RepoPulse AI helps developers improve GitHub repository presentation,
            README quality, and project structure.
          </p>

          <p>
            Support:{" "}
            <a
              href="mailto:hirulapinibinda01@gmail.com"
              className="text-blue-400 hover:underline"
            >
              hirulapinibinda01@gmail.com
            </a>
          </p>
</footer>
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