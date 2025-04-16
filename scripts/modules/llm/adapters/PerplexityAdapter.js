import { LLMAdapter } from '../LLMAdapter.js';
import { OpenAI } from 'openai';

/**
 * Adapter for Perplexity AI's API
 */
export class PerplexityAdapter extends LLMAdapter {
  #client;

  validateConfig(config) {
    if (!config.apiKey) {
      throw new Error('Missing required Perplexity API key');
    }
    return config;
  }

  constructor(config) {
    super(config);
    this.#client = new OpenAI({
      apiKey: this.config.apiKey,
      baseURL: 'https://api.perplexity.ai'
    });
  }

  async generateTasks(prdContent, options = {}) {
    try {
      const response = await this.#client.chat.completions.create({
        model: this.config.model || 'sonar-medium-online',
        messages: [
          {
            role: 'system',
            content: 'Generate software development tasks from PRD content'
          },
          {
            role: 'user', 
            content: prdContent
          }
        ],
        temperature: this.config.temperature || 0.7
      });
      return this.#parseTasks(response);
    } catch (error) {
      throw this._standardizeError(error);
    }
  }

  // Other required methods (stubs)
  async updateTasks() { /*...*/ }
  async generateSubtasks() { /*...*/ }
  async handleError() { /*...*/ }

  #parseTasks(response) {
    // Parse Perplexity response into task format
  }
}