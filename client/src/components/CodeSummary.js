import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const CodeSummary = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [model, setModel] = useState('');
  const [models, setModels] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch available models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/code-summary/models`);
        setModels(response.data.models || []);
        if (response.data.default) {
          setModel(response.data.default.id);
        }
      } catch (err) {
        console.error('Failed to fetch models:', err);
        // Set default model if API fails
        setModel('gpt-5.1');
      }
    };
    fetchModels();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSummary('');

    try {
      const response = await axios.post(`${API_BASE_URL}/code-summary`, {
        code,
        language,
        model: model || undefined
      });

      setSummary(response.data.summary);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate summary');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Code Summary</h2>
        <p className="text-gray-600">Get AI-powered summaries of your code</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                AI Model
                {models.find(m => m.id === model)?.recommended && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-primary-600 bg-primary-100 rounded-full">
                    Recommended
                  </span>
                )}
              </label>
              <select
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                disabled={models.length === 0}
              >
                {models.length === 0 ? (
                  <option>Loading models...</option>
                ) : (
                  models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.recommended && '⭐'} - {m.description}
                    </option>
                  ))
                )}
              </select>
              {models.find(m => m.id === model) && (
                <p className="mt-1 text-xs text-gray-500">
                  Max tokens: {models.find(m => m.id === model).maxTokens}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                Programming Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Code
              </label>
              <textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                placeholder="Paste your code here..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Generating Summary...' : 'Generate Summary'}
            </button>
          </form>
        </div>

        {/* Output Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          )}

          {summary && !loading && (
            <div className="prose max-w-none">
              <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
                <span>Generated summary</span>
                {summary && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded">
                    {summary.split(' ').length} words
                  </span>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {summary}
                </pre>
              </div>
            </div>
          )}

          {!summary && !loading && !error && (
            <div className="text-center py-12 text-gray-400">
              <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>Your code summary will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeSummary;

