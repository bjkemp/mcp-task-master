import { LLMAdapter } from '../../../scripts/modules/llm/LLMAdapter.js';

describe('LLMAdapter', () => {
  // Test adapter implementation
  class TestAdapter extends LLMAdapter {
    validateConfig(config) {
      if (!config.apiKey) {
        throw new Error('Missing required apiKey');
      }
      return config;
    }
  }

  it('should be abstract and cannot be instantiated directly', () => {
    expect(() => new LLMAdapter({})).toThrow('Cannot instantiate abstract class');
  });

  describe('when extended', () => {
    it('should require validateConfig implementation', () => {
      class InvalidAdapter extends LLMAdapter {}
      expect(() => new InvalidAdapter({})).toThrow('validateConfig() not implemented');
    });

    it('should set config property after validation', () => {
      const config = { apiKey: 'test-key' };
      const adapter = new TestAdapter(config);
      expect(adapter.config).toEqual(config);
    });

    it('should validate config during construction', () => {
      expect(() => new TestAdapter({})).toThrow('Missing required apiKey');
    });

    it('should standardize errors', () => {
      const adapter = new TestAdapter({ apiKey: 'test-key' });
      const error = new Error('Test error');
      error.code = 'TEST_ERROR';
      
      const standardized = adapter._standardizeError(error);
      expect(standardized).toEqual({
        error: true,
        message: 'Test error',
        code: 'TEST_ERROR',
        details: {}
      });
    });
  });
});