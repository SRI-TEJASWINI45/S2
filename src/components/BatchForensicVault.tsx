import { useMemo, useState } from 'react';
import { Archive, Search, Filter, ArrowUpDown, FileText, Image as ImageIcon } from 'lucide-react';
import type { VaultEntry, Verdict } from '@/lib/types';
import { verdictMeta, formatDate } from '@/lib/ui';

interface BatchForensicVaultProps {
  entries: VaultEntry[];
}

type SortKey = 'scannedAt' | 'integrityScore' | 'fileName';

export function BatchForensicVault({ entries }: BatchForensicVaultProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Verdict | 'all'>('all');
  const [sort, setSort] = useState<SortKey>('scannedAt');

  const rows = useMemo(() => {
    let r = [...entries];
    if (filter !== 'all') r = r.filter((e) => e.verdict === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(
        (e) =>
          e.fileName.toLowerCase().includes(q) ||
          e.referenceId.toLowerCase().includes(q) ||
          e.documentType.toLowerCase().includes(q)
      );
    }
    r.sort((a, b) => {
      if (sort === 'integrityScore') return b.integrityScore - a.integrityScore;
      if (sort === 'fileName') return a.fileName.localeCompare(b.fileName);
      return new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime();
    });
    return r;
  }, [entries, query, filter, sort]);

  const counts = useMemo(
    () => ({
      total: entries.length,
      authentic: entries.filter((e) => e.verdict === 'authentic').length,
      suspicious: entries.filter((e) => e.verdict === 'suspicious').length,
      tampered: entries.filter((e) => e.verdict === 'tampered').length,
    }),
    [entries]
  );

  return (
    <div className="space-y-5">
      {/* summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Total screened" value={counts.total} tone="neutral" />
        <SummaryCard label="Authentic" value={counts.authentic} tone="good" />
        <SummaryCard label="Suspicious" value={counts.suspicious} tone="warn" />
        <SummaryCard label="Tampered" value={counts.tampered} tone="bad" />
      </div>

      {/* toolbar */}
      <div className="panel px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-850/80 border border-ink-700/60 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search file, reference ID, type…"
            className="bg-transparent text-[12px] text-slate-200 placeholder:text-slate-600 outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          {(['all', 'authentic', 'suspicious', 'tampered'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium capitalize transition-colors ${
                filter === v
                  ? 'bg-accent-500/15 text-accent-300 border border-accent-500/30'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <button
          onClick={() =>
            setSort((s) => (s === 'scannedAt' ? 'integrityScore' : s === 'integrityScore' ? 'fileName' : 'scannedAt'))
          }
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] text-slate-400 hover:text-slate-200 border border-ink-700/60"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          sort: {sort === 'scannedAt' ? 'date' : sort === 'integrityScore' ? 'score' : 'name'}
        </button>
      </div>

      {/* table */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-ink-850/60 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-medium">Document</th>
                <th className="px-4 py-3 font-medium">Reference ID</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Scanned</th>
                <th className="px-4 py-3 font-medium">Flagged regions</th>
                <th className="px-4 py-3 font-medium">Integrity</th>
                <th className="px-4 py-3 font-medium">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800/70">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[12px] text-slate-500">
                    No documents match the current filters.
                  </td>
                </tr>
              ) : (
                rows.map((e) => {
                  const vm = verdictMeta(e.verdict);
                  const isPdf = e.fileName.toLowerCase().endsWith('.pdf');
                  return (
                    <tr key={e.id} className="hover:bg-ink-850/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-lg bg-ink-800 border border-ink-700/60 flex items-center justify-center shrink-0">
                            {isPdf ? (
                              <FileText className="w-3.5 h-3.5 text-accent-400" />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5 text-accent-400" />
                            )}
                          </span>
                          <span className="text-[12px] text-slate-200 font-mono truncate max-w-[220px]">
                            {e.fileName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[11px] font-mono text-slate-400">{e.referenceId}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-300">{e.documentType}</td>
                      <td className="px-4 py-3 text-[11px] font-mono text-slate-500">{formatDate(e.scannedAt)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`chip ${
                            e.flaggedRegions > 0
                              ? 'bg-danger-500/10 text-danger-400 border border-danger-500/30'
                              : 'bg-success-500/10 text-success-400 border border-success-500/30'
                          }`}
                        >
                          {e.flaggedRegions}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-ink-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                e.verdict === 'authentic'
                                  ? 'bg-success-500'
                                  : e.verdict === 'suspicious'
                                  ? 'bg-warning-500'
                                  : 'bg-danger-500'
                              }`}
                              style={{ width: `${e.integrityScore}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-mono text-slate-400 tabular-nums">{e.integrityScore}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`chip ${vm.bg} ${vm.text} ${vm.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${vm.dot}`} />
                          {e.verdictLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-ink-700/50 bg-ink-850/40 flex items-center gap-2">
          <Archive className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[11px] font-mono text-slate-500">
            Showing {rows.length} of {entries.length} archived screenings
          </span>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'good' | 'warn' | 'bad' | 'neutral';
}) {
  const toneClass =
    tone === 'good'
      ? 'text-success-400'
      : tone === 'warn'
      ? 'text-warning-400'
      : tone === 'bad'
      ? 'text-danger-400'
      : 'text-accent-300';
  return (
    <div className="panel px-4 py-3.5">
      <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 tabular-nums ${toneClass}`}>{value}</p>
    </div>
  );
}
