import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const GitHubRepos = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [repoInfo, setRepoInfo] = useState(null);
  const [searchType, setSearchType] = useState('user'); // 'user' or 'repo'

  // Fetch user repositories
  const fetchUserRepos = async () => {
    setLoading(true);
    setError('');
    setRepos([]);

    try {
      const response = await axios.get(`${API_BASE_URL}/github/user/repos`);
      setRepos(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch repositories');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific repository info
  const fetchRepoInfo = async () => {
    if (!owner || !repo) {
      setError('Please enter both owner and repository name');
      return;
    }

    setLoading(true);
    setError('');
    setRepoInfo(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/github/repos/${owner}/${repo}`);
      setRepoInfo(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch repository');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch repository languages
  const fetchRepoLanguages = async (repoOwner, repoName) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/github/repos/${repoOwner}/${repoName}/languages`);
      return response.data.data;
    } catch (err) {
      console.error('Error fetching languages:', err);
      return null;
    }
  };

  useEffect(() => {
    if (repoInfo) {
      fetchRepoLanguages(owner, repo).then(languages => {
        if (languages) {
          setRepoInfo(prev => ({ ...prev, languages }));
        }
      });
    }
  }, [repoInfo, owner, repo]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">GitHub Repositories</h2>
        <p className="text-gray-600">Browse and analyze your GitHub repositories</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => setSearchType('user')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              searchType === 'user'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            My Repositories
          </button>
          <button
            onClick={() => setSearchType('repo')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              searchType === 'repo'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Search Repository
          </button>
        </div>

        {searchType === 'repo' ? (
          <div className="flex space-x-4">
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Owner/Username"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <input
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="Repository Name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              onClick={fetchRepoInfo}
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Search
            </button>
          </div>
        ) : (
          <button
            onClick={fetchUserRepos}
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Load My Repositories'}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Repository Info */}
      {repoInfo && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                <a href={repoInfo.html_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                  {repoInfo.full_name}
                </a>
              </h3>
              <p className="text-gray-600 mt-1">{repoInfo.description || 'No description'}</p>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              repoInfo.private ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
            }`}>
              {repoInfo.private ? 'Private' : 'Public'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-600">Stars</p>
              <p className="text-2xl font-bold text-gray-900">{repoInfo.stargazers_count || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Forks</p>
              <p className="text-2xl font-bold text-gray-900">{repoInfo.forks_count || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Watchers</p>
              <p className="text-2xl font-bold text-gray-900">{repoInfo.watchers_count || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Open Issues</p>
              <p className="text-2xl font-bold text-gray-900">{repoInfo.open_issues_count || 0}</p>
            </div>
          </div>

          {repoInfo.languages && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Languages</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(repoInfo.languages).map((lang) => (
                  <span key={lang} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Created:</strong> {new Date(repoInfo.created_at).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Updated:</strong> {new Date(repoInfo.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Repositories List */}
      {repos.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Repositories ({repos.length})</h3>
          <div className="space-y-4">
            {repos.map((repo) => (
              <div key={repo.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                        {repo.full_name}
                      </a>
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{repo.description || 'No description'}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className="text-sm text-gray-500">⭐ {repo.stargazers_count}</span>
                      <span className="text-sm text-gray-500">🍴 {repo.forks_count}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        repo.private ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {repo.private ? 'Private' : 'Public'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && repos.length === 0 && !repoInfo && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <p className="text-gray-400">No repositories loaded. Use the search above to get started.</p>
        </div>
      )}
    </div>
  );
};

export default GitHubRepos;

