/**
 * APEX: Executive RPG Execution OS
 * Lock-In Fullscreen Deep Work Mode & MECE Scratchpad
 *
 * File target: src/components/lockin/LockInView.tsx
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApexStore } from '../../store/useApexStore';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Brain,
  FileText,
  Plus,
  Trash2,
  Zap,
  Shield,
} from 'lucide-react';
import { LockInPresetMinutes, MeceNode } from '../../types';

export const LockInView: React.FC = () => {
  const activeLockIn = useApexStore((s) => s.activeLockIn);
  const initLockInSession = useApexStore((s) => s.initLockInSession);
  const setLockInStatus = useApexStore((s) => s.setLockInStatus);
  const updateLockInElapsed = useApexStore((s) => s.updateLockInElapsed);
  const updateMeceTree = useApexStore((s) => s.updateMeceTree);
  const updateLockInNotes = useApexStore((s) => s.updateLockInNotes);
  const finishLockInSession = useApexStore((s) => s.finishLockInSession);
  const cancelLockInSession = useApexStore((s) => s.cancelLockInSession);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Default to 50m if none initialized
  useEffect(() => {
    if (!activeLockIn) {
      initLockInSession(50);
    }
  }, [activeLockIn, initLockInSession]);

  // Timer interval loop
  useEffect(() => {
    if (!activeLockIn || activeLockIn.status !== 'running') return;

    const timer = setInterval(() => {
      const nextElapsed = activeLockIn.elapsedSeconds + 1;
      const totalSeconds = activeLockIn.presetMinutes * 60;

      if (nextElapsed >= totalSeconds) {
        updateLockInElapsed(totalSeconds);
        finishLockInSession();
      } else {
        updateLockInElapsed(nextElapsed);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeLockIn, updateLockInElapsed, finishLockInSession]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!activeLockIn) {
    return null;
  }

  const totalSeconds = activeLockIn.presetMinutes * 60;
  const remainingSeconds = Math.max(0, totalSeconds - activeLockIn.elapsedSeconds);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = Math.min(100, Math.round((activeLockIn.elapsedSeconds / totalSeconds) * 100));

  // MECE Tree Node manipulation
  const handleAddChild = (targetId: string) => {
    const addChildRecursively = (node: MeceNode): MeceNode => {
      if (node.id === targetId) {
        return {
          ...node,
          children: [
            ...node.children,
            { id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, text: 'New Mutually Exclusive Branch', children: [] },
          ],
        };
      }
      return { ...node, children: node.children.map(addChildRecursively) };
    };

    updateMeceTree(addChildRecursively(activeLockIn.meceTree));
  };

  const handleUpdateText = (targetId: string, text: string) => {
    const updateTextRecursively = (node: MeceNode): MeceNode => {
      if (node.id === targetId) {
        return { ...node, text };
      }
      return { ...node, children: node.children.map(updateTextRecursively) };
    };

    updateMeceTree(updateTextRecursively(activeLockIn.meceTree));
  };

  const handleDeleteNode = (targetId: string) => {
    const deleteRecursively = (node: MeceNode): MeceNode => {
      return {
        ...node,
        children: node.children.filter((child) => child.id !== targetId).map(deleteRecursively),
      };
    };

    updateMeceTree(deleteRecursively(activeLockIn.meceTree));
  };

  const renderMeceNode = (node: MeceNode, depth: number = 0) => {
    return (
      <div key={node.id} className="flex flex-col gap-2 relative">
        <div
          className={`flex items-center gap-2 p-2 rounded border transition-all ${
            depth === 0
              ? 'bg-slate-900/90 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
          }`}
          style={{ marginLeft: `${depth * 20}px` }}
        >
          <span className="text-[10px] font-mono font-bold text-emerald-400 select-none">
            {depth === 0 ? 'ROOT' : `L${depth}`}
          </span>

          <input
            type="text"
            value={node.text}
            onChange={(e) => handleUpdateText(node.id, e.target.value)}
            className="flex-1 bg-transparent text-xs font-mono text-white outline-none focus:text-emerald-300"
          />

          <button
            type="button"
            onClick={() => handleAddChild(node.id)}
            title="Add MECE Sub-branch"
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>

          {depth > 0 && (
            <button
              type="button"
              onClick={() => handleDeleteNode(node.id)}
              title="Delete Branch"
              className="p-1 rounded bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 text-xs transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>

        {node.children.length > 0 && (
          <div className="flex flex-col gap-2">
            {node.children.map((child) => renderMeceNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col gap-6 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[#0b0f19] p-6 overflow-y-auto' : ''
      }`}
    >
      {/* 1. Header Toolbar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>SUBSYSTEM // LOCK-IN DEEP WORK SESSION</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
            DEEP WORK ZEN CHAMBER
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Distraction-free focus shield. 1.5x XP multiplier and stamina surge awarded on session completion.
          </p>
        </div>

        {/* Preset Selector & Fullscreen Toggle */}
        <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
          {([25, 50, 90] as LockInPresetMinutes[]).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => initLockInSession(preset)}
              className={`px-3 py-1.5 rounded font-bold transition-all ${
                activeLockIn.presetMinutes === preset
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {preset}M SPRINT
            </button>
          ))}

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Main Dual-Chamber Workspace: Timer + MECE Scratchpad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Big Timer & Focus HUD (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0e1526] border border-slate-800 rounded-lg p-6 sm:p-8 flex flex-col items-center justify-between text-center">
          <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span>DOPAMINE SHIELD: ACTIVE</span>
            </span>
            <span className="text-amber-400 font-bold">1.5X XP MULTIPLIER</span>
          </div>

          {/* Clock Display */}
          <div className="my-6 flex flex-col items-center">
            <div className="text-6xl sm:text-7xl font-mono font-extrabold text-white tracking-wider tabular-nums text-shadow">
              {formattedTime}
            </div>

            <div className="w-48 sm:w-64 h-2 bg-slate-950 rounded-full border border-slate-800 overflow-hidden mt-6">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="text-xs font-mono text-slate-500 mt-2">
              {activeLockIn.elapsedSeconds}s / {totalSeconds}s ({progressPercent}%)
            </div>
          </div>

          {/* Controls Bar */}
          <div className="w-full flex flex-col gap-3">
            <div className="flex gap-2 w-full">
              {activeLockIn.status === 'running' ? (
                <button
                  type="button"
                  onClick={() => setLockInStatus('paused')}
                  className="flex-1 py-3 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
                >
                  <Pause className="w-4 h-4 fill-slate-950" />
                  <span>PAUSE SPRINT</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setLockInStatus('running')}
                  className="flex-1 py-3 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>RESUME LOCK-IN</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => updateLockInElapsed(0)}
                className="px-4 py-3 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white font-mono text-xs transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={finishLockInSession}
                className="flex-1 py-2 px-3 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>COMPLETE EARLY (+{activeLockIn.xpEarned} XP)</span>
              </button>

              <button
                type="button"
                onClick={cancelLockInSession}
                className="py-2 px-3 rounded bg-slate-900 hover:bg-red-950/60 border border-slate-800 hover:border-red-500/40 text-slate-500 hover:text-red-400 font-mono text-xs transition-colors"
              >
                ABANDON
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: MECE Issue Tree & Thought Scratchpad (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* MECE Issue Tree Pad */}
          <div className="bg-[#0e1526] border border-slate-800 rounded-lg p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400">
                <Brain className="w-4 h-4" />
                <span>MECE ISSUE TREE // STRUCTURED DECOMPOSITION</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Mutually Exclusive, Collectively Exhaustive
              </span>
            </div>

            <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1">
              {renderMeceNode(activeLockIn.meceTree)}
            </div>
          </div>

          {/* Quick Bullet Scratchpad */}
          <div className="bg-[#0e1526] border border-slate-800 rounded-lg p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>EXECUTIVE NOTES & HYPOTHESES</span>
            </div>
            <textarea
              value={activeLockIn.notes}
              onChange={(e) => updateLockInNotes(e.target.value)}
              placeholder="Jot down active hypotheses, financial formulas, or speech pitch points during this deep work session..."
              rows={4}
              className="w-full p-3 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:border-emerald-500 outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
