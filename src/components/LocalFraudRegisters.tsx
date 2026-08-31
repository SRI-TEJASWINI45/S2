import { useMemo, useState } from 'react';
import { ShieldAlert, Database, Search, CircleCheck, CircleDot, CircleX } from 'lucide-react';
import type { FraudRecord } from '@/lib/types';
import { formatDate } from '@/lib/ui';

interface LocalFraudRegistersProps {
  records: FraudRecord[];
}

const REGISTERS = [
  'MHA National Watchlist',
  'Interpol Stolen Travel Documents',
  'UIDAI Duplicate Registry',
  'Regional Forgery DB',
] as const;

export function LocalFraudRegisters({ records }: LocalFraudRegistersProps) {
  const [query, setQuery] = useState('');
  const [register, setRegister] = useState<string>('all');

  const rows = useMemo(() => {
    let r = [...records];
    if (register !== 'all') r = r.filter((rec) => rec.register === register);
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(
        (rec) =>
          rec.referenceId.toLowerCase().includes(q) ||
          rec.matchType.toLowerCase().includes(q) ||
          rec.documentType.toLowerCase().includes(q)
      );
    }
    return r.sort((a, b) => new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime());
  }, [records, query, register]);

  const stats = useMemo(() => {
    const flagged = records.filter((r) => r.status === 'flagged').length;
    const review = records.filter((r) => r.status === 'under_review').length;
    const cleared = records.filter((r) => r.status === 'cleared').length;
    return { flagged, review, cleared, total: records.length };
  }, [records]);

  return (
    <div className="space-y-5">
      {/* register cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {REGISTERS.map((reg) => {
          const count = records.filter((r) => r.register === reg).length;
          const active = register === reg;
          return (
            <button
              key={reg}
              onClick={() => setRegister(active ? 'all' : reg)}
              className={`panel px-4 py-3.5 text-left transition-all ${
                active ? 'ring-1 ring-accent-500/40 bg-accent-500/5' : 'hover:bg-ink-850/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-accent-400" />
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 truncate">{reg}</p>
              </div>
              <p className="text-2xl font-bold mt-2 tabular-nums text-slate-100">{count}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">matched records</p>
            </button>
          );
        })}
      </div>

      {/* status strip */}
      <div className="grid grid-cols-3 gap-4">
        <StatusPill icon={ShieldAlert} label="Flagged" value={stats.flagged} tone="bad" />
        <StatusPill icon={CircleDot} label="Under review" value={stats.review} tone="warn" />
        <StatusPill icon={CircleCheck} label="Cleared" value={stats.cleared} tone="good" />
      </div>

      {/* toolbar */}
      <div className="panel px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-850/80 border border-ink-700/60 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reference ID, match type…"
            className="bg-transparent text-[12px] text-slate-200 placeholder:text-slate-600 outline-none w-full"
          />
        </div>
        <span className="text-[11px] font-mono text-slate-500 ml-auto">
          {register === 'all' ? 'All registers' : register}
        </span>
      </div>

      {/* table */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-ink-850/60 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-medium">Reference ID</th>
                <th className="px-4 py-3 font-medium">Document</th>
                <th className="px-4 py-3 font-medium">Match type</th>
                <th className="px-4 py-3 font-medium">Confidence</th>
                <th className="px-4 py-3 font-medium">Register</th>
                <th className="px-4 py-3 font-medium">Matched</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800/70">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[12px] text-slate-500">
                    No register matches for the current selection.
                  </td>
                </tr>
              ) : (
                rows.map((rec) => (
                  <tr key={rec.id} className="hover:bg-ink-850/40 transition-colors">
                    <td className="px-4 py-3 text-[11px] font-mono text-accent-300">{rec.referenceId}</td>
                    <td className="px-4 py-3 text-[12px] text-slate-300">{rec.documentType}</td>
                    <td className="px-4 py-3">
                      <span className="chip bg-ink-800 text-slate-300 border border-ink-700">{rec.matchType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 rounded-full bg-ink-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-danger-500"
                            style={{ width: `${rec.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                          {(rec.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-400">{rec.register}</td>
                    <td className="px-4 py-3 text-[11px] font-mono text-slate-500">{formatDate(rec.matchedAt)}</td>
                    <td className="px-4 py-3">
                      <StatusChip status={rec.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusPill({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof ShieldAlert;
  label: string;
  value: number;
  tone: 'good' | 'warn' | 'bad';
}) {
  const toneClass =
    tone === 'bad' ? 'text-danger-400 bg-danger-500/10' : tone === 'warn' ? 'text-warning-400 bg-warning-500/10' : 'text-success-400 bg-success-500/10';
  return (
    <div className="panel px-4 py-3 flex items-center gap-3">
      <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${toneClass}`}>
        <Icon className="w-4 h-4" />
      </span>
      <div>
        <p className="text-2xl font-bold tabular-nums text-slate-100 leading-none">{value}</p>
        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: FraudRecord['status'] }) {
  if (status === 'flagged')
    return (
      <span className="chip bg-danger-500/10 text-danger-400 border border-danger-500/30">
        <CircleX className="w-3 h-3" /> flagged
      </span>
    );
  if (status === 'under_review')
    return (
      <span className="chip bg-warning-500/10 text-warning-400 border border-warning-500/30">
        <CircleDot className="w-3 h-3" /> under review
      </span>
    );
  return (
    <span className="chip bg-success-500/10 text-success-400 border border-success-500/30">
      <CircleCheck className="w-3 h-3" /> cleared
    </span>
  );
}
