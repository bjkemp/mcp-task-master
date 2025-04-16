import { LLMService } from '../../../scripts/modules/llm/LLMService.js';

describe('LLMService', () => {
  // Test implementation
  class TestService extends LLMService {
    async generateTasks() { return []; }
    async updateTasks() { return []; }
    async generateSubtasks() { return []; }
    async handleError() { return {}; }
  }

  it('should require method implementations', async () => {
    const service = new TestService();
    
    await expect(service.generateTasks('test')).resolves.toEqual([]);
    await expect(service.updateTasks([], 'test')).resolves.toEqual([]);
    await expect(service.generateSubtasks({})).resolves.toEqual([]);
    await expect(service.handleError(new Error())).resolves.toEqual({});
  });

  it('should throw when methods are not implemented', async () => {
    class InvalidService extends LLMService {}
    const service = new InvalidService();
    
    await expect(service.generateTasks('test')).rejects.toThrow('generateTasks() not implemented');
    await expect(service.updateTasks([], 'test')).rejects.toThrow('updateTasks() not implemented');
    await expect(service.generateSubtasks({})).rejects.toThrow('generateSubtasks() not implemented');
    await expect(service.handleError(new Error())).rejects.toThrow('handleError() not implemented');
  });
});