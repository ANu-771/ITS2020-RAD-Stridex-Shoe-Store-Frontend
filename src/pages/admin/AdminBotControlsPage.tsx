import { useState, useEffect } from 'react';
import type { FC } from 'react';
import {
  Bot,
  Zap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Save,
  ArrowRightLeft,
  Cpu,
  Lock,
} from 'lucide-react';
import { botControlsService, type BotSettings } from '../../services/botControlsService';
import { useToast } from '../../context/ToastContext';

export const AdminBotControlsPage: FC = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<BotSettings | null>(null);
  const [primaryProvider, setPrimaryProvider] = useState<'gemini' | 'groq'>('gemini');
  const [fallbackEnabled, setFallbackEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await botControlsService.getSettings();
      setSettings(data);
      setPrimaryProvider(data.primaryProvider);
      setFallbackEnabled(data.fallbackEnabled);
    } catch (err: any) {
      console.error('Failed to load bot settings:', err);
      showToast(err.response?.data?.message || 'Failed to load bot controls settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await botControlsService.updateSettings({
        primaryProvider,
        fallbackEnabled,
      });
      setSettings(updated);
      setSaveSuccess(true);
      showToast('Bot provider settings updated successfully!', 'success');
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error('Failed to save bot settings:', err);
      showToast(err.response?.data?.message || 'Failed to update bot settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const backupProvider: 'gemini' | 'groq' = primaryProvider === 'gemini' ? 'groq' : 'gemini';

  return (
    <div className="space-y-6">
      {/* Page Title & Refresh */}
      <div className="bg-white rounded-3xl p-6 border border-[#DCEBE0] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DDF3E2] text-[#26352D] text-xs font-semibold mb-2">
            <Bot className="w-4 h-4 text-[#72C98A]" />
            <span>STRIDEX AI Engine Controls</span>
          </div>
          <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#26352D]">
            Bot Controls & Multi-Provider AI
          </h2>
          <p className="text-xs sm:text-sm text-[#718078] mt-1">
            Configure primary shopping assistant provider, automatic backup switching, and inspect engine availability.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          disabled={isLoading || isSaving}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] hover:bg-[#DDF3E2] text-[#26352D] text-xs font-semibold transition-colors flex items-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 border border-[#DCEBE0] shadow-sm text-center">
          <RefreshCw className="w-8 h-8 text-[#72C98A] animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#26352D]">Loading Bot Controls Configuration...</p>
        </div>
      ) : (
        <>
          {/* Quick Status Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Primary Provider Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#DCEBE0] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#718078] uppercase tracking-wider">Primary Provider</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#72C98A] animate-pulse" />
              </div>
              <div className="flex items-center space-x-2">
                {primaryProvider === 'gemini' ? (
                  <Sparkles className="w-5 h-5 text-[#2E7D32]" />
                ) : (
                  <Zap className="w-5 h-5 text-[#F59E0B]" />
                )}
                <span className="text-lg font-bold text-[#26352D] capitalize">{primaryProvider}</span>
              </div>
              <p className="text-[11px] text-[#718078]">
                First choice for all customer shopping chat queries.
              </p>
            </div>

            {/* Backup Provider Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#DCEBE0] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#718078] uppercase tracking-wider">Backup Provider</span>
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#718078]" />
              </div>
              <div className="flex items-center space-x-2">
                {backupProvider === 'gemini' ? (
                  <Sparkles className="w-5 h-5 text-[#2E7D32]" />
                ) : (
                  <Zap className="w-5 h-5 text-[#F59E0B]" />
                )}
                <span className="text-lg font-bold text-[#26352D] capitalize">{backupProvider}</span>
              </div>
              <p className="text-[11px] text-[#718078]">
                {fallbackEnabled
                  ? 'Active failover target on temporary primary errors.'
                  : 'Failover is currently disabled.'}
              </p>
            </div>

            {/* Failover Status Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#DCEBE0] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#718078] uppercase tracking-wider">Failover Protection</span>
                <Cpu className="w-3.5 h-3.5 text-[#718078]" />
              </div>
              <div className="flex items-center space-x-2">
                {fallbackEnabled ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#DDF3E2] text-[#2E7D32]">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Enabled
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-[#718078]">
                    Disabled
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#718078]">
                Switches on 429 rate limit, 503 outage, or timeout.
              </p>
            </div>

            {/* Security Isolation Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#DCEBE0] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#718078] uppercase tracking-wider">Credential Security</span>
                <Lock className="w-3.5 h-3.5 text-[#72C98A]" />
              </div>
              <div className="flex items-center space-x-1.5 text-sm font-bold text-[#26352D]">
                <ShieldCheck className="w-4 h-4 text-[#72C98A]" />
                <span>Backend Isolated</span>
              </div>
              <p className="text-[11px] text-[#718078]">
                API keys reside exclusively in backend environment variables.
              </p>
            </div>
          </div>

          {/* Section: AI Provider Selection */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBE0] shadow-sm space-y-6">
            <div>
              <h3 className="font-outfit text-lg font-bold text-[#26352D]">1. Primary AI Provider Selection</h3>
              <p className="text-xs text-[#718078] mt-0.5">
                Select which AI service serves as the primary engine for customer shopping inquiries. The other becomes the automatic backup.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gemini Option Card */}
              <div
                onClick={() => setPrimaryProvider('gemini')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  primaryProvider === 'gemini'
                    ? 'border-[#72C98A] bg-[#F2FAF4] shadow-sm'
                    : 'border-[#DCEBE0] bg-white hover:border-[#BDECCB]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#DDF3E2] flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#2E7D32]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#26352D] text-sm flex items-center gap-1.5">
                        <span>Google Gemini</span>
                        {primaryProvider === 'gemini' && (
                          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-[#72C98A] text-white">
                            Primary
                          </span>
                        )}
                        {primaryProvider === 'groq' && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-gray-100 text-[#718078]">
                            Backup
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-[#718078]">High-speed Google multimodal LLM</p>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="primaryProvider"
                    value="gemini"
                    checked={primaryProvider === 'gemini'}
                    onChange={() => setPrimaryProvider('gemini')}
                    className="w-4 h-4 text-[#72C98A] accent-[#72C98A] cursor-pointer"
                  />
                </div>

                <div className="mt-4 pt-4 border-t border-[#DCEBE0] text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[#718078]">Configured Model:</span>
                    <span className="font-mono text-[11px] font-semibold text-[#26352D]">
                      {settings?.geminiModel || 'gemini-3.5-flash-lite'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#718078]">Backend API Status:</span>
                    {settings?.geminiConfigured ? (
                      <span className="inline-flex items-center text-[11px] font-semibold text-[#2E7D32]">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Configured in .env
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[11px] font-semibold text-[#E45D5D]">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        Missing in .env
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Groq Option Card */}
              <div
                onClick={() => setPrimaryProvider('groq')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  primaryProvider === 'groq'
                    ? 'border-[#72C98A] bg-[#F2FAF4] shadow-sm'
                    : 'border-[#DCEBE0] bg-white hover:border-[#BDECCB]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
                      <Zap className="w-5 h-5 text-[#D97706]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#26352D] text-sm flex items-center gap-1.5">
                        <span>Groq Cloud</span>
                        {primaryProvider === 'groq' && (
                          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-[#72C98A] text-white">
                            Primary
                          </span>
                        )}
                        {primaryProvider === 'gemini' && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-gray-100 text-[#718078]">
                            Backup
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-[#718078]">Ultra low-latency LPU inference engine</p>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="primaryProvider"
                    value="groq"
                    checked={primaryProvider === 'groq'}
                    onChange={() => setPrimaryProvider('groq')}
                    className="w-4 h-4 text-[#72C98A] accent-[#72C98A] cursor-pointer"
                  />
                </div>

                <div className="mt-4 pt-4 border-t border-[#DCEBE0] text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[#718078]">Configured Model:</span>
                    <span className="font-mono text-[11px] font-semibold text-[#26352D]">
                      {settings?.groqModel || 'openai/gpt-oss-120b'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#718078]">Backend API Status:</span>
                    {settings?.groqConfigured ? (
                      <span className="inline-flex items-center text-[11px] font-semibold text-[#2E7D32]">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Configured in .env
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[11px] font-semibold text-[#E45D5D]">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        Missing in .env
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Automatic Backup Switching */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBE0] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-outfit text-lg font-bold text-[#26352D]">2. Automatic Backup Switching</h3>
                <p className="text-xs text-[#718078] mt-0.5">
                  Seamlessly fallback to the secondary provider on temporary rate limits, resource exhaustion, or timeouts.
                </p>
              </div>

              {/* Custom Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={fallbackEnabled}
                  onChange={(e) => setFallbackEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-13 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#72C98A]"></div>
                <span className="ml-3 text-xs font-bold text-[#26352D]">
                  {fallbackEnabled ? 'Automatic Backup Enabled' : 'Automatic Backup Disabled'}
                </span>
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-[#F2FAF4] border border-[#DDF3E2] text-xs text-[#26352D] space-y-1.5">
              <div className="font-semibold flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4 text-[#72C98A]" />
                <span>Failover Rule:</span>
              </div>
              <p className="text-[#718078] leading-relaxed">
                {fallbackEnabled ? (
                  <>
                    If <strong className="text-[#26352D] capitalize">{primaryProvider}</strong> experiences temporary errors (HTTP 429 rate limits, HTTP 503 service delays, or network timeouts), STRIDEX automatically queries <strong className="text-[#26352D] capitalize">{backupProvider}</strong>. Customer chat sessions, conversation memory, and 10-message limits continue seamlessly.
                  </>
                ) : (
                  <>
                    Automatic backup is turned off. If <strong className="text-[#26352D] capitalize">{primaryProvider}</strong> fails, the bot will return a friendly service notice without switching to <strong className="text-[#26352D] capitalize">{backupProvider}</strong>.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Section: Security Assurance Notice */}
          <div className="bg-[#F2FAF4] rounded-2xl p-4 border border-[#DDF3E2] flex items-start space-x-3 text-xs text-[#718078]">
            <ShieldCheck className="w-5 h-5 text-[#72C98A] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#26352D]">Credential Privacy & Access Control</span>
              <p className="leading-relaxed">
                Raw API keys are stored solely on the secure backend server and are never sent to or displayed on client devices. Only verified administrators can view and modify AI provider rules.
              </p>
            </div>
          </div>

          {/* Save Controls Footer Bar */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCEBE0] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-xs text-[#718078]">
              {settings?.updatedAt && (
                <span>
                  Last synchronized: {new Date(settings.updatedAt).toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {saveSuccess && (
                <span className="inline-flex items-center text-xs font-bold text-[#2E7D32]">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-[#72C98A]" />
                  Settings Saved
                </span>
              )}

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-[#72C98A] hover:bg-[#5BB374] text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Bot Settings</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
