import api from './api';
import type { ChatApiResponse } from '../types/ai.types';

export const aiService = {
  /**
   * Send a message to the STRIDEX AI Shopping Assistant.
   * Sends the current user message and up to the 6 most recent history items.
   */
  async sendMessage(
    message: string,
    history: Array<{ role: 'user' | 'model'; text: string }> = []
  ): Promise<ChatApiResponse> {
    try {
      const response = await api.post<ChatApiResponse>(
        '/ai/chat',
        {
          message: message.trim(),
          history: history.slice(-6),
        },
        {
          timeout: 25000, // 25s timeout for AI generation
        }
      );

      return response.data;
    } catch (err: any) {
      console.error('aiService.sendMessage error:', err);

      if (err.response?.data?.reply) {
        return {
          success: false,
          reply: err.response.data.reply,
          suggestedProducts: [],
        };
      }

      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        return {
          success: false,
          reply:
            'Sorry! The request took longer than expected to process. Please try asking again shortly.',
          suggestedProducts: [],
        };
      }

      return {
        success: false,
        reply:
          'Sorry! Our STRIDEX AI Assistant is temporarily unavailable. Please try again later.',
        suggestedProducts: [],
      };
    }
  },
};
