/**
 * APEX: Executive RPG Execution OS
 * Settings & Local-First Persistence View
 *
 * File target: src/components/settings/SettingsView.tsx
 */

import React, { useState, useRef } from 'react';
import { useApexStore } from '../../store/useApexStore';
import {
  Sliders,
  Lock,
  Database,
  Download,
  Upload,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react';
import { setSoundEnabled as setAudioSoundEnabled } from '../../utils/audio';

export const SettingsView: React.FC = () => {
  const settings = useApexStore((s) => s.settings);
  const setGeminiApiKey = useApexStore((s) => s.setGeminiApiKey);
  const toggleSound = useApexStore((s) => s.toggleSound);
  const exportBackupJson = useApexStore((s) => s.exportBackupJson);
  const importBackupJson = useApexStore((s) => s.importBackupJson);
  const resetToDefaultState = useApexStore((s) => s.resetToDefaultState);

  const [apiKeyInput, setApiKeyInput] = useState(settings.geminiApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(apiKeyInput.trim());
    setStatusMessage({ type: 'success', text: 'Gemini API key saved securely in local browser storage.' });
  };

  const handleSoundToggle = () => {
    toggleSound();
    setAudioSoundEnabled(!settings.soundEnabled);
  };

  const handleExport = () => {
    exportBackupJson();
    setStatusMessage({ type: 'success', text: 'Encrypted JSON backup file downloaded successfully.' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = importBackupJson(content);
      if (result.success) {
        setStatusMessage({ type: 'success', text: 'System state successfully restored from backup snapshot.' });
      } else {
        setStatusMessage({ type: 'error', text: result.error || 'Failed to restore backup snapshot.' });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress, character stats, and quests to initial state?')) {
      resetToDefaultState();
      setStatusMessage({ type: 'success', text: 'System reset to initial executive baseline.' });
    }
  };

  return (
    <section aria-label="Settings Section" className="flex flex-col gap-6">
      {/* 1. Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
          <Sliders className="w-3.5 h-3.5" />
          <span>SUBSYSTEM // LOCAL-FIRST DATA VAULT</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
          SYSTEM SETTINGS & PERSISTENCE
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Zero telemetry leakage. All data lives in your browser sandbox with 1-click JSON backup and recovery.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-lg border font-mono text-xs flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/70 border-red-500/50 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gemini BYOK Card */}
        <div className="bg-[#0e1526] border border-slate-800 rounded-lg p-5 flex flex-col justify-between gap-4 font-mono">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                <Lock className="w-4 h-4" />
                <span>GOOGLE STITCH & AI STUDIO BYOK</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                CLIENT-SIDE ONLY
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Link your private Google Stitch / Google AI Studio API key to unlock live Senior Partner sparring, dynamic martial arts combat critiques, and boss evaluations. Key is stored strictly in your browser.
            </p>
          </div>

          <form onSubmit={handleSaveApiKey} className="flex flex-col gap-3">
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 pr-10 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button
              type="submit"
              className="py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
            >
              <Key className="w-3.5 h-3.5" />
              <span>SAVE API KEY</span>
            </button>
          </form>
        </div>

        {/* Audio FX & Terminal Tone Control */}
        <div className="bg-[#0e1526] border border-slate-800 rounded-lg p-5 flex flex-col justify-between gap-4 font-mono">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                <Volume2 className="w-4 h-4" />
                <span>PROCEDURAL AUDIO SYNTHESIZER</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                WEB AUDIO API
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesizes real-time procedural tones for level ascensions, deep work focus chimes, and Bloomberg terminal click haptics with zero external audio assets.
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-300">
              AUDIO SFX: {settings.soundEnabled ? 'ENABLED' : 'MUTED'}
            </span>
            <button
              type="button"
              onClick={handleSoundToggle}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                settings.soundEnabled
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{settings.soundEnabled ? 'MUTED' : 'UNMUTE'}</span>
            </button>
          </div>
        </div>

        {/* 1-Click JSON Backup & Restore Card */}
        <div className="bg-[#0e1526] border border-slate-800 rounded-lg p-5 flex flex-col justify-between gap-4 font-mono">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-blue-400 font-bold">
                <Database className="w-4 h-4" />
                <span>1-CLICK BACKUP & RECOVERY</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-500/30">
                JSON V1.0.0
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export an encrypted snapshot of your character level, attributes, quests, and session history, or restore an existing backup on any device.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="flex-1 py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT JSON</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>IMPORT JSON</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,application/json"
              className="hidden"
            />
          </div>
        </div>

        {/* System Reset / Emergency Flush */}
        <div className="bg-[#0e1526] border border-red-950/60 rounded-lg p-5 flex flex-col justify-between gap-4 font-mono">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-red-400 font-bold">
                <RotateCcw className="w-4 h-4" />
                <span>SYSTEM RESET & INITIALIZATION</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/30">
                FACTORY DEFAULTS
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reset all progression, attributes, active quests, and history back to Junior Analyst baseline. Use with caution.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="w-full py-2 rounded bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-300 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET TO FACTORY BASELINE</span>
          </button>
        </div>
      </div>
    </section>
  );
};
