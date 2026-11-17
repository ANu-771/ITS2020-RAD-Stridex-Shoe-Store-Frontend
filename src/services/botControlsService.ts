import api from './api';

export interface BotSettings {
  primaryProvider: 'gemini' | 'groq';
  backupProvider: 'gemini' | 'groq';
  fallbackEnabled: boolean;
  geminiConfigured: boolean;
  groqConfigured: boolean;
  geminiModel: string;
  groqModel: string;
  updatedAt?: string;
}

export interface BotSettingsResponse {
  success: boolean;
  message?: string;
  settings: BotSettings;
}

export const botControlsService = {
  /**
   * Retrieves current AI chatbot provider settings (Admin-only).
   */
  async getSettings(): Promise<BotSettings> {
    const res = await api.get<BotSettingsResponse>('/admin/bot-controls/settings');
    return res.data.settings;
  },

  /**
   * Updates AI primary provider and automatic backup settings (Admin-only).
   */
  async updateSettings(data: {
    primaryProvider: 'gemini' | 'groq';
    fallbackEnabled: boolean;
  }): Promise<BotSettings> {
    const res = await api.patch<BotSettingsResponse>('/admin/bot-controls/settings', data);
    return res.data.settings;
  },
};
