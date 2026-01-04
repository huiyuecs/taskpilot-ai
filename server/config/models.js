// Available OpenAI models configuration
const AVAILABLE_MODELS = [
  {
    id: 'gpt-5.1',
    name: 'GPT-5.1',
    description: 'Latest model with enhanced coding capabilities and adaptive reasoning',
    maxTokens: 2000,
    recommended: true,
    category: 'latest'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Optimized GPT-4 model with improved performance',
    maxTokens: 2000,
    recommended: false,
    category: 'standard'
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Fast and efficient GPT-4 variant',
    maxTokens: 1500,
    recommended: false,
    category: 'standard'
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Standard GPT-4 model',
    maxTokens: 1500,
    recommended: false,
    category: 'standard'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and cost-effective option',
    maxTokens: 1000,
    recommended: false,
    category: 'economy'
  }
];

// Get model by ID
const getModelById = (modelId) => {
  return AVAILABLE_MODELS.find(model => model.id === modelId) || AVAILABLE_MODELS[0];
};

// Get default model
const getDefaultModel = () => {
  return AVAILABLE_MODELS.find(model => model.recommended) || AVAILABLE_MODELS[0];
};

// Get models by category
const getModelsByCategory = (category) => {
  return AVAILABLE_MODELS.filter(model => model.category === category);
};

module.exports = {
  AVAILABLE_MODELS,
  getModelById,
  getDefaultModel,
  getModelsByCategory
};

