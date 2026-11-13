import React, { useMemo, useState } from 'react';
import { BriefcaseBusiness, ExternalLink, MapPin, Search, Sparkles } from 'lucide-react';

type JobLocation = 'HCMC' | 'Remote';
type JobBoard = {
  name: string;
  description: string;
  buildUrl: (query: string, location: JobLocation) => string;
};

const jobBoards: JobBoard[] = [
  {
    name: 'LinkedIn Jobs',
    description: 'Consulting, strategy, and analyst roles with company and seniority filters.',
    buildUrl: (query, location) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(location === 'HCMC' ? 'Ho Chi Minh City, Vietnam' : 'Remote')}`,
  },
  {
    name: 'VietnamWorks',
    description: 'Vietnam-focused vacancies, including Ho Chi Minh City employers.',
    buildUrl: (query, location) => `https://www.vietnamworks.com/jobs?keyword=${encodeURIComponent(query)}&location=${encodeURIComponent(location === 'HCMC' ? 'Ho Chi Minh' : 'Remote')}`,
  },
  {
    name: 'TopCV',
    description: 'Local listings across consulting, business analysis, and finance.',
    buildUrl: (query, location) => `https://www.topcv.vn/tim-viec-lam-${encodeURIComponent(query.trim().replace(/\s+/g, '-'))}- tai-${encodeURIComponent(location === 'HCMC' ? 'ho-chi-minh' : 'remote')}.html`.replace('- tai-', '-tai-'),
  },
  {
    name: 'Google Jobs',
    description: 'Compare listings from multiple job sites in one search.',
    buildUrl: (query, location) => `https://www.google.com/search?q=${encodeURIComponent(`${query} jobs ${location === 'HCMC' ? 'Ho Chi Minh City Vietnam' : 'remote worldwide'}`)}`,
  },
];

const roleSuggestions = ['Management consultant', 'Strategy analyst', 'Business analyst', 'Corporate finance analyst'];

export const JobsView: React.FC = () => {
  const [query, setQuery] = useState('management consultant');
  const [location, setLocation] = useState<JobLocation>('HCMC');
  const [submittedQuery, setSubmittedQuery] = useState('management consultant');
  const results = useMemo(() => jobBoards.map((board) => ({ ...board, url: board.buildUrl(submittedQuery, location) })), [submittedQuery, location]);

  const search = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) setSubmittedQuery(query.trim());
  };

  return (
    <section aria-labelledby="jobs-title" className="flex flex-col gap-6">
      <header className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/60 via-slate-900/80 to-slate-950 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-cyan-300"><BriefcaseBusiness className="h-4 w-4" /> CAREER RADAR // VIETNAM + REMOTE</div>
        <h1 id="jobs-title" className="mt-3 text-2xl font-bold text-white sm:text-3xl">Find your next consulting role</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">Search for management consulting, strategy, business analysis, and finance opportunities in Ho Chi Minh City or remote. Searches open live results on trusted job boards.</p>
      </header>

      <form onSubmit={search} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
        <label htmlFor="job-query" className="mb-2 block text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Target role or keywords</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input id="job-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. strategy analyst, consulting intern" className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-10 pr-3 text-sm text-white outline-none focus:border-cyan-500" />
          </div>
          <label className="sr-only" htmlFor="job-location">Location</label>
          <select id="job-location" value={location} onChange={(event) => setLocation(event.target.value as JobLocation)} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-cyan-500">
            <option value="HCMC">Ho Chi Minh City, Vietnam</option>
            <option value="Remote">Remote</option>
          </select>
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"><Search className="h-4 w-4" /> Update search</button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[11px] font-mono text-slate-500">QUICK SEARCH:</span>
          {roleSuggestions.map((role) => <button key={role} type="button" onClick={() => { setQuery(role); setSubmittedQuery(role); }} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-500/60 hover:text-cyan-200">{role}</button>)}
        </div>
      </form>

      <div className="flex items-center justify-between gap-3">
        <div><h2 className="font-mono text-sm font-bold text-white">SEARCH PROVIDERS</h2><p className="mt-1 text-xs text-slate-500">{submittedQuery} · {location === 'HCMC' ? 'Ho Chi Minh City, Vietnam' : 'Remote'}</p></div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-300">LIVE SEARCH LINKS</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {results.map((board) => <article key={board.name} className="flex flex-col justify-between gap-5 rounded-xl border border-slate-800 bg-[#0e1526]/90 p-5 transition hover:border-cyan-500/40">
          <div><div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-white">{board.name}</h3><MapPin className="h-4 w-4 shrink-0 text-cyan-400" /></div><p className="mt-2 text-sm leading-relaxed text-slate-400">{board.description}</p></div>
          <a href={board.url} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 py-2 text-xs font-bold text-cyan-200 transition hover:bg-cyan-900/50">Search {board.name}<ExternalLink className="h-3.5 w-3.5" /></a>
        </article>)}
      </div>
      <aside className="flex gap-3 rounded-lg border border-amber-500/20 bg-amber-950/20 p-4 text-xs leading-relaxed text-amber-100/80"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" /><p><strong className="text-amber-200">Make it your own:</strong> Search results are live external listings, not stored or verified by APEX. Adjust the role keywords for your experience level and check each employer's location, work authorization, and remote eligibility before applying.</p></aside>
    </section>
  );
};
