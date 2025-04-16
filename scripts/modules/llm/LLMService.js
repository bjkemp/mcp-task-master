/**
 * LLMService Interface
 * Defines the standard interface for all LLM service implementations
 */
export class LLMService {
  /**
   * Generate tasks from PRD content
   * @param {string} prdContent - PRD content to analyze
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Generated tasks
   */
  async generateTasks(prdContent, options = {}) {
    throw new Error('generateTasks() not implemented');
  }

  /**
   * Update existing tasks with new context
   * @param {Array} tasks - Array of tasks to update
   * @param {string} context - New context/prompt
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Updated tasks
   */
  async updateTasks(tasks, context, options = {}) {
    throw new Error('updateTasks() not implemented');
  }

  /**
   * Generate subtasks for a given task
   * @param {Object} task - Parent task
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Generated subtasks
   */
  async generateSubtasks(task, options = {}) {
    throw new Error('generateSubtasks() not implemented');
  }

  /**
   * Handle provider-specific errors
   * @param {Error} error - Original error
   * @param {Object} context - Operation context
   * @returns {Promise<Object>} Standardized error response
   */
  async handleError(error, context = {}) {
    throw new Error('handleError() not implemented');
  }
}