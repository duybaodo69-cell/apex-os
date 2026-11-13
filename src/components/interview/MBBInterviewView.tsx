import React, { useMemo, useState } from 'react';
import { BookOpenCheck, Check, ChevronRight, RotateCcw, Target } from 'lucide-react';

type InterviewQuestion = { id: string; type: 'Fit' | 'Case' | 'Quant'; question: string; skill: string; framework: string };
const questions: InterviewQuestion[] = [
  { id: 'fit-1', type: 'Fit', question: 'Walk me through your résumé. Why consulting, and why now?', skill: 'Clear story · motivation · personal impact', framework: 'Give a 60–90 second, chronological story: a defining experience, what you learned, why consulting fits, and why this is the right next step. Make the evidence specific to you.' },
  { id: 'fit-2', type: 'Fit', question: 'Tell me about a time you led a team through a difficult challenge.', skill: 'Leadership · ownership · resilience', framework: 'Use a concise STAR arc. Clarify your personal role, the stakes, the actions you took, measurable outcome, and what you would do differently.' },
  { id: 'fit-3', type: 'Fit', question: 'Describe a time you influenced someone without formal authority.', skill: 'Influence · communication · empathy', framework: 'Explain the stakeholder’s concern, how you adapted your approach, the evidence or coalition you built, and the result.' },
  { id: 'case-1', type: 'Case', question: 'A coffee chain in Ho Chi Minh City has seen profits fall 20% while revenue is flat. How would you diagnose the problem?', skill: 'Profitability · MECE structure · local context', framework: 'Clarify the objective and timeframe. Split profit into revenue and cost; break revenue into price, volume, and mix, and costs into fixed and variable. Prioritize hypotheses and request data before recommending actions.' },
  { id: 'case-2', type: 'Case', question: 'Should a Vietnamese e-commerce company launch same-day delivery in two new cities?', skill: 'Market entry · economics · implementation', framework: 'Assess customer demand, addressable market, competitive response, operational readiness, and unit economics. Identify a pilot, success metrics, key risks, and a go/no-go threshold.' },
  { id: 'case-3', type: 'Case', question: 'A regional bank wants to improve profitability without damaging customer experience. What would you investigate?', skill: 'Growth strategy · cost · customer trade-offs', framework: 'Define profitability and customer guardrails. Examine revenue per segment, product mix, pricing, acquisition/retention, and cost-to-serve. Segment the opportunity and size the impact before prioritizing.' },
  { id: 'quant-1', type: 'Quant', question: 'A retailer has 40 stores, each serving 250 customers per day. Average spend is $8 and gross margin is 35%. Estimate daily gross profit.', skill: 'Mental math · units · concise synthesis', framework: 'State the equation: stores × customers/store/day × spend/customer × margin. Calculate in steps, keep units visible, then sanity-check the order of magnitude.' },
  { id: 'quant-2', type: 'Quant', question: 'A client’s price is $100 with 10,000 units sold. It considers a 5% price cut; assume unit volume rises 8%. What happens to revenue?', skill: 'Percent change · revenue math', framework: 'Baseline revenue = price × volume. New price = $95; new volume = 10,800. Compare new and old revenue, then explain the change and any assumptions.' },
];

export const MBBInterviewView: React.FC = () => {
  const [filter, setFilter] = useState<'All' | InterviewQuestion['type']>('All');
  const [selectedId, setSelectedId] = useState(questions[0].id);
  const [answer, setAnswer] = useState('');
  const [showFramework, setShowFramework] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const visibleQuestions = useMemo(() => questions.filter((item) => filter === 'All' || item.type === filter), [filter]);
  const selected = questions.find((item) => item.id === selectedId) ?? questions[0];
  const chooseFilter = (next: typeof filter) => { setFilter(next); const first = questions.find((item) => next === 'All' || item.type === next); if (first) setSelectedId(first.id); setShowFramework(false); };
  const markComplete = () => setCompleted((items) => items.includes(selected.id) ? items : [...items, selected.id]);

  return (
    <section aria-labelledby="interview-title" className="flex flex-col gap-6">
      <header className="rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/70 via-slate-900/80 to-slate-950 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-indigo-300"><Target className="h-4 w-4" /> MBB PREP // CASE + PERSONAL EXPERIENCE</div>
        <h1 id="interview-title" className="mt-3 text-2xl font-bold text-white sm:text-3xl">Consulting interview practice</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">Practice fit, case, and quantitative questions relevant to McKinsey, BCG, and Bain interviews. Draft your answer, then reveal a framework to self-review.</p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono text-slate-400"><span>{questions.length} PRACTICE PROMPTS</span><span>{completed.length} COMPLETED</span><span>FIT · CASE · QUANT</span></div>
      </header>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter interview questions">
        {(['All', 'Fit', 'Case', 'Quant'] as const).map((type) => <button key={type} onClick={() => chooseFilter(type)} className={`rounded-lg border px-4 py-2 text-xs font-bold transition ${filter === type ? 'border-indigo-400 bg-indigo-600 text-white' : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-white'}`}>{type}</button>)}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.7fr)]">
        <nav aria-label="Interview questions" className="flex flex-col gap-2">
          {visibleQuestions.map((item, index) => <button key={item.id} onClick={() => { setSelectedId(item.id); setShowFramework(false); }} className={`rounded-lg border p-3 text-left transition ${selectedId === item.id ? 'border-indigo-500/60 bg-indigo-950/40' : 'border-slate-800 bg-slate-900/60 hover:border-slate-600'}`}>
            <span className="flex items-center justify-between gap-2"><span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300">{item.type} · {String(index + 1).padStart(2, '0')}</span>{completed.includes(item.id) && <Check className="h-3.5 w-3.5 text-emerald-400" />}</span>
            <span className="mt-1.5 block text-xs leading-relaxed text-slate-200">{item.question}</span>
          </button>)}
        </nav>

        <article className="rounded-xl border border-slate-800 bg-[#0e1526]/90 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3"><span className="rounded-full border border-indigo-500/30 bg-indigo-950/50 px-2.5 py-1 text-[10px] font-mono font-bold text-indigo-200">{selected.type} INTERVIEW</span><span className="text-right text-[11px] text-slate-500">{selected.skill}</span></div>
          <h2 className="mt-4 text-lg font-semibold leading-relaxed text-white">{selected.question}</h2>
          <label htmlFor="interview-answer" className="mb-2 mt-5 block text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Your answer / scratchpad</label>
          <textarea id="interview-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} rows={8} placeholder={selected.type === 'Case' ? 'Start by clarifying the objective. Then outline your structure and lead with the first question you would investigate…' : 'Draft your answer here. Be specific about your role, actions, and impact…'} className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm leading-relaxed text-white outline-none placeholder:text-slate-600 focus:border-indigo-500" />
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500"><span>{answer.trim() ? answer.trim().split(/\s+/).length : 0} words</span><button type="button" onClick={() => setAnswer('')} className="inline-flex items-center gap-1 hover:text-slate-300"><RotateCcw className="h-3 w-3" /> Clear draft</button></div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => setShowFramework((value) => !value)} className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-950/50 px-4 py-2.5 text-xs font-bold text-indigo-200 hover:bg-indigo-900/60"><BookOpenCheck className="h-4 w-4" />{showFramework ? 'Hide framework' : 'Reveal answer framework'}</button>
            <button type="button" onClick={markComplete} disabled={!answer.trim()} className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"><Check className="h-4 w-4" />Mark practiced</button>
          </div>
          {showFramework && <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-950/20 p-4"><h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">A strong answer should cover</h3><p className="mt-2 text-sm leading-relaxed text-amber-100/90">{selected.framework}</p></div>}
          {completed.includes(selected.id) && <p className="mt-3 text-xs text-emerald-400">Practice marked complete for this question.</p>}
        </article>
      </div>
      <aside className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-xs leading-relaxed text-slate-400"><ChevronRight className="mr-1 inline h-3.5 w-3.5 text-indigo-400" />Practice material is for preparation, not official or guaranteed interview questions. Tailor examples to your real experience; for live case interviews, talk through your assumptions and calculations.</aside>
    </section>
  );
};
