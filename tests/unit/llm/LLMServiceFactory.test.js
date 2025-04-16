import { LLMServiceFactory } from '../../../scripts/modules/llm/LLMServiceFactory.js';
import { LLMAdapter } from '../../../scripts/modules/llm/LLMAdapter.js';

describe('LLMServiceFactory', () => {
  class TestAdapter extends LLMAdapter {
    validateConfig(config) {
      if (!config.apiKey) throw new Error('Missing apiKey');
      return config;
    }
  }

  const testSchema = {
    apiKey: { required: true },
    model: { required: false }
  };

  let factory;

  beforeEach(() => {
    factory = new LLMServiceFactory();
  });

  it('should register providers', () => {
    factory.registerProvider('test', testSchema, TestAdapter);
    // Test registration indirectly by creating service
    expect(() => factory.createService({
      provider: 'test',
      apiKey: 'valid-key'
    })).not.toThrow();
  });

  it('should reject invalid adapters', () => {
    expect(() => factory.registerProvider('invalid', {}, class {}))
      .toThrow('must extend LLMAdapter');
  });

  describe('when creating services', () => {
    beforeEach(() => {
      factory.registerProvider('test', testSchema, TestAdapter);
    });

    it('should create valid service instances', () => {
      const service = factory.createService({
        provider: 'test',
        apiKey: 'valid-key'
      });
      expect(service).toBeInstanceOf(TestAdapter);
    });

    it('should reject missing provider', () => {
      expect(() => factory.createService({}))
        .toThrow('Missing required provider type');
    });

    it('should reject unknown providers', () => {
      expect(() => factory.createService({ provider: 'unknown' }))
        .toThrow('Unsupported provider type');
    });

    it('should validate configuration', () => {
      expect(() => factory.createService({ provider: 'test' }))
        .toThrow('Missing required configuration: apiKey');
    });
  });
});