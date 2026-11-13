type ApiRequest = { query?: { q?: string; location?: string }; method?: string };
type ApiResponse = { status: (code: number) => ApiResponse; setHeader: (name: string, value: string) => ApiResponse; json: (body: unknown) => void };
type FeedJob = { id: string; title: string; company: string; location: string; url: string; source: string; postedAt?: string; description?: string; remote?: boolean };

let cachedJobs: FeedJob[] = [];
let cachedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;

function within(value: string | undefined, maxLength: number): string {
  return (value ?? '').trim().slice(0, maxLength);
}

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': 'APEX-OS-job-feed/1.0' }, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!response.ok) throw new Error(`Feed request failed (${response.status})`);
  return response.json();
}

function safeText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

async function loadFeeds(query: string): Promise<{ jobs: FeedJob[]; sources: string[] }> {
  const remoteUrl = new URL('https://remotive.com/api/remote-jobs');
  if (query) remoteUrl.searchParams.set('search', query);
  const results = await Promise.allSettled([
    getJson(remoteUrl.toString()),
    getJson('https://www.arbeitnow.com/api/job-board-api'),
  ]);
  const jobs: FeedJob[] = [];
  const sources: string[] = [];

  const remotive = results[0];
  if (remotive.status === 'fulfilled') {
    const entries = (remotive.value as { jobs?: Array<Record<string, unknown>> })?.jobs;
    if (Array.isArray(entries)) {
      sources.push('Remotive');
      for (const entry of entries) jobs.push({
        id: `remotive-${safeText(entry.id)}`,
        title: safeText(entry.title),
        company: safeText(entry.company_name),
        location: safeText(entry.candidate_required_location) || 'Remote',
        url: safeText(entry.url),
        source: 'Remotive',
        postedAt: safeText(entry.publication_date),
        description: safeText(entry.description),
        remote: true,
      });
    }
  }

  const arbeitnow = results[1];
  if (arbeitnow.status === 'fulfilled') {
    const entries = (arbeitnow.value as { data?: Array<Record<string, unknown>> })?.data;
    if (Array.isArray(entries)) {
      sources.push('Arbeitnow');
      for (const entry of entries) {
        const tags = Array.isArray(entry.tags) ? entry.tags.filter((tag): tag is string => typeof tag === 'string').join(' ') : '';
        jobs.push({
          id: `arbeitnow-${safeText(entry.slug) || safeText(entry.url)}`,
          title: safeText(entry.title),
          company: safeText(entry.company_name),
          location: safeText(entry.location),
          url: safeText(entry.url),
          source: 'Arbeitnow',
          postedAt: safeText(entry.created_at),
          description: tags ? `Skills and categories: ${tags}` : undefined,
          remote: entry.remote === true,
        });
      }
    }
  }
  return { jobs, sources };
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method && req.method !== 'GET') {
    res.setHeader('Allow', 'GET').status(405).json({ error: 'Method not allowed' });
    return;
  }

  const query = within(req.query?.q, 100);
  const location = req.query?.location === 'Remote' ? 'Remote' : 'HCMC';
  try {
    if (Date.now() - cachedAt > CACHE_TTL_MS || cachedJobs.length === 0) {
      const fresh = await loadFeeds(query);
      cachedJobs = fresh.jobs;
      cachedAt = Date.now();
    }
    const terms = query.toLowerCase().split(/\s+/).filter((term) => term.length > 2);
    const jobs = cachedJobs.filter((job) => {
      const text = `${job.title} ${job.company} ${job.location} ${job.description ?? ''}`.toLowerCase();
      const roleMatch = terms.length === 0 || terms.some((term) => text.includes(term));
      const locationMatch = location === 'Remote' ? job.remote || /remote|worldwide|anywhere/i.test(job.location) : /ho chi minh|hcmc|saigon|vietnam/i.test(job.location);
      return roleMatch && locationMatch && job.url.startsWith('https://');
    });
    res.status(200).json({ jobs, sources: [...new Set(cachedJobs.map((job) => job.source))], fetchedAt: new Date(cachedAt).toISOString() });
  } catch {
    res.status(502).json({ error: 'Public job feeds are temporarily unavailable.' });
  }
}
