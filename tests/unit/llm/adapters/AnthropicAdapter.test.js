import { jest } from '@jest/globals';
import { AnthropicAdapter } from '/Users/kempb/Projects/mcp-task-master/scripts/modules/llm/adapters/AnthropicAdapter.js';

// Mock the Anthropic module
const mockMessagesCreate = jest.fn();
const mockAnthropic = jest.fn(() => ({
  messages: {
    create: mockMessagesCreate
  }
}));

jest.unstable_mockModule('@anthropic-ai/sdk', () => ({
  default: mockAnthropic
}));

describe('AnthropicAdapter', () => {
  const mockConfig = {
    apiKey: 'test-key',
    model: 'claude-3-opus-20240229',
    maxTokens: 4000
  };

  let adapter;

  beforeAll(async () => {
    jest.clearAllMocks();
    await import('@anthropic-ai/sdk');
  });

  beforeEach(() => {
    adapter = new AnthropicAdapter(mockConfig);
  });

  it('should validate config', () => {
    expect(() => new AnthropicAdapter({})).toThrow('Missing required Anthropic API key');
    expect(() => new AnthropicAdapter(mockConfig)).not.toThrow();
  });

  it('should initialize Anthropic client', async () => {
    await new Promise(process.nextTick);
    expect(mockAnthropic).toHaveBeenCalledWith({
      apiKey: 'test-key',
      baseUrl: undefined
    });
    expect(mockAnthropic).toHaveBeenCalledTimes(1);
  });

  describe('generateTasks', () => {
    it('should call Anthropic API with correct params', async () => {
      const mockResponse = { content: 'test response' };
      mockMessagesCreate.mockResolvedValue(mockResponse);

      await adapter.generateTasks('test prd');
      
      expect(mockMessagesCreate).toHaveBeenCalledWith({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        temperature: 0.7,
        system: 'Generate software development tasks from PRD content',
        messages: [{
          role: 'user',
          content: 'test prd'
        }]
      });
    });

    it('should standardize errors', async () => {
      const mockError = new Error('API error');
      mockMessagesCreate.mockRejectedValue(mockError);

      await expect(adapter.generateTasks('test')).rejects.toMatchObject({
        error: true,
        message: 'API error'
      });
    });
  });
});