import { LLMAdapter } from '../LLMAdapter.js';
import { Anthropic } from '@anthropic-ai/sdk';

/**
 * Adapter for Anthropic's API
 */
export class AnthropicAdapter extends LLMAdapter {
  #client;

  validateConfig(config) {
    if (!config.apiKey) {
      throw new Error('Missing required Anthropic API key');
    }
    return config;
  }

  constructor(config) {
    super(config);
    this.#client = new Anthropic({
      apiKey: this.config.apiKey,
      ...(this.config.baseUrl && { baseUrl: this.config.baseUrl })
    });
  }

  async generateTasks(prdContent, options = {}) {
    try {
      const response = await this.#client.messages.create({
        model: this.config.model || 'claude-3-opus-20240229',
        max_tokens: this.config.maxTokens || 4000,
        temperature: this.config.temperature || 0.7,
        system: 'Generate software development tasks from PRD content',
        messages: [
          {
            role: 'user',
            content: prdContent
          }
        ]
      });
      return this.#parseTasks(response);
    } catch (error) {
      throw this._standardizeError(error);
    }
  }

  async updateTasks(tasks, context, options = {}) {
    // Implementation similar to generateTasks but for updates
  }

  async generateSubtasks(task, options = {}) {
    // Implementation for subtask generation
  }

  async handleError(error, context = {}) {
    // Custom error handling for Anthropic API
  }

  #parseTasks(response) {
    // Parse Anthropic response into task format
  }
}