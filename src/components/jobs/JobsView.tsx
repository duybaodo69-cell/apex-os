import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, ExternalLink, MapPin, RefreshCw, Search, Sparkles } from 'lucide-react';

type JobLocation = 'HCMC' | 'Remote';
type Job = { id: string; title: string; company: string; location: string; url: string; source: string; postedAt?: string; description?: string; remote?: boolean };
type FeedState = 'loading' | 'ready' | 'error';
const roleSuggestions = ['management consultant', 'strategy analyst', 'business analyst', 'corporate finance analyst'];
const POLL_INTERVAL_MS = 15 * 60 * 1000;
const searchBoards = [
  { name: 'LinkedIn Jobs', url: (query: string, location: JobLocation) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(location === 'HCMC' ? 'Ho Chi Minh City, Vietnam' : 'Remote')}` },
  { name: 'VietnamWorks', url: (query: string) => `https://www.vietnamworks.com/jobs?keyword=${encodeURIComponent(query)}&location=Ho%20Chi%20Minh` },
  { name: 'Google Jobs', url: (query: string, location: JobLocation) => `https://www.google.com/search?q=${encodeURIComponent(`${query} jobs ${location === 'HCMC' ? 'Ho Chi Minh City Vietnam' : 'remote worldwide'}`)}` },
];

function isRelevant(job: Job, query: string, location: JobLocation): boolean {
  const searchable = `${job.title} ${job.company} ${job.location} ${job.description ?? ''}`.toLowerCase();
  const terms = query.toLowerCase().split(/\s+/).filter((term) => term.length > 2);
  const matchesRole = terms.length === 0 || terms.some((term) => searchable.includes(term));
  if (!matchesRole) return false;
  if (location === 'Remote') return Boolean(job.remote) || /remote|worldwide|anywhere/i.test(job.location);
  return /ho chi minh|hcmc|saigon|vietnam/i.test(job.location);
}

export const JobsView: React.FC = () => {
  const [query, setQuery] = useState('management consultant');
  const [location, setLocation] = useState<JobLocation>('HCMC');
  const [submittedQuery, setSubmittedQuery] = useState('management consultant');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [feedState, setFeedState] = useState<FeedState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const visibleJobs = useMemo(() => jobs.filter((job) => isRelevant(job, submittedQuery, location)), [jobs, submittedQuery, location]);

  const refreshJobs = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const params = new URLSearchParams({ q: submittedQuery, location });
      const response = await fetch(`/api/jobs?${params.toString()}`, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Job feed returned ${response.status}`);
      const data = await response.json() as { jobs?: Job[]; sources?: string[] };
      setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      setErrorMessage('');
      setFeedState('ready');
      setLastUpdated(new Date());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not refresh job feeds.');
      setFeedState((current) => jobs.length > 0 ? 'ready' : 'error');
    } finally {
      setRefreshing(false);
    }
  }, [submittedQuery, location, jobs.length]);

  useEffect(() => {
    void refreshJobs();
    const timer = window.setInterval(() => { if (document.visibilityState === 'visible') void refreshJobs(); }, POLL_INTERVAL_MS);
    const onVisible = () => { if (document.visibilityState === 'visible') void refreshJobs(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, [refreshJobs]);

  const search = (event: React.FormEvent) => { event.preventDefault(); if (query.trim()) setSubmittedQuery(query.trim()); };
  const setSuggestedQuery = (role: string) => { setQuery(role); setSubmittedQuery(role); };
  const formatPosted = (value?: string) => { if (!value) return 'Date not provided'; const date = new Date(value); return Number.isNaN(date.getTime()) ? 'Recently listed' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); };

  return <section aria-labelledby="jobs-title" className="flex flex-col gap-6">
    <header className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/60 via-slate-900/80 to-slate-950 p-6 sm:p-8">
      <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-cyan-300"><BriefcaseBusiness className="h-4 w-4" /> CAREER RADAR // VIETNAM + REMOTE</div>
      <h1 id="jobs-title" className="mt-3 text-2xl font-bold text-white sm:text-3xl">Job feed for your target roles</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">APEX checks public job feeds when you open this page and refreshes every 15 minutes while it is open. Search for target roles in Ho Chi Minh City or remote.</p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-mono">
        <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 ${feedState === 'error' ? 'border-rose-500/30 bg-rose-950/40 text-rose-300' : 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300'}`}><span className={`h-1.5 w-1.5 rounded-full ${feedState === 'error' ? 'bg-rose-400' : 'animate-pulse bg-emerald-400'}`} />{feedState === 'loading' ? 'CONNECTING' : feedState === 'error' ? 'FEED UNAVAILABLE' : 'FEED MONITORING'}</span>
        <span className="text-slate-400">{lastUpdated ? `Last checked ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Waiting for first feed check'}</span>
        <button type="button" onClick={() => void refreshJobs(true)} disabled={refreshing} className="inline-flex items-center gap-1.5 rounded border border-slate-700 px-2 py-1 text-slate-300 hover:border-cyan-500/50 disabled:opacity-50"><RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />Refresh now</button>
      </div>
    </header>

    <form onSubmit={search} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
      <label htmlFor="job-query" className="mb-2 block text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Target role or keywords</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input id="job-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. strategy analyst, consulting intern" className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-10 pr-3 text-sm text-white outline-none focus:border-cyan-500" /></div>
        <label className="sr-only" htmlFor="job-location">Location</label><select id="job-location" value={location} onChange={(event) => setLocation(event.target.value as JobLocation)} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-cyan-500"><option value="HCMC">Ho Chi Minh City, Vietnam</option><option value="Remote">Remote</option></select>
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"><Search className="h-4 w-4" />Apply filters</button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2"><span className="mr-1 text-[11px] font-mono text-slate-500">ROLE PRESETS:</span>{roleSuggestions.map((role) => <button key={role} type="button" onClick={() => setSuggestedQuery(role)} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-500/60 hover:text-cyan-200">{role}</button>)}</div>
    </form>

    <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-mono text-sm font-bold text-white">MATCHING LISTINGS <span className="text-cyan-300">({visibleJobs.length})</span></h2><p className="mt-1 text-xs text-slate-500">{submittedQuery} · {location === 'HCMC' ? 'Ho Chi Minh City, Vietnam' : 'Remote'}</p></div><div className="text-right text-[10px] font-mono text-slate-500">SOURCES: REMOTIVE · ARBEITNOW</div></div>

    {feedState === 'loading' && jobs.length === 0 && <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-sm text-slate-400"><RefreshCw className="mx-auto mb-3 h-5 w-5 animate-spin text-cyan-400" />Connecting to public job feeds…</div>}
    {feedState === 'error' && <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-5 text-sm text-rose-200">Could not load live job listings. {errorMessage} You can still use the external job-board search links below.</div>}
    {feedState !== 'loading' && visibleJobs.length === 0 && <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-sm text-slate-300"><p className="font-semibold text-white">No matching public-feed listings right now.</p><p className="mt-1 text-xs leading-relaxed text-slate-400">A public feed may not cover your market or keyword. Broaden your terms or check these job boards directly.</p></div>}
    {visibleJobs.length > 0 && <div className="grid gap-3 lg:grid-cols-2">{visibleJobs.map((job) => <article key={`${job.source}-${job.id}`} className="flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-[#0e1526]/90 p-5 transition hover:border-cyan-500/40">
      <div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-cyan-500/20 bg-cyan-950/40 px-2 py-0.5 text-[10px] font-mono text-cyan-200">{job.source}</span>{job.remote && <span className="rounded-full border border-emerald-500/20 bg-emerald-950/30 px-2 py-0.5 text-[10px] font-mono text-emerald-300">REMOTE</span>}</div><h3 className="mt-3 text-sm font-semibold text-white">{job.title}</h3><p className="mt-1 text-xs text-slate-300">{job.company}</p><p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5 text-cyan-400" />{job.location || 'Location not specified'}<span className="ml-auto">{formatPosted(job.postedAt)}</span></p>{job.description && <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-400">{job.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}</p>}</div>
      <a href={job.url} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 py-2 text-xs font-bold text-cyan-200 transition hover:bg-cyan-900/50">View original listing<ExternalLink className="h-3.5 w-3.5" /></a>
    </article>)}</div>}

    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"><h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">Search job boards directly</h2><p className="mt-1 text-xs text-slate-500">Some Vietnam job sites do not offer a public feed; use their search pages for additional HCMC listings.</p><div className="mt-3 flex flex-wrap gap-2">{searchBoards.map((board) => <a key={board.name} href={board.url(submittedQuery, location)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 hover:border-cyan-500/40 hover:text-cyan-200">{board.name}<ExternalLink className="h-3 w-3" /></a>)}</div></div>

    <aside className="flex gap-3 rounded-lg border border-amber-500/20 bg-amber-950/20 p-4 text-xs leading-relaxed text-amber-100/80"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" /><p><strong className="text-amber-200">Refresh behavior:</strong> live feed requests run when this page opens, every 15 minutes while it stays open, and when you return to the tab. A browser page cannot scan in the background after it is closed. Listings come from third-party public feeds, may be incomplete, and should be verified at the employer’s application page.</p></aside>
  </section>;
};
