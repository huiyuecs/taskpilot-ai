const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { getModelById, getDefaultModel, AVAILABLE_MODELS } = require('../config/models');

// Initialize OpenAI client lazily to ensure env vars are loaded
const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

// GET /api/code-summary/models - Get available models
router.get('/models', (req, res) => {
  res.json({
    success: true,
    models: AVAILABLE_MODELS,
    default: getDefaultModel()
  });
});

// POST /api/code-summary
// Body: { code: string, language?: string, model?: string }
router.post('/', async (req, res) => {
  try {
    const { code, language, model: requestedModel } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const prompt = `Please provide a comprehensive summary of the following ${language || 'code'}:

\`\`\`${language || ''}
${code}
\`\`\`

Please include:
1. What this code does
2. Key functions/features
3. Important patterns or techniques used
4. Potential improvements or considerations

Provide the summary in a clear, structured format.`;

    // Get model configuration
    const modelConfig = requestedModel 
      ? getModelById(requestedModel) 
      : getDefaultModel();
    
    if (!modelConfig) {
      return res.status(400).json({ 
        error: 'Invalid model specified',
        availableModels: AVAILABLE_MODELS.map(m => m.id)
      });
    }

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: modelConfig.id,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful code analysis assistant. Provide clear, concise, and accurate code summaries.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: modelConfig.maxTokens,
    });

    const summary = completion.choices[0].message.content;

    res.json({
      success: true,
      summary,
      model: completion.model,
      usage: completion.usage
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({
      error: 'Failed to generate code summary',
      message: error.message
    });
  }
});

module.exports = router;

