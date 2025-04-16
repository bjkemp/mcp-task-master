import { LLMServiceFactory } from './LLMServiceFactory.js';

let serviceFactory;

/**
 * Initialize and get the LLM service factory instance
 * @returns {Promise<LLMServiceFactory>}
 */
export async function getLLMServiceFactory() {
  if (!serviceFactory) {
    serviceFactory = new LLMServiceFactory();
    await serviceFactory.init();
  }
  return serviceFactory;
}

/**
 * Create an LLM service instance from configuration
 * @param {Object} config 
 * @returns {Promise<LLMService>}
 */
export async function createLLMService(config) {
  const factory = await getLLMServiceFactory();
  return factory.createService(config);
}