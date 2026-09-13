'use client';

import { useState, useEffect } from 'react';
import { Key, CheckCircle2, AlertCircle, X, Shield, ExternalLink, Loader2, Sparkles } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose }) {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [status, setStatus] = useState({ configured: false, maskedKey: null, mode: 'TELEMETRY_SIMULATOR_MODE' });
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({ text: '', type: '' });

  // Load current API key status
  const checkStatus = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.warn('Failed to check API config status:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkStatus();
      setFeedbackMessage({ text: '', type: '' });
      const stored = localStorage.getItem('railsync_runtime_key');
      if (stored) setApiKeyInput(stored);
    }
  }, [isOpen]);

  const handleSaveKey = async (e) => {
    e.preventDefault();
    const cleanKey = apiKeyInput.trim();

    if (!cleanKey) {
      setFeedbackMessage({ text: 'Please enter a valid API key string.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setFeedbackMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: cleanKey })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('railsync_runtime_key', cleanKey);
        setFeedbackMessage({ text: 'RailKit API key linked successfully! Live Indian Railways mode active.', type: 'success' });
        await checkStatus();
      } else {
        setFeedbackMessage({ text: data.error || 'Failed to activate API key.', type: 'error' });
      }
    } catch (err) {
      setFeedbackMessage({ text: 'Error communicating with server.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="station-signboard max-w-lg w-full rounded-lg p-6 relative shadow-2xl border-2 border-[#ffd200]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94a3b8] hover:text-white p-1 rounded hover:bg-[#132c60]"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#1b345f]">
          <div className="w-10 h-10 rounded bg-[#ffd200] text-[#050d1c] flex items-center justify-center font-bold">
            <Key size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-mono">
              RAILKIT API CONFIGURATION
            </h3>
            <p className="text-xs text-[#94a3b8]">
              Link your developer key for real-time live Indian Railways telemetry
            </p>
          </div>
        </div>

        {/* Current Active Status Indicator */}
        <div className="mt-4 p-3.5 bg-[#050e1d] rounded border border-[#1e3a6d] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#94a3b8]">OPERATIONAL STATUS:</span>
            <div className="flex items-center gap-1.5">
              <span className={`signal-lamp ${status.configured ? 'green' : 'amber'} signal-pulse`}></span>
              <span className={`font-bold ${status.configured ? 'text-[#10b981]' : 'text-[#ffd200]'}`}>
                {status.configured ? 'RAILKIT LIVE CONNECTED' : 'TELEMETRY SIMULATOR ACTIVE'}
              </span>
            </div>
          </div>

          {status.configured && status.maskedKey && (
            <div className="text-xs font-mono text-[#cbd5e1] pt-1 border-t border-[#142646] flex items-center justify-between">
              <span className="text-[#64748b]">Active Key:</span>
              <span className="text-[#ffd200]">{status.maskedKey}</span>
            </div>
          )}

          {!status.configured && (
            <p className="text-[11px] text-[#94a3b8] pt-1">
              Currently running on built-in realistic Indian Railways telemetry data for trains, stations, and PNRs.
            </p>
          )}
        </div>

        {/* Feedback message */}
        {feedbackMessage.text && (
          <div className={`mt-3 p-3 rounded text-xs flex items-center gap-2 ${
            feedbackMessage.type === 'success'
              ? 'bg-[#064e3b] text-[#6ee7b7] border border-[#059669]'
              : 'bg-[#450a0a] text-[#fca5a5] border border-[#dc2626]'
          }`}>
            {feedbackMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Key Form */}
        <form onSubmit={handleSaveKey} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#ffd200] uppercase mb-1">
              RailKit API Key
            </label>
            <input
              type="text"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste your RailKit API key (e.g. rk_live_...)"
              className="rail-input font-mono text-sm"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <a
              href="https://railkit.rajivdubey.dev/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#38bdf8] hover:underline flex items-center gap-1 font-mono"
            >
              <span>Get Free Key</span>
              <ExternalLink size={12} />
            </a>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rail-btn-secondary text-xs"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rail-btn-primary text-xs py-2 px-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Validating...</span>
                  </>
                ) : (
                  <>
                    <Key size={14} />
                    <span>Save & Link Key</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
