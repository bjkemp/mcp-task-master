import { LLMService } from './LLMService.js';

/**
 * Abstract base class for LLM provider adapters
 * Implements common functionality and enforces interface
 */
export class LLMAdapter extends LLMService {
  /**
   * @protected
   * @type {Object}
   */
  config;

  /**
   * Create new adapter instance
   * @param {Object} config - Provider configuration
   */
  constructor(config) {
    super();
    if (new.target === LLMAdapter) {
      throw new Error('Cannot instantiate abstract class');
    }
    this.config = this.validateConfig(config);
  }

  /**
   * Validate provider configuration
   * @abstract
   * @param {Object} config - Provider configuration
   * @returns {Object} Validated configuration
   * @throws {Error} If configuration is invalid
   */
  validateConfig(config) {
    throw new Error('validateConfig() not implemented');
  }

  /**
   * Standardize error response
   * @protected
   * @param {Error} error - Original error
   * @returns {Object} Standardized error response
   */
  _standardizeError(error) {
    return {
      error: true,
      message: error.message,
      code: error.code || 'LLM_SERVICE_ERROR',
      details: error.details || {}
    };
  }
}