import { LLMAdapter } from './LLMAdapter.js';

/**
 * Factory for creating LLM service instances
 */
export class LLMServiceFactory {
  /**
   * Registered provider types and their config schemas
   * @private
   * @type {Map<string, {schema: Object, adapter: Function}>}
   */
  #providers = new Map();

  /**
   * Create a new factory instance with default providers registered
   */
  constructor() {
    // Will be populated in async init
  }

  /**
   * Initialize the factory with default providers
   * Must be called before first use
   */
  async init() {
    const { AnthropicAdapter } = await import('./adapters/AnthropicAdapter.js');
    const { PerplexityAdapter } = await import('./adapters/PerplexityAdapter.js');

    this.registerProvider(
      'anthropic',
      {
        apiKey: { required: true, type: 'string' },
        model: { required: false, type: 'string' },
        maxTokens: { required: false, type: 'number' }
      },
      AnthropicAdapter
    );

    this.registerProvider(
      'perplexity', 
      {
        apiKey: { required: true, type: 'string' },
        model: { required: false, type: 'string' },
        temperature: { required: false, type: 'number' }
      },
      PerplexityAdapter
    );
  }

  /**
   * Register a new provider type
   * @param {string} type - Provider type name
   * @param {Object} configSchema - Configuration schema
   * @param {Function} adapterClass - Adapter class constructor
   */
  registerProvider(type, configSchema, adapterClass) {
    if (!(adapterClass.prototype instanceof LLMAdapter)) {
      throw new Error('Adapter class must extend LLMAdapter');
    }
    this.#providers.set(type, { schema: configSchema, adapter: adapterClass });
  }

  /**
   * Create a service instance for the given configuration
   * @param {Object} config - Service configuration
   * @returns {LLMService} Configured service instance
   * @throws {Error} If configuration is invalid or provider not found
   */
  createService(config) {
    if (!config?.provider) {
      throw new Error('Missing required provider type in configuration');
    }

    const provider = this.#providers.get(config.provider);
    if (!provider) {
      throw new Error(`Unsupported provider type: ${config.provider}`);
    }

    // Validate config against schema
    this.#validateConfig(config, provider.schema);

    // Create and return adapter instance
    return new provider.adapter(config);
  }

  /**
   * Validate configuration against schema
   * @private
   * @param {Object} config - Configuration to validate
   * @param {Object} schema - Validation schema
   * @throws {Error} If validation fails
   */
  #validateConfig(config, schema) {
    for (const [key, { required }] of Object.entries(schema)) {
      if (required && config[key] === undefined) {
        throw new Error(`Missing required configuration: ${key}`);
      }
    }
  }
}