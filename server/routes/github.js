const express = require('express');
const router = express.Router();
const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';

// Helper function to create authenticated axios instance
const createGitHubClient = () => {
  const headers = {};
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }
  return axios.create({
    baseURL: GITHUB_API_BASE,
    headers,
  });
};

// GET /api/github/repos/:owner/:repo
// Get repository information
router.get('/repos/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const client = createGitHubClient();

    const response = await client.get(`/repos/${owner}/${repo}`);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('GitHub API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch repository information',
      message: error.response?.data?.message || error.message
    });
  }
});

// GET /api/github/repos/:owner/:repo/contents/:path?
// Get repository contents
router.get('/repos/:owner/:repo/contents/:path?', async (req, res) => {
  try {
    const { owner, repo, path } = req.params;
    const client = createGitHubClient();

    const url = path 
      ? `/repos/${owner}/${repo}/contents/${path}`
      : `/repos/${owner}/${repo}/contents`;
    
    const response = await client.get(url);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('GitHub API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch repository contents',
      message: error.response?.data?.message || error.message
    });
  }
});

// GET /api/github/repos/:owner/:repo/commits
// Get repository commits
router.get('/repos/:owner/:repo/commits', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { per_page = 10, page = 1 } = req.query;
    const client = createGitHubClient();

    const response = await client.get(`/repos/${owner}/${repo}/commits`, {
      params: { per_page, page }
    });
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('GitHub API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch commits',
      message: error.response?.data?.message || error.message
    });
  }
});

// GET /api/github/repos/:owner/:repo/languages
// Get repository languages
router.get('/repos/:owner/:repo/languages', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const client = createGitHubClient();

    const response = await client.get(`/repos/${owner}/${repo}/languages`);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('GitHub API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch languages',
      message: error.response?.data?.message || error.message
    });
  }
});

// GET /api/github/user/repos
// Get authenticated user's repositories
router.get('/user/repos', async (req, res) => {
  try {
    if (!process.env.GITHUB_TOKEN) {
      return res.status(401).json({
        error: 'GitHub token is required for this endpoint'
      });
    }

    const client = createGitHubClient();
    const { per_page = 30, page = 1, sort = 'updated' } = req.query;

    const response = await client.get('/user/repos', {
      params: { per_page, page, sort }
    });
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('GitHub API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch user repositories',
      message: error.response?.data?.message || error.message
    });
  }
});

module.exports = router;

